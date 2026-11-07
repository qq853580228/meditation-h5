<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar as VanNavBar, Icon as VanIcon, Loading as VanLoading, Empty as VanEmpty } from 'vant'
import AppImage from '@/components/AppImage.vue'
import { getMeditationList } from '@/api/modules/meditation'
import { formatViews } from '@/utils/format'
import type { MeditationItem } from '@/types'

const router = useRouter()
const list = ref<MeditationItem[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    list.value = await getMeditationList()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="meditation-list">
    <van-nav-bar class="meditation-list__nav" title="精选冥想" left-arrow @click-left="router.back()" />

    <div v-if="loading" class="meditation-list__loading">
      <van-loading size="24px">加载中...</van-loading>
    </div>

    <van-empty v-else-if="list.length === 0" description="暂无内容" />

    <div v-else class="meditation-list__grid">
      <article
        v-for="item in list"
        :key="item.id"
        class="meditation-item"
        @click="router.push(`/meditation/${item.id}`)"
      >
        <app-image class="meditation-item__cover" :src="item.image" fit="cover" />
        <div class="meditation-item__body">
          <h3 class="meditation-item__title">{{ item.title }}</h3>
          <div class="meditation-item__meta">
            <van-icon name="eye-o" size="12" />
            <span>{{ formatViews(item.views) }}</span>
            <span class="meditation-item__dot">·</span>
            <span>{{ item.duration }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.meditation-list {
  width: 100%;
  min-height: 100vh;
  background-color: @color-white;

  &__nav {
    position: sticky;
    top: @safe-area-top;
    z-index: 20;
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  &__grid {
    padding: 16px @page-padding @page-padding;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px 13px;
  }
}

.meditation-item {
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.85;
  }

  &__cover {
    width: 100%;
    height: 120px;
    border-radius: @radius-lg;
    overflow: hidden;

    :deep(img) {
      object-fit: cover;
    }
  }

  &__body {
    margin-top: 8px;
  }

  &__title {
    font-size: @font-size-md;
    line-height: 21px;
    font-weight: 600;
    letter-spacing: @letter-spacing-card;
    color: @color-primary;
  }

  &__meta {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }

  &__dot {
    margin: 0 2px;
  }
}
</style>
