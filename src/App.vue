<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppTabbar from '@/components/AppTabbar.vue'
import StatusBarPlaceholder from '@/components/StatusBarPlaceholder.vue'

const route = useRoute()
</script>

<template>
  <div class="app">
    <!-- 真机状态栏占位，避免内容顶到状态栏 -->
    <StatusBarPlaceholder />

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>

    <!-- 详情/登录等沉浸式页面通过 meta.tabbar = false 隐藏底部导航 -->
    <AppTabbar v-if="route.meta.tabbar !== false" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.app {
  min-height: 100vh;
  background-color: @color-white;
}
</style>
