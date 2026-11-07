<script setup lang="ts">
import dailyCover from '@/assets/images/daily-cover.png'
import { onImageError } from '@/utils/image'
import type { DailyPost } from '@/types'

// 蓝湖标注：
// 卡片 @20,374 - 335x69 - #E7EEFF - 圆角 10
// 头像 @35,385 - 48x47 - 圆角 10
// 数字 "10" - 20px / #FFFFFF / 居中
// 标题 "听声日贴" @95,390 - 14px / #333333
// NEW 标签 @168,388 - 48x24 - #FBDDD1 / 文字 #EF662F 12px
// 描述 @95,415 - 12px / #717171
const post: DailyPost = {
  id: '1',
  number: '10',
  title: '听声日贴',
  tag: 'NEW',
  content: '我来到这个世上，是为了认识太阳和高天的蓝',
}
</script>

<template>
  <article class="daily-post">
    <div class="daily-post__avatar">
      <img class="daily-post__cover" :src="dailyCover" alt="" @error="onImageError" />
      <span class="daily-post__number">{{ post.number }}</span>
    </div>

    <div class="daily-post__info">
      <div class="daily-post__header">
        <span class="daily-post__title">{{ post.title }}</span>
        <span v-if="post.tag" class="daily-post__tag">{{ post.tag }}</span>
      </div>
      <p class="daily-post__content">{{ post.content }}</p>
    </div>
  </article>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

// 不写 width:100%，避免与页面 margin 叠加向右溢出
.daily-post {
  height: 69px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: @color-card-bg-light;
  border-radius: @radius-lg;

  &__avatar {
    position: relative;
    flex-shrink: 0;
    width: 48px;
    height: 47px;
    border-radius: @radius-lg;
    overflow: hidden;
    background: linear-gradient(135deg, @color-avatar-gradient-start 0%, @color-avatar-gradient-end 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__number {
    position: absolute;
    font-size: 20px;
    line-height: 1;
    font-weight: 600;
    color: @color-white;
    text-align: center;
  }

  &__info {
    align-self: flex-start;
    margin-top: 14px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__title {
    font-size: @font-size-base;
    line-height: 20px;
    letter-spacing: @letter-spacing-body; // 图层宽 59px（56 + 4*1）
    color: @color-primary;
  }

  &__tag {
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-size: @font-size-xs;
    line-height: 1;
    color: @color-accent-orange;
    background-color: @color-new-tag-bg;
    border-radius: @radius-md;
  }

  &__content {
    font-size: @font-size-xs;
    line-height: 17px;
    color: @color-text-gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
