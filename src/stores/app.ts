import { ref } from 'vue'
import { defineStore } from 'pinia'

// App 公共状态：演示 pinia 选择性持久化
export const useAppStore = defineStore(
  'app',
  () => {
    const notifyEnabled = ref(true) // 消息提醒开关（持久化）
    const dailySentence = ref('')   // 每日一句（会话级，不持久化）

    return { notifyEnabled, dailySentence }
  },
  {
    persist: {
      key: 'lh-app',
      pick: ['notifyEnabled'],
    },
  },
)
