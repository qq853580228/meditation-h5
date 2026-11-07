<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  NavBar as VanNavBar,
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  showSuccessToast,
  type FormInstance,
} from 'vant'
import AppTabs from '@/components/AppTabs.vue'
import { useUserStore } from '@/stores/user'
import { PASSWORD_MSG, PASSWORD_REG, PHONE_MSG, PHONE_REG } from '@/utils/regex'
import type { TabItem } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const submitting = ref(false)
const formRef = ref<FormInstance>()

// 登录 / 注册模式切换，复用公共 AppTabs
const modeTabs: TabItem[] = [
  { id: 'login', label: '登录' },
  { id: 'register', label: '注册' },
]
const mode = ref<string>('login')

// 切换登录/注册时清空上一个表单的校验提示
watch(mode, () => formRef.value?.resetValidation())

const nickname = ref('')
const phone = ref('')
const password = ref('')

// 调用登录接口（开发环境由 mockjs 拦截返回），登录态由 pinia 持久化
const onSubmit = async () => {
  submitting.value = true
  try {
    await userStore.login({
      phone: phone.value,
      password: password.value,
      nickname: mode.value === 'register' ? nickname.value : undefined,
    })
    showSuccessToast(mode.value === 'register' ? '注册成功' : '登录成功')
    router.replace('/profile')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login">
    <van-nav-bar class="login__nav" left-arrow @click-left="router.back()" />

    <h1 class="login__title">{{ mode === 'login' ? '欢迎回来' : '创建账号' }}</h1>
    <p class="login__subtitle">在安静中，遇见更好的自己</p>

    <AppTabs v-model="mode" :tabs="modeTabs" shrink center class="login__tabs" />

    <van-form ref="formRef" class="login__form" @submit="onSubmit">
      <van-field
        v-if="mode === 'register'"
        v-model="nickname"
        name="nickname"
        label="昵称"
        placeholder="请输入昵称"
        :rules="[{ required: true, message: '请输入昵称' }]"
      />
      <van-field
        v-model="phone"
        name="phone"
        type="tel"
        maxlength="11"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[
          { required: true, message: '请输入手机号' },
          { pattern: PHONE_REG, message: PHONE_MSG },
        ]"
      />
      <van-field
        v-model="password"
        name="password"
        type="password"
        maxlength="20"
        label="密码"
        placeholder="请输入密码"
        :rules="[
          { required: true, message: '请输入密码' },
          { pattern: PASSWORD_REG, message: PASSWORD_MSG },
        ]"
      />

      <div class="submit-wrapper">
        <van-button class="login__submit" round type="primary" native-type="submit" :loading="submitting">
          {{ mode === 'login' ? '登录' : '注册并登录' }}
        </van-button>
      </div>
    </van-form>

    <p class="login__agreement">登录即代表同意《用户协议》与《隐私政策》</p>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.login {
  width: 100%;
  min-height: 100vh;
  background-color: @color-white;

  &__nav {
    :deep(.van-nav-bar__content) {
      background-color: transparent;
    }
  }

  &__title {
    margin: 24px @page-padding 0;
    font-size: 24px;
    line-height: 33px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__subtitle {
    margin: 6px @page-padding 0;
    font-size: @font-size-base;
    line-height: 20px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
  }

  &__tabs {
    margin: 24px @page-padding 0;
  }

  &__form {
    margin-top: 20px;

    :deep(.van-field) {
      padding-left: @page-padding;
      padding-right: @page-padding;
    }
  }

  .submit-wrapper {
    padding: 28px @page-padding;
  }
  // 按钮：display block + width auto，左右边距内自动填充（不用 block，避免 100% 宽叠加 margin 溢出）
  &__submit {
    width: 100%;
    height: 44px;
    font-size: @font-size-lg;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
  }

  &__agreement {
    margin: 16px @page-padding 0;
    text-align: center;
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-light;
  }
}
</style>
