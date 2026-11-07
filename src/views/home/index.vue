<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StickyBar from '@/components/StickyBar.vue'
import AppTabs from '@/components/AppTabs.vue'
import AppSearch from '@/components/AppSearch.vue'
import AppBanner from '@/components/AppBanner.vue'
import DailyPost from './components/DailyPost.vue'
import MeditationSection from './components/MeditationSection.vue'
import GuideSection from './components/GuideSection.vue'
import avatarImg from '@/assets/images/avatar.png'
import { onImageError } from '@/utils/image'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { getBannerList } from '@/api/modules/course'
import type { BannerItem, TabItem } from '@/types'

const router = useRouter()
const { isLoggedIn } = storeToRefs(useUserStore())

// 头像入口：已登录进"我的"，未登录去登录页
const onAvatarClick = () => {
  router.push(isLoggedIn.value ? '/profile' : '/login')
}

// 蓝湖标注的三个 Tab：探索（激活）、冥想、睡眠
const tabs: TabItem[] = [
  { id: 'explore', label: '探索' },
  { id: 'meditation', label: '冥想' },
  { id: 'sleep', label: '睡眠' },
]

const activeTab = ref<string>('explore')

// Banner 轮播数据来自接口（开发环境由 mockjs 拦截返回）
const banners = ref<BannerItem[]>([])
onMounted(async () => {
  banners.value = await getBannerList()
})
</script>

<template>
  <div class="home">
    <StickyBar class="home__header">
      <AppTabs v-model="activeTab" :tabs="tabs" size="lg" />
      <img class="home__avatar" :src="avatarImg" alt="用户头像" @click="onAvatarClick" @error="onImageError" />
    </StickyBar>

    <AppSearch class="home__search" />

    <AppBanner class="home__banner" :items="banners" />
    <DailyPost class="home__daily" />
    <MeditationSection />
    <GuideSection class="home__guide" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

// 根节点不加 padding：底部指南图需要横向 100% 通栏，左右留白由各区块自行控制
.home {
  width: 100%;

  &__header {
    height: 107px;
    padding: 0 @page-padding;
    display: flex;
    align-items: flex-end;
  }

  &__avatar {
    position: absolute;
    top: 40px;
    right: @page-padding;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
    z-index: 2;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:active {
      opacity: 0.7;
    }
  }

  &__search {
    margin: 18px @page-padding 0;
  }

  &__banner {
    margin: 17px @page-padding 0;
  }

  &__daily {
    margin: 20px @page-padding 0;
  }

  // 指南图 @0,671 - 375x122，通栏展示；与冥想卡片底部（649）间隔 22px
  &__guide {
    margin-top: 22px;
    margin-bottom: @page-bottom-space;
  }
}
</style>
