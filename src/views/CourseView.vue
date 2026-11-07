<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Progress as VanProgress, Button as VanButton, List as VanList, PullRefresh as VanPullRefresh } from 'vant'
import PageHeader from '@/components/PageHeader.vue'
import AppImage from '@/components/AppImage.vue'
import StickyBar from '@/components/StickyBar.vue'
import AppTabs from '@/components/AppTabs.vue'
import { getCourseList } from '@/api/modules/course'
import type { CourseItem, TabItem } from '@/types'

const router = useRouter()

const tabs: TabItem[] = [
  { id: 'all', label: '全部' },
  { id: 'basic', label: '入门' },
  { id: 'advanced', label: '进阶' },
]
const activeTab = ref<string>('all')

// 分页加载：van-list 触底自动触发 onLoad，下拉触发 onRefresh 重置分页
const PAGE_SIZE = 8
const courseList = ref<CourseItem[]>([])
const page = ref(0)
const loading = ref(false)    // van-list 加载态（触底 loading）
const finished = ref(false)   // 全部加载完成
const refreshing = ref(false) // 下拉刷新态

const onLoad = async () => {
  // 下拉刷新后先清空旧数据，从第 1 页重新加载
  if (refreshing.value) {
    courseList.value = []
    page.value = 0
    refreshing.value = false
  }
  try {
    const res = await getCourseList(page.value + 1, PAGE_SIZE)
    courseList.value = [...courseList.value, ...res.list]
    page.value = res.page
    if (courseList.value.length >= res.total) finished.value = true
  } finally {
    loading.value = false
  }
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

// 按 Tab 过滤课程，数据与视图解耦，便于后续接入接口
const visibleCourses = computed(() => {
  if (activeTab.value === 'all') return courseList.value
  const level = tabs.find((tab) => tab.id === activeTab.value)?.label
  return courseList.value.filter((item) => item.level === level)
})

const goDetail = (id: string) => {
  router.push(`/course/${id}`)
}
</script>

<template>
  <div class="course">
    <PageHeader class="course__header" title="课程" subtitle="系统学习冥想，循序渐进" />

    <StickyBar class="course__bar">
      <AppTabs v-model="activeTab" :tabs="tabs" shrink />
    </StickyBar>

    <van-pull-refresh v-model="refreshing" class="course__refresh" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="course__list">
          <article
            v-for="item in visibleCourses"
            :key="item.id"
            class="course-card"
            @click="goDetail(item.id)"
          >
            <app-image class="course-card__cover" :src="item.cover" fit="cover" />

            <div class="course-card__body">
              <div class="course-card__head">
                <h3 class="course-card__title">{{ item.title }}</h3>
                <span class="course-card__level">{{ item.level }}</span>
              </div>
              <p class="course-card__subtitle">{{ item.subtitle }}</p>

              <div class="course-card__meta">
                <van-progress
                  class="course-card__progress"
                  :percentage="item.progress"
                  :show-pivot="false"
                  stroke-width="3"
                />
                <span class="course-card__duration">{{ item.duration }}</span>
              </div>
            </div>

            <van-button class="course-card__btn" plain size="small">
              {{ item.progress > 0 ? '继续学习' : '开始学习' }}
            </van-button>
          </article>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.course {
  width: 100%;

  &__header {
    margin: 0 @page-padding;
  }

  &__bar {
    margin-top: 20px;
    padding: 0 @page-padding;
  }

  &__list {
    margin: 16px @page-padding @page-bottom-space;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.course-card {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: @radius-lg;
  background-color: @color-panel-bg;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.85;
  }

  &__cover {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border-radius: @radius-lg;
    overflow: hidden;

    :deep(img) {
      object-fit: cover;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__title {
    font-size: @font-size-md;
    line-height: 21px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__level {
    flex-shrink: 0;
    height: 18px;
    padding: 0 6px;
    font-size: @font-size-xs;
    line-height: 18px;
    color: @color-text-gray;
    background-color: @color-white;
    border-radius: @radius-sm;
  }

  &__subtitle {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
    padding-right: 84px;
  }

  &__progress {
    flex: 1;

    :deep(.van-progress__pivot) {
      display: none;
    }
  }

  &__duration {
    flex-shrink: 0;
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }

  &__btn {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 76px;
    height: 28px;
    padding: 0;
    border: 1px solid @color-secondary;
    border-radius: @radius-md;
    background-color: transparent;
    color: @color-secondary;
    font-size: @font-size-xs;

    :deep(.van-button__text) {
      line-height: 1;
    }
  }
}
</style>
