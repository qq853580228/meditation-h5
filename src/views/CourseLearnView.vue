<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NavBar as VanNavBar,
  Icon as VanIcon,
  Progress as VanProgress,
  Empty as VanEmpty,
  showToast,
} from 'vant'
import AppImage from '@/components/AppImage.vue'
import { getCourseDetail } from '@/api/modules/course'
import type { CourseItem } from '@/types'

const route = useRoute()
const router = useRouter()

const course = ref<CourseItem>()
const loaded = ref(false)

// 当前学习章节与播放状态（本地模拟播放器）
const lessonIndex = ref(0)
const playing = ref(false)
const progress = ref(0) // 当前章节进度 0-100
let timer: ReturnType<typeof setInterval> | undefined

const currentLesson = computed(() => course.value?.lessons[lessonIndex.value])

onMounted(async () => {
  try {
    course.value = await getCourseDetail(String(route.params.id))
  } finally {
    loaded.value = true
  }
})

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}

// 播放时进度每秒 +2%，播完自动切下一课
const startTimer = () => {
  stopTimer()
  timer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      progress.value = 100
      if (course.value && lessonIndex.value < course.value.lessons.length - 1) {
        showToast('本课完成，进入下一课')
        lessonIndex.value++
        progress.value = 0
      } else {
        playing.value = false
        stopTimer()
        showToast('恭喜完成全部课程')
      }
    }
  }, 1000)
}

const togglePlay = () => {
  playing.value = !playing.value
  playing.value ? startTimer() : stopTimer()
}

const selectLesson = (index: number) => {
  lessonIndex.value = index
  progress.value = 0
  if (playing.value) startTimer()
}

onBeforeUnmount(stopTimer)
</script>

<template>
  <div class="learn">
    <van-nav-bar class="learn__nav" title="正在学习" left-arrow @click-left="router.back()" />

    <template v-if="course">
      <div class="learn__player">
        <app-image class="learn__cover" :src="course.cover" fit="cover" />
        <button type="button" class="learn__play" @click="togglePlay">
          <van-icon :name="playing ? 'pause' : 'play'" size="28" color="#FFFFFF" />
        </button>
      </div>

      <section class="learn__current">
        <h1 class="learn__lesson-title">{{ currentLesson?.title }}</h1>
        <p class="learn__lesson-meta">{{ course.title }} · {{ currentLesson?.duration }}</p>
        <van-progress class="learn__progress" :percentage="progress" :show-pivot="false" stroke-width="4" />
      </section>

      <section class="learn__lessons">
        <h2 class="learn__section-title">章节目录</h2>
        <ul class="learn__list">
          <li
            v-for="(lesson, index) in course.lessons"
            :key="lesson.id"
            class="learn__lesson"
            :class="{ 'learn__lesson--active': index === lessonIndex }"
            @click="selectLesson(index)"
          >
            <van-icon
              class="learn__lesson-icon"
              :name="index === lessonIndex && playing ? 'volume-o' : 'play-circle-o'"
              size="18"
            />
            <span class="learn__lesson-name">{{ lesson.title }}</span>
            <span class="learn__lesson-duration">{{ lesson.duration }}</span>
          </li>
        </ul>
      </section>
    </template>

    <van-empty v-else-if="loaded" description="课程不存在或已下架" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.learn {
  width: 100%;
  min-height: 100vh;
  background-color: @color-white;

  &__nav {
    position: sticky;
    top: @safe-area-top;
    z-index: 20;
  }

  &__player {
    position: relative;
    margin: 12px @page-padding 0;
    height: 180px;
    border-radius: @radius-lg;
    overflow: hidden;
  }

  &__cover {
    width: 100%;
    height: 100%;

    :deep(img) {
      object-fit: cover;
    }
  }

  &__play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.18s ease;

    &:active {
      transform: translate(-50%, -50%) scale(0.92);
    }
  }

  &__current {
    margin: 16px @page-padding 0;
  }

  &__lesson-title {
    font-size: @font-size-xl;
    line-height: 25px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__lesson-meta {
    margin-top: 6px;
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }

  &__progress {
    margin-top: 12px;
  }

  &__lessons {
    margin: 24px @page-padding @page-padding;
  }

  &__section-title {
    font-size: @font-size-lg;
    line-height: 22px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__list {
    margin-top: 12px;
  }

  &__lesson {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 0;
    border-bottom: 1px solid @color-divider;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:active {
      opacity: 0.6;
    }

    &:last-child {
      border-bottom: none;
    }

    &--active {
      .learn__lesson-name,
      .learn__lesson-icon {
        color: @color-accent-orange;
      }
    }
  }

  &__lesson-icon {
    flex-shrink: 0;
    color: @color-text-light;
  }

  &__lesson-name {
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
}
</style>
