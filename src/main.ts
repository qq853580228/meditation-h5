import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vant/lib/index.css'
import '@/styles/global.less'
import App from './App.vue'
import router from './router'

// 开发环境接口由 Vite 中间件 mock 服务提供（见 vite.config.ts），真实 HTTP 请求

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
