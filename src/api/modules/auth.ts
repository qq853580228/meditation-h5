import { http } from '..'
import type { AuthUser } from '@/types'

export interface LoginParams {
  phone: string
  password: string
  nickname?: string
}

export interface LoginResult {
  token: string
  refreshToken: string
  user: AuthUser
}

export const loginApi = (data: LoginParams) =>
  http.instance.post<unknown, LoginResult>('/auth/login', data, { skipAuth: true })

export const refreshTokenApi = (refreshToken: string) =>
  http.instance.post<unknown, { token: string }>(
    '/auth/refresh',
    { refreshToken },
    { skipAuth: true, __isRefresh: true },
  )
