<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as VanButton } from 'vant'
import { onImageError } from '@/utils/image'
import img1 from '@/assets/images/meditation-1.png'
import img2 from '@/assets/images/meditation-2.png'
import img3 from '@/assets/images/meditation-3.png'
import type { MeditationCard } from '@/types'

const router = useRouter()

// 蓝湖标注：
// 标题 "精选冥想" @20,463 - 18px / line-height 25 / #333333
// 副标题 @20,489 - 12px / line-height 17 / #C4C4C4
// "查看全部" @274,460 - 81x30 - 描边 #434343 / 文字 14px
// 卡片 @20,521 起，单卡 100 宽，封面 100x99，标题 15px
const cards: MeditationCard[] = [
  { id: '1', title: '差旅', image: img1 },
  { id: '2', title: '专注', image: img2 },
  { id: '3', title: '晚安', image: img3 },
]
</script>

<template>
  <section class="meditation-section">
    <div class="meditation-section__header">
      <div class="meditation-section__titles">
        <h2 class="meditation-section__title">精选冥想</h2>
        <p class="meditation-section__subtitle">帮助专注、放松、入眠的冥想练习</p>
      </div>
      <van-button class="meditation-section__btn" plain @click="router.push('/meditation')">查看全部</van-button>
    </div>

    <div class="meditation-section__list">
      <article
        v-for="card in cards"
        :key="card.id"
        class="meditation-card"
        @click="router.push(`/meditation/${card.id}`)"
      >
        <img class="meditation-card__cover" :src="card.image" :alt="card.title" @error="onImageError" />
        <span class="meditation-card__title">{{ card.title }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.meditation-section {
  padding: 20px @page-padding 0;
  background-color: @color-bg-section;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__titles {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__title {
    font-size: @font-size-xl;
    line-height: 25px;
    font-weight: 600;
    letter-spacing: @letter-spacing-tab; // 图层宽 79px（72 + 4*2）
    color: @color-primary;
  }

  &__subtitle {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-body; // 图层宽 197px（180 + 15*1）
    color: @color-text-light;
  }

  &__btn {
    width: 81px;
    height: 30px;
    margin-top: -3px;
    padding: 0;
    border: 1px solid @color-secondary;
    border-radius: @radius-md;
    background-color: transparent;
    color: @color-secondary;
    font-size: @font-size-base;
    letter-spacing: @letter-spacing-body; // 图层宽 61px（56 + 4*1）

    :deep(.van-button__text) {
      line-height: 1;
    }
  }

  &__list {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
}

.meditation-card {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.7;
  }

  &__cover {
    width: 100px;
    height: 99px;
    border-radius: @radius-lg;
    object-fit: cover;
  }

  &__title {
    margin-top: 8px;
    font-size: @font-size-md;
    line-height: 21px;
    letter-spacing: @letter-spacing-card; // 图层宽 33px（30 + 2*1.5）
    color: @color-primary;
  }
}
</style>
