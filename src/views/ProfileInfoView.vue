<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  NavBar as VanNavBar,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Dialog as VanDialog,
  Field as VanField,
  showSuccessToast,
  showFailToast,
} from 'vant'
import { useUserStore } from '@/stores/user'
import avatarImg from '@/assets/images/avatar.png'
import { onImageError } from '@/utils/image'

const router = useRouter()
const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)

// 未登录访问资料页：直接回登录页
if (!isLoggedIn.value) router.replace('/login')

// 昵称编辑：弹窗内嵌输入框，确认后写回 store（持久化自动生效）
const editing = ref(false)
const nicknameDraft = ref('')

const openEditor = () => {
  nicknameDraft.value = user.value?.nickname ?? ''
  editing.value = true
}

const saveNickname = () => {
  const value = nicknameDraft.value.trim()
  if (!value) {
    showFailToast('昵称不能为空')
    return
  }
  if (user.value) user.value.nickname = value
  showSuccessToast('已保存')
}
</script>

<template>
  <div class="profile-info">
    <van-nav-bar class="profile-info__nav" title="个人资料" left-arrow @click-left="router.back()" />

    <van-cell-group inset class="profile-info__cells">
      <van-cell title="头像" center>
        <template #right-icon>
          <img class="profile-info__avatar" :src="avatarImg" alt="用户头像" @error="onImageError" />
        </template>
      </van-cell>
      <van-cell title="昵称" :value="user?.nickname" is-link center @click="openEditor" />
      <van-cell title="手机号" :value="user?.phone" center />
    </van-cell-group>

    <van-dialog
      v-model:show="editing"
      title="修改昵称"
      show-cancel-button
      @confirm="saveNickname"
    >
      <van-field
        v-model="nicknameDraft"
        class="profile-info__field"
        placeholder="请输入昵称"
        maxlength="12"
      />
    </van-dialog>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.profile-info {
  width: 100%;
  min-height: 100vh;
  background-color: @color-bg-section;

  &__cells {
    margin: 20px @page-padding 0;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__field {
    margin: 8px 0 16px;
    border: 1px solid @color-border-light;
    border-radius: @radius-md;
  }
}
</style>
