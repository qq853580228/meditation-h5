import router from '@/router'
import { useUserStore } from '@/stores/user'
import { createHttp } from './http'

// 全局 HTTP 实例：横切能力在此装配，新增能力只改配置不动核心（开闭原则）
// 注：store 与 api 互相引用，但均在运行时函数内取值，模块初始化时无循环求值
export const http = createHttp({
  baseURL: '/api',
  timeout: 10000,
  maxConcurrent: 5, // 最大并发请求数，超出排队
  retry: 2, // 弱网默认重试 2 次（指数退避）
  retryDelay: 500,
  getToken: () => useUserStore().token,
  onRefreshToken: () => useUserStore().refresh(),
  onUnauthorized: () => {
    useUserStore().logout()
    router.replace('/login')
  },
})

export const { instance: axiosInstance, cancelAll: cancelAllRequests } = http
