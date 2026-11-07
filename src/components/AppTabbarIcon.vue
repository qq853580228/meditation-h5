<script setup lang="ts">
interface Props {
  name: string
  active?: boolean
}

withDefaults(defineProps<Props>(), { active: false })
</script>

<template>
  <!-- 首页 -->
  <svg
    v-if="name === 'home'"
    class="tabbar-icon"
    viewBox="0 0 24 24"
    :fill="active ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linejoin="round"
  >
    <path d="M3.5 10.6 12 3.4l8.5 7.2V20a1 1 0 0 1-1 1h-5.2v-6h-4.6v6H4.5a1 1 0 0 1-1-1v-9.4Z" />
    <rect v-if="active" x="9.8" y="15" width="4.4" height="6" fill="var(--lh-color-white)" stroke="none" />
  </svg>

  <!-- 发现 -->
  <svg
    v-else-if="name === 'discover'"
    class="tabbar-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="8.6" />
    <path d="m15.4 8.6-2 5.8-5.8 2 2-5.8 5.8-2Z" :fill="active ? 'currentColor' : 'none'" />
  </svg>

  <!-- 课程 -->
  <svg
    v-else-if="name === 'course'"
    class="tabbar-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2.4" />
    <path d="M11 4v16" :stroke-width="active ? 1.6 : 1.4" />
    <circle v-if="active" cx="7.5" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <path v-else d="M7.5 10.4v3.2" stroke-width="1.4" />
  </svg>

  <!-- 我的 -->
  <svg
    v-else
    class="tabbar-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
  >
    <circle cx="12" cy="12" r="8.6" />
    <path d="M8.8 14.2c.9 1.1 2 1.7 3.2 1.7s2.3-.6 3.2-1.7" />
    <circle cx="9.3" cy="10" r="1.1" :fill="active ? 'currentColor' : 'none'" />
    <circle cx="14.7" cy="10" r="1.1" :fill="active ? 'currentColor' : 'none'" />
  </svg>
</template>

<style scoped lang="less">
.tabbar-icon {
  width: 26px;
  height: 26px;
  display: block;
}
</style>
