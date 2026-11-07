<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabbar as VanTabbar, TabbarItem as VanTabbarItem } from 'vant'
import AppTabbarIcon from '@/components/AppTabbarIcon.vue'
import type { NavItem } from '@/types'

const route = useRoute()
const router = useRouter()

const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: 'home', path: '/' },
  { id: 'discover', label: '发现', icon: 'discover', path: '/discover' },
  { id: 'course', label: '课程', icon: 'course', path: '/course' },
  { id: 'mine', label: '我的', icon: 'mine', path: '/profile' },
]

// 当前高亮项取自路由 meta，保证刷新后状态一致
const active = computed<string>(() => (route.meta.tab as string) ?? 'home')

const onChange = (name: string | number) => {
  const target = navItems.find((item) => item.id === String(name))
  if (target && target.path !== route.path) {
    router.push(target.path)
  }
}
</script>

<template>
  <van-tabbar
    class="app-tabbar"
    :model-value="active"
    fixed
    :border="false"
    safe-area-inset-bottom
    @change="onChange"
  >
    <van-tabbar-item v-for="item in navItems" :key="item.id" :name="item.id">
      <template #icon="{ active: isActive }">
        <app-tabbar-icon :name="item.icon" :active="isActive" />
      </template>
      {{ item.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.app-tabbar {
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 750px;
  border-top: 1px solid @color-divider;

  :deep(.van-tabbar-item__icon) {
    margin-bottom: 4px;
  }

  :deep(.van-tabbar-item__text) {
    font-size: 10px;
    line-height: 1;
  }
}
</style>
