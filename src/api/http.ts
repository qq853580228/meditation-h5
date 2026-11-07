import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

/**
 * HTTP 核心封装（与业务解耦，遵循开闭原则）：
 * 所有横切能力通过 HttpOptions 注入，新增能力只扩展配置/拦截器，不修改核心。
 * - 并发限制：maxConcurrent + 内部队列
 * - 弱网重试：网络错误/超时/5xx 指数退避重试
 * - 请求取消：cancelKey 去重（同 key 新请求取消旧请求）+ cancelAll
 * - 401 无感刷新：onRefreshToken 单飞刷新，期间请求排队，刷新后重放
 */

/** 通过模块增强扩展 axios 请求配置（开闭原则：扩展字段而非包装类型） */
declare module 'axios' {
  interface AxiosRequestConfig {
    retry?: number          // 覆盖全局重试次数
    retryDelay?: number     // 覆盖全局重试基础延迟
    skipAuth?: boolean      // 跳过 token 注入（登录/刷新接口）
    cancelKey?: string      // 同 key 请求自动取消前一次
    __isRefresh?: boolean   // 内部：标记刷新请求，避免 401 循环刷新
    __retryCount?: number   // 内部：已重试次数
  }
}

type InternalConfig = InternalAxiosRequestConfig

export interface HttpOptions {
  baseURL?: string
  timeout?: number
  maxConcurrent?: number                       // 最大并发请求数，默认 6
  retry?: number                               // 默认重试次数，默认 2
  retryDelay?: number                          // 重试基础延迟 ms（指数退避），默认 500
  getToken?: () => string                      // 注入 token 获取方式
  onRefreshToken?: () => Promise<string>       // 401 时刷新 token，返回新 token
  onUnauthorized?: () => void                  // 刷新失败兜底（如跳登录页）
}

/** 判断是否可重试的错误：网络异常、超时、5xx */
const isRetryable = (error: AxiosError) => {
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') return true
  const status = error.response?.status
  return status !== undefined && status >= 500
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createHttp(options: HttpOptions = {}) {
  const {
    baseURL = '/api',
    timeout = 10000,
    maxConcurrent = 6,
    retry = 2,
    retryDelay = 500,
    getToken,
    onRefreshToken,
    onUnauthorized,
  } = options

  const instance: AxiosInstance = axios.create({ baseURL, timeout })

  // ---- 并发限制：令牌槽 + 等待队列 ----
  let running = 0
  const queue: Array<() => void> = []
  const acquire = () =>
    running < maxConcurrent
      ? (running++, Promise.resolve())
      : new Promise<void>((resolve) => queue.push(() => (running++, resolve())))
  const release = () => {
    running--
    queue.shift()?.()
  }

  // ---- 请求取消：cancelKey 注册表 ----
  const pendingCancels = new Map<string, AbortController>()
  const registerCancel = (config: InternalConfig) => {
    if (!config.cancelKey) return
    pendingCancels.get(config.cancelKey)?.abort('duplicate request')
    const controller = new AbortController()
    config.signal = controller.signal
    pendingCancels.set(config.cancelKey, controller)
  }
  const unregisterCancel = (config?: InternalConfig) => {
    if (config?.cancelKey && pendingCancels.get(config.cancelKey)?.signal === config.signal) {
      pendingCancels.delete(config.cancelKey)
    }
  }
  const cancelAll = (reason = 'cancelAll') => {
    pendingCancels.forEach((controller) => controller.abort(reason))
    pendingCancels.clear()
  }

  // ---- 401 无感刷新：单飞 + 等待队列 ----
  let refreshing: Promise<string> | null = null
  const doRefresh = () => {
    if (!refreshing) {
      if (!onRefreshToken) return Promise.reject(new Error('no refresh handler'))
      refreshing = onRefreshToken().finally(() => (refreshing = null))
    }
    return refreshing
  }

  instance.interceptors.request.use(async (raw) => {
    const config = raw as InternalConfig
    await acquire() // 并发闸门
    try {
      const token = getToken?.()
      if (token && !config.skipAuth) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
      registerCancel(config)
      return config
    } catch (error) {
      release()
      throw error
    }
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      release()
      unregisterCancel(response.config as InternalConfig)
      // 统一解包 { code, data, message }，业务错误按失败处理
      const body = response.data
      // mockjs 拦截发生在 JS 层、不进 Network 面板，dev 下在控制台打印请求链路
      // （用 console.log 而非 debug：debug 属于 Verbose 级别，DevTools 默认隐藏）
      if (import.meta.env.DEV) {
        const { method, baseURL, url, params } = response.config
        console.log(`[http] ${method?.toUpperCase()} ${baseURL ?? ''}${url}`, params ?? '', body)
      }
      if (body && typeof body === 'object' && 'code' in body) {
        if (body.code === 0) return body.data
        return Promise.reject(new Error(body.message || '请求失败'))
      }
      return body
    },
    async (error: AxiosError) => {
      release()
      const config = error.config as InternalConfig | undefined
      unregisterCancel(config)
      if (!config || axios.isCancel(error)) return Promise.reject(error)

      // 401：无感刷新 token 并重放原请求
      if (error.response?.status === 401 && !config.__isRefresh && onRefreshToken) {
        try {
          const newToken = await doRefresh()
          config.headers.set('Authorization', `Bearer ${newToken}`)
          return instance.request(config)
        } catch (refreshError) {
          onUnauthorized?.()
          return Promise.reject(refreshError)
        }
      }

      // 弱网重试：指数退避
      config.__retryCount = config.__retryCount ?? 0
      const maxRetry = config.retry ?? retry
      if (isRetryable(error) && config.__retryCount < maxRetry) {
        config.__retryCount++
        await sleep((config.retryDelay ?? retryDelay) * 2 ** (config.__retryCount - 1))
        return instance.request(config)
      }

      if (import.meta.env.DEV) {
        console.warn(
          `[http] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url} 请求失败（已重试 ${config.__retryCount} 次）:`,
          error.message,
        )
      }
      return Promise.reject(error)
    },
  )

  return { instance, cancelAll }
}

export type Http = ReturnType<typeof createHttp>
