<script setup lang="ts">
import guideBg from '@/assets/images/guide-bg.png'
import { onImageError } from '@/utils/image'
import type { GuideCard } from '@/types'

// 蓝湖标注：@0,671 - 375x122
// 标题 "冥想入门指南" @20.1,698 - 16px / line-height 22 / #585757
// 副标题 @20.1,724 - 12px / line-height 17 / #717171
const guide: GuideCard = {
  title: '冥想入门指南',
  subtitle: '18个常见新手疑问',
  background: guideBg,
}
</script>

<template>
  <section class="guide-section">
    <img class="guide-section__bg" :src="guide.background" alt="" @error="onImageError" />
    <div class="guide-section__content">
      <h3 class="guide-section__title">{{ guide.title }}</h3>
      <p class="guide-section__subtitle">{{ guide.subtitle }}</p>
    </div>
  </section>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.guide-section {
  position: relative;
  height: 122px;
  overflow: hidden;

  &__bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    position: absolute;
    top: 27px;
    left: @page-padding;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: @font-size-lg;
    line-height: 22px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body; // 图层宽 102px（96 + 6*1）
    color: @color-dark-gray;
  }

  &__subtitle {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption; // 图层宽 103px（约 97 + 9*0.5）
    color: @color-text-gray;
  }
}
</style>
