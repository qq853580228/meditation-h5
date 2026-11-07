<script setup lang="ts">
import { useStickyHeader } from '@/composables/useStickyHeader'

// 吸顶容器：向下滚动隐藏、向上滚动显示，供首页 Tab、课程 Tab 等复用
const { hidden } = useStickyHeader()
</script>

<template>
  <div class="sticky-bar" :class="{ 'sticky-bar--hidden': hidden }">
    <slot />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.sticky-bar {
  position: sticky;
  top: @safe-area-top;
  z-index: 20;
  background-color: @color-white;
  will-change: transform;
  transition: transform 0.25s ease;

  &--hidden {
    transform: translateY(-100%);
  }
}
</style>
