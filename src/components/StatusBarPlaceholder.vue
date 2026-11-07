<script setup lang="ts">
// 真机状态栏占位：吸顶展示，高度取设备安全区，避免页面内容被状态栏遮挡
</script>

<template>
  <div class="status-bar-placeholder"></div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.status-bar-placeholder {
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  height: @safe-area-top;
  background-color: @color-white;
}
</style>
