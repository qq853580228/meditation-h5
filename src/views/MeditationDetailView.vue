<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NavBar as VanNavBar,
  Icon as VanIcon,
  Empty as VanEmpty,
  Field as VanField,
  Button as VanButton,
  showToast,
} from 'vant'
import AppImage from '@/components/AppImage.vue'
import { getMeditationDetail, postMeditationComment, toggleMeditationFav, toggleMeditationLike } from '@/api/modules/meditation'
import { useUserStore } from '@/stores/user'
import { formatViews } from '@/utils/format'
import type { MeditationDetail } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const detail = ref<MeditationDetail>()
const loaded = ref(false)
const commentText = ref('')
const sending = ref(false)

const id = String(route.params.id)

onMounted(async () => {
  try {
    detail.value = await getMeditationDetail(id)
  } catch {
    detail.value = undefined
  } finally {
    loaded.value = true
  }
})

// 点赞/收藏/评论需要先登录
const requireLogin = () => {
  if (userStore.isLoggedIn) return true
  showToast('请先登录')
  router.push('/login')
  return false
}

const onLike = async () => {
  if (!requireLogin() || !detail.value) return
  const res = await toggleMeditationLike(id)
  detail.value.liked = res.liked
  detail.value.likeCount = res.likeCount
}

const onFav = async () => {
  if (!requireLogin() || !detail.value) return
  const res = await toggleMeditationFav(id)
  detail.value.faved = res.faved
  detail.value.favCount = res.favCount
  showToast(res.faved ? '已收藏' : '已取消收藏')
}

const onSend = async () => {
  if (!requireLogin() || !detail.value) return
  const content = commentText.value.trim()
  if (!content) {
    showToast('请输入评论内容')
    return
  }
  sending.value = true
  try {
    const comment = await postMeditationComment(id, {
      user: userStore.user?.nickname ?? '我',
      content,
    })
    detail.value.comments.unshift(comment)
    commentText.value = ''
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="meditation-detail">
    <van-nav-bar class="meditation-detail__nav" title="冥想详情" left-arrow @click-left="router.back()" />

    <template v-if="detail">
      <app-image class="meditation-detail__cover" :src="detail.image" fit="cover" />

      <section class="meditation-detail__info">
        <h1 class="meditation-detail__title">{{ detail.title }}</h1>
        <div class="meditation-detail__meta">
          <span class="meditation-detail__meta-item">
            <van-icon name="eye-o" size="13" />
            {{ formatViews(detail.views) }} 人练习过
          </span>
          <span class="meditation-detail__meta-item">
            <van-icon name="clock-o" size="13" />
            {{ detail.duration }}
          </span>
        </div>
        <p class="meditation-detail__desc">{{ detail.desc }}</p>
      </section>

      <!-- 互动区：点赞 / 收藏（需登录） -->
      <section class="meditation-detail__actions">
        <button
          type="button"
          class="meditation-detail__action"
          :class="{ 'meditation-detail__action--active': detail.liked }"
          @click="onLike"
        >
          <van-icon :name="detail.liked ? 'good-job' : 'good-job-o'" size="20" />
          <span>{{ formatViews(detail.likeCount) }}</span>
        </button>
        <button
          type="button"
          class="meditation-detail__action"
          :class="{ 'meditation-detail__action--active': detail.faved }"
          @click="onFav"
        >
          <van-icon :name="detail.faved ? 'star' : 'star-o'" size="20" />
          <span>{{ formatViews(detail.favCount) }}</span>
        </button>
      </section>

      <!-- 评论区（需登录） -->
      <section class="meditation-detail__comments">
        <h2 class="meditation-detail__section-title">评论 {{ detail.comments.length }}</h2>

        <ul v-if="detail.comments.length" class="meditation-detail__comment-list">
          <li v-for="comment in detail.comments" :key="comment.id" class="meditation-detail__comment">
            <span class="meditation-detail__comment-avatar">{{ comment.user.slice(0, 1) }}</span>
            <div class="meditation-detail__comment-body">
              <div class="meditation-detail__comment-head">
                <span class="meditation-detail__comment-user">{{ comment.user }}</span>
                <span class="meditation-detail__comment-time">{{ comment.time }}</span>
              </div>
              <p class="meditation-detail__comment-text">{{ comment.content }}</p>
            </div>
          </li>
        </ul>
        <p v-else class="meditation-detail__comment-empty">还没有评论，来抢沙发</p>
      </section>

      <!-- 底部评论输入栏 -->
      <footer class="meditation-detail__footer">
        <van-field
          v-model="commentText"
          class="meditation-detail__input"
          placeholder="说点什么..."
          maxlength="100"
          @keyup.enter="onSend"
        />
        <van-button class="meditation-detail__send" round type="primary" size="small" :loading="sending" @click="onSend">
          发送
        </van-button>
      </footer>
    </template>

    <van-empty v-else-if="loaded" description="内容不存在或已下架" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.meditation-detail {
  width: 100%;
  min-height: 100vh;
  padding-bottom: calc(56px + @safe-area-bottom);
  background-color: @color-white;

  &__nav {
    position: sticky;
    top: @safe-area-top;
    z-index: 20;
  }

  &__cover {
    display: block;
    width: 100%;
    height: 200px;

    :deep(img) {
      object-fit: cover;
    }
  }

  &__info {
    margin: 16px @page-padding 0;
  }

  &__title {
    font-size: @font-size-xxl;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__meta {
    margin-top: 8px;
    display: flex;
    gap: 16px;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }

  &__desc {
    margin-top: 12px;
    font-size: @font-size-base;
    line-height: 24px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
  }

  &__actions {
    margin: 20px @page-padding 0;
    padding: 12px 0;
    display: flex;
    gap: 24px;
    border-top: 1px solid @color-divider;
    border-bottom: 1px solid @color-divider;
  }

  &__action {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: none;
    background: transparent;
    font-size: @font-size-xs;
    color: @color-text-gray;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.18s ease;

    &:active {
      transform: scale(0.92);
    }

    &--active {
      color: @color-accent-orange;
    }
  }

  &__comments {
    margin: 20px @page-padding 0;
  }

  &__section-title {
    font-size: @font-size-lg;
    line-height: 22px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__comment-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__comment {
    display: flex;
    gap: 10px;
  }

  &__comment-avatar {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, @color-avatar-gradient-start, @color-avatar-gradient-end);
    color: @color-white;
    font-size: @font-size-base;
    line-height: 32px;
    text-align: center;
  }

  &__comment-body {
    flex: 1;
    min-width: 0;
  }

  &__comment-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__comment-user {
    font-size: @font-size-base;
    line-height: 20px;
    color: @color-primary;
  }

  &__comment-time {
    font-size: @font-size-xs;
    line-height: 17px;
    color: @color-text-light;
  }

  &__comment-text {
    margin-top: 4px;
    font-size: @font-size-base;
    line-height: 22px;
    color: @color-text-gray;
  }

  &__comment-empty {
    margin-top: 16px;
    font-size: @font-size-xs;
    color: @color-text-light;
    text-align: center;
  }

  &__footer {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 100%;
    max-width: 750px;
    padding: 8px @page-padding calc(@safe-area-bottom + 8px);
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: @color-white;
    border-top: 1px solid @color-divider;
  }

  &__input {
    flex: 1;
    padding: 6px 14px;
    background-color: @color-bg-search;
    border-radius: 17px;
  }

  &__send {
    flex-shrink: 0;
    width: 64px;
  }
}
</style>
