<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Tag as VanTag, Icon as VanIcon } from 'vant'
import PageHeader from '@/components/PageHeader.vue'
import AppSearch from '@/components/AppSearch.vue'
import AppImage from '@/components/AppImage.vue'
import { getDiscoverTopics } from '@/api/modules/course'
import type { DiscoverTopic } from '@/types'

const router = useRouter()

// 场景筛选
const filters = ['全部', '助眠', '解压', '专注', '情绪']
const activeFilter = ref('全部')

// 主题数据来自接口（开发环境由 mockjs 拦截返回）
const topics = ref<DiscoverTopic[]>([])
onMounted(async () => {
  topics.value = await getDiscoverTopics()
})
</script>

<template>
  <div class="discover">
    <PageHeader class="discover__header" title="发现" subtitle="找到适合此刻的练习" />

    <AppSearch class="discover__search" placeholder="搜索冥想、课程或老师" />

    <div class="discover__filters">
      <button
        v-for="item in filters"
        :key="item"
        type="button"
        class="discover__filter"
        :class="{ 'discover__filter--active': item === activeFilter }"
        @click="activeFilter = item"
      >
        {{ item }}
      </button>
    </div>

    <section class="discover__section">
      <h2 class="discover__section-title">热门主题</h2>

      <div class="discover__grid">
        <article
          v-for="topic in topics"
          :key="topic.id"
          class="topic-card"
          @click="router.push(`/meditation/${topic.id}`)"
        >
          <div class="topic-card__cover-wrap">
            <app-image class="topic-card__cover" :src="topic.cover" fit="cover" />
            <van-tag
              v-if="topic.tag"
              class="topic-card__tag"
              round
              color="var(--lh-color-new-tag-bg)"
              text-color="var(--lh-color-accent)"
            >
              {{ topic.tag }}
            </van-tag>
          </div>
          <h3 class="topic-card__title">{{ topic.title }}</h3>
          <p class="topic-card__subtitle">{{ topic.subtitle }}</p>
          <div class="topic-card__plays">
            <van-icon name="play-circle-o" />
            <span>{{ topic.plays }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.discover {
  width: 100%;

  &__header {
    margin: 0 @page-padding;
  }

  &__search {
    margin: 16px @page-padding 0;
  }

  &__filters {
    margin: 20px @page-padding 0;
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__filter {
    flex-shrink: 0;
    height: 30px;
    padding: 0 16px;
    border: none;
    border-radius: 15px;
    background-color: @color-bg-search;
    color: @color-text-gray;
    font-size: @font-size-sm;
    line-height: 1;
    letter-spacing: @letter-spacing-caption;

    &--active {
      background-color: @color-primary;
      color: @color-white;
    }
  }

  &__section {
    margin: 24px @page-padding @page-bottom-space;
  }

  &__section-title {
    font-size: @font-size-xl;
    line-height: 25px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__grid {
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 13px;
  }
}

.topic-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.85;
  }

  &__cover-wrap {
    position: relative;
    width: 100%;
    height: 140px;
    border-radius: @radius-lg;
    overflow: hidden;
  }

  &__cover {
    width: 100%;
    height: 100%;
    display: block;

    :deep(img) {
      object-fit: cover;
    }
  }

  &__tag {
    position: absolute;
    top: 8px;
    left: 8px;
    height: 20px;
    padding: 0 8px;
    font-size: @font-size-xs;
    line-height: 20px;
  }

  &__title {
    font-size: @font-size-md;
    line-height: 21px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
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

  &__plays {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: @font-size-xs;
    line-height: 17px;
    color: @color-text-light;
  }
}
</style>
