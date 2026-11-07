import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginApi, refreshTokenApi, type LoginParams } from '@/api/modules/auth'
import type { AuthUser } from '@/types'

// 用户全局状态：token 与用户信息持久化到 localStorage
export const useUserStore = defineStore(
  'user',
  () => {
    // ---- state ----
    const token = ref('')
    const refreshToken = ref('')
    const user = ref<AuthUser | null>(null)

    // ---- getters ----
    const isLoggedIn = computed(() => Boolean(token.value))

    // ---- actions ----
    async function login(params: LoginParams) {
      const res = await loginApi(params)
      token.value = res.token
      refreshToken.value = res.refreshToken
      user.value = res.user
    }

    // 401 无感刷新：返回新 token 供 http 层重放原请求
    async function refresh() {
      const res = await refreshTokenApi(refreshToken.value)
      token.value = res.token
      return res.token
    }

    function logout() {
      token.value = ''
      refreshToken.value = ''
      user.value = null
    }

    return { token, refreshToken, user, isLoggedIn, login, refresh, logout }
  },
  {
    persist: {
      key: 'lh-user',
      pick: ['token', 'refreshToken', 'user'],
    },
  },
)
