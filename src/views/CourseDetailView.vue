<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NavBar as VanNavBar,
  Progress as VanProgress,
  Button as VanButton,
  Icon as VanIcon,
  Empty as VanEmpty,
} from 'vant'
import AppImage from '@/components/AppImage.vue'
import { getCourseDetail } from '@/api/modules/course'
import type { CourseItem } from '@/types'

const route = useRoute()
const router = useRouter()

// 详情数据来自接口（开发环境由 mockjs 拦截返回）
const course = ref<CourseItem>()
const loaded = ref(false)

onMounted(async () => {
  try {
    course.value = await getCourseDetail(String(route.params.id))
  } catch {
    course.value = undefined
  } finally {
    loaded.value = true
  }
})

const onStart = () => {
  // 进入课程学习页（模拟播放器）
  router.push(`/course/${String(route.params.id)}/learn`)
}
</script>

<template>
  <div class="course-detail">
    <van-nav-bar class="course-detail__nav" title="课程详情" left-arrow @click-left="router.back()" />

    <template v-if="course">
      <app-image class="course-detail__cover" :src="course.cover" fit="cover" />

      <section class="course-detail__info">
        <div class="course-detail__head">
          <h1 class="course-detail__title">{{ course.title }}</h1>
          <span class="course-detail__level">{{ course.level }}</span>
        </div>
        <p class="course-detail__subtitle">{{ course.subtitle }}</p>

        <div class="course-detail__meta">
          <span class="course-detail__meta-item">{{ course.duration }}</span>
          <span class="course-detail__meta-item">{{ course.lessons.length }} 个章节</span>
        </div>

        <div class="course-detail__progress">
          <van-progress :percentage="course.progress" :show-pivot="false" stroke-width="4" />
          <span class="course-detail__progress-text">已学习 {{ course.progress }}%</span>
        </div>
      </section>

      <section class="course-detail__section">
        <h2 class="course-detail__section-title">课程介绍</h2>
        <p class="course-detail__desc">{{ course.desc }}</p>
      </section>

      <section class="course-detail__section">
        <h2 class="course-detail__section-title">章节目录</h2>
        <ul class="course-detail__lessons">
          <li v-for="(lesson, index) in course.lessons" :key="lesson.id" class="course-detail__lesson">
            <span class="course-detail__lesson-index">{{ index + 1 }}</span>
            <span class="course-detail__lesson-title">{{ lesson.title }}</span>
            <span class="course-detail__lesson-duration">{{ lesson.duration }}</span>
            <van-icon class="course-detail__lesson-icon" name="play-circle-o" size="18" />
          </li>
        </ul>
      </section>

      <!-- 底部固定操作栏 -->
      <footer class="course-detail__footer">
        <van-button class="course-detail__cta" block round type="primary" @click="onStart">
          {{ course.progress > 0 ? `继续学习 · ${course.progress}%` : '开始学习' }}
        </van-button>
      </footer>
    </template>

    <van-empty v-else-if="loaded" description="课程不存在或已下架">
      <van-button class="course-detail__back" round type="primary" @click="router.replace('/course')">
        返回课程列表
      </van-button>
    </van-empty>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.course-detail {
  width: 100%;
  min-height: 100vh;
  background-color: @color-white;

  &__nav {
    // 与全局状态栏占位衔接，保持顶部风格一致
    position: sticky;
    top: @safe-area-top;
    z-index: 20;
    background-color: @color-white;
  }

  // van-image 默认 inline-block 会收缩到图片宽度，display block 让宽度自动填充、高度固定
  &__cover {
    display: block;
    margin: 12px @page-padding 0;
    width: auto;
    height: 180px;
    border-radius: @radius-lg;
    overflow: hidden;

    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    margin: 16px @page-padding 0;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: @font-size-xxl;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__level {
    flex-shrink: 0;
    height: 20px;
    padding: 0 8px;
    font-size: @font-size-xs;
    line-height: 20px;
    color: @color-accent-orange;
    background-color: @color-new-tag-bg;
    border-radius: @radius-sm;
  }

  &__subtitle {
    margin-top: 6px;
    font-size: @font-size-base;
    line-height: 20px;
    letter-spacing: @letter-spacing-body;
    color: @color-text-gray;
  }

  &__meta {
    margin-top: 10px;
    display: flex;
    gap: 12px;
  }

  &__meta-item {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }

  &__progress {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__progress-text {
    flex-shrink: 0;
    font-size: @font-size-xs;
    line-height: 17px;
    color: @color-text-light;
  }

  &__section {
    margin: 24px @page-padding 0;
  }

  &__section-title {
    font-size: @font-size-lg;
    line-height: 22px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__desc {
    margin-top: 10px;
    font-size: @font-size-base;
    line-height: 24px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
  }

  &__lessons {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
  }

  &__lesson {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid @color-divider;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:active {
      opacity: 0.6;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__lesson-index {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: @color-panel-bg;
    font-size: @font-size-xs;
    line-height: 24px;
    text-align: center;
    color: @color-text-gray;
  }

  &__lesson-title {
    flex: 1;
    min-width: 0;
    font-size: @font-size-base;
    line-height: 20px;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__lesson-duration {
    flex-shrink: 0;
    font-size: @font-size-xs;
    line-height: 17px;
    color: @color-text-light;
  }

  &__lesson-icon {
    flex-shrink: 0;
    color: @color-text-light;
  }

  &__footer {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 100%;
    max-width: 750px;
    padding: 8px @page-padding calc(@safe-area-bottom + 8px);
    background-color: @color-white;
    border-top: 1px solid @color-divider;
  }

  &__cta {
    height: 44px;
    font-size: @font-size-lg;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
  }

  &__back {
    width: 160px;
  }

  // 章节列表底部预留固定操作栏高度（8+44+8）+ 安全区 + 间距
  &__lessons {
    padding-bottom: calc(60px + @safe-area-bottom + 20px);
  }
}
</style>
