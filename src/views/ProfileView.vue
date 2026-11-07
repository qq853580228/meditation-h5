<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { CellGroup as VanCellGroup, Cell as VanCell, Switch as VanSwitch, Button as VanButton, Icon as VanIcon, showSuccessToast } from 'vant'
import PageHeader from '@/components/PageHeader.vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import avatarImg from '@/assets/images/avatar.png'
import { onImageError } from '@/utils/image'
import type { MenuItem, UserStat } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)
// 消息提醒开关：pinia 持久化，刷新后保留
const { notifyEnabled } = storeToRefs(useAppStore())

// 用户卡：未登录去登录页，已登录进入资料详情页
const onUserClick = () => {
  router.push(isLoggedIn.value ? '/profile/info' : '/login')
}

const onAuthAction = () => {
  if (isLoggedIn.value) {
    userStore.logout()
    showSuccessToast('已退出登录')
  } else {
    router.push('/login')
  }
}

const stats: UserStat[] = [
  { id: 'days', label: '练习天数', value: '128' },
  { id: 'hours', label: '累计时长', value: '46' },
  { id: 'streak', label: '连续打卡', value: '12' },
]

const menus: MenuItem[] = [
  { id: 'favorite', title: '我的收藏', icon: 'star-o' },
  { id: 'record', title: '学习记录', icon: 'clock-o' },
  { id: 'download', title: '下载管理', icon: 'down' },
  { id: 'help', title: '帮助与反馈', icon: 'question-o' },
]
</script>

<template>
  <div class="profile">
    <PageHeader class="profile__header" title="我的" subtitle="保持练习，遇见更好的自己" />

    <section class="profile__user" @click="onUserClick">
      <img class="profile__avatar" :src="avatarImg" alt="用户头像" @error="onImageError" />
      <div class="profile__user-info">
        <template v-if="isLoggedIn">
          <h2 class="profile__name">{{ user?.nickname }}</h2>
          <p class="profile__desc">已坚持冥想 128 天</p>
        </template>
        <template v-else>
          <h2 class="profile__name">未登录</h2>
          <p class="profile__desc">登录后同步练习数据</p>
        </template>
      </div>
      <van-icon class="profile__arrow" name="arrow" size="16" />
    </section>

    <section class="profile__stats">
      <div v-for="stat in stats" :key="stat.id" class="profile__stat">
        <span class="profile__stat-value">{{ stat.value }}</span>
        <span class="profile__stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <van-cell-group inset class="profile__cells">
      <van-cell
        v-for="menu in menus"
        :key="menu.id"
        :title="menu.title"
        :icon="menu.icon"
        is-link
        center
        @click="router.push(`/profile/${menu.id}`)"
      />
      <van-cell title="消息提醒" icon="bell" center>
        <template #right-icon>
          <van-switch v-model="notifyEnabled" size="20" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-button class="profile__logout" plain @click="onAuthAction">
      {{ isLoggedIn ? '退出登录' : '登录 / 注册' }}
    </van-button>

    <p class="profile__version">版本 1.0.0</p>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.profile {
  width: 100%;

  &__header {
    margin: 0 @page-padding;
  }

  &__user {
    margin: 20px @page-padding 0;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    background-color: @color-panel-bg;
    border-radius: @radius-lg;
  }

  &__avatar {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__user-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__name {
    font-size: @font-size-xl;
    line-height: 25px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__desc {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
  }

  &__arrow {
    color: @color-text-light;
  }

  &__stats {
    margin: 12px @page-padding 0;
    padding: 16px 0;
    display: flex;
    background-color: @color-panel-bg;
    border-radius: @radius-lg;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    & + & {
      border-left: 1px solid @color-white;
    }
  }

  &__stat-value {
    font-size: @font-size-xxl;
    line-height: 28px;
    font-weight: 600;
    color: @color-primary;
  }

  &__stat-label {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
  }

  &__cells {
    margin: 20px @page-padding 0;

    :deep(.van-cell) {
      padding-left: 16px;
      padding-right: 16px;
    }

    :deep(.van-cell__left-icon) {
      margin-right: 10px;
      color: @color-text-gray;
    }
  }

  // 固定宽度水平居中（不用 block，避免 100% 宽叠加 margin 溢出）
  &__logout {
    display: block;
    width: 200px;
    margin: 20px auto 0;
    height: 44px;
    border: 1px solid @color-border-light;
    border-radius: @radius-lg;
    background-color: transparent;
    color: @color-text-gray;
    font-size: @font-size-base;
    letter-spacing: @letter-spacing-body;
  }

  &__version {
    margin: 16px @page-padding @page-bottom-space;
    text-align: center;
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }
}
</style>
