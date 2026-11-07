<script setup lang="ts">
import { ref } from 'vue'
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
import { onImageError } from '@/utils/image'
import type { BannerItem } from '@/types'

interface Props {
  /** 轮播数据，由外部传入 */
  items: BannerItem[]
  /** 自动轮播间隔（ms），0 为关闭 */
  autoplay?: number
  /** 切换动画时长（ms） */
  duration?: number
}

withDefaults(defineProps<Props>(), {
  autoplay: 3500,
  duration: 500,
})

const current = ref(0)
</script>

<template>
  <van-swipe
    class="app-banner"
    :autoplay="autoplay"
    :duration="duration"
    :show-indicators="false"
    @change="current = $event"
  >
    <van-swipe-item v-for="item in items" :key="item.id" class="app-banner__slide">
      <img class="app-banner__bg" :src="item.image" alt="" @error="onImageError" />

      <div class="app-banner__content">
        <span class="app-banner__title">{{ item.title }}</span>
        <h3 class="app-banner__subtitle">{{ item.subtitle }}</h3>
      </div>
    </van-swipe-item>

    <!-- 蓝湖标注的自定义分页指示，避免 Vant 默认样式破坏还原 -->
    <template #indicator="{ active }">
      <div class="app-banner__indicators">
        <span
          v-for="(_, index) in items"
          :key="index"
          class="app-banner__dot"
          :class="{ 'app-banner__dot--active': index === active }"
        ></span>
      </div>
    </template>
  </van-swipe>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

// 蓝湖标注：335x159，圆角 10
// 注意不写 width:100%：块级元素自动占满扣除外部 margin 后的宽度，
// 否则与页面 margin 叠加会向右溢出，表现为「只有左边距没有右边距」
.app-banner {
  position: relative;
  height: 159px;
  border-radius: @radius-lg;
  overflow: hidden;

  &__slide {
    position: relative;
    height: 100%;
  }

  :deep(.van-swipe__track) {
    height: 100%;
  }

  &__bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    position: absolute;
    left: 15px;
    bottom: 37px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__title {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption; // 图层宽 76px（72 + 6*0.5）
    color: @color-white-soft;
  }

  &__subtitle {
    font-size: @font-size-md;
    line-height: 21px;
    font-weight: 500;
    letter-spacing: @letter-spacing-body; // 图层宽 142px（135 + 9*1）
    color: @color-white;
  }

  &__indicators {
    position: absolute;
    left: 15px;
    bottom: 15px;
    display: flex;
    gap: 4px;
  }

  &__dot {
    width: 8px;
    height: 4px;
    border-radius: @radius-sm;
    background-color: @color-tab-inactive;
    transition: background-color 0.2s ease;

    &--active {
      background-color: @color-white;
    }
  }
}
</style>
