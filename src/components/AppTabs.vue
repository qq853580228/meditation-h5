<script setup lang="ts">
import { computed } from 'vue'
import { Tabs as VanTabs, Tab as VanTab } from 'vant'
import type { TabItem } from '@/types'

interface Props {
  tabs: TabItem[]
  modelValue: string
  /** lg：首页 20px 大号 Tab；md：通用 14px Tab */
  size?: 'lg' | 'md'
  /** 是否让 Tab 按内容宽度排列（默认均分） */
  shrink?: boolean
  /** Tab 整体居中（如登录/注册切换） */
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shrink: false,
  center: false,
})

const emit = defineEmits<{
  'update:modelValue': [id: string]
}>()

// Vant Tabs 以索引作为 active，这里统一转换为项目内的 id
const active = computed({
  get: () => Math.max(0, props.tabs.findIndex((tab) => tab.id === props.modelValue)),
  set: (index: number) => emit('update:modelValue', props.tabs[index]?.id ?? ''),
})
</script>

<template>
  <van-tabs
    v-model:active="active"
    class="app-tabs"
    :class="[`app-tabs--${size}`, { 'app-tabs--center': center }]"
    :shrink="shrink"
  >
    <van-tab v-for="tab in tabs" :key="tab.id" :title="tab.label" />
  </van-tabs>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.app-tabs {
  // 居中变体（登录/注册）
  &--center {
    :deep(.van-tabs__nav--line) {
      justify-content: center;
    }
  }

  // 点击反馈：按下时文字轻微缩放并变淡，松开回弹
  :deep(.van-tab__text) {
    transition: color 0.2s ease, transform 0.18s ease, opacity 0.18s ease;
  }

  :deep(.van-tab:active .van-tab__text) {
    transform: scale(0.94);
    opacity: 0.6;
  }

  // 大号 Tab（首页）：35px 高、44px 宽、间距 20px
  &--lg {
    :deep(.van-tabs__wrap) {
      height: 35px;
    }

    :deep(.van-tabs__nav--line) {
      padding: 0;
      gap: 20px;
    }

    :deep(.van-tab) {
      flex: none;
      width: 44px;
      padding: 0;
      align-items: flex-start;
      font-size: @font-size-xxl;
      line-height: 28px;
      letter-spacing: @letter-spacing-tab;
      color: @color-tab-inactive;
    }

    :deep(.van-tab--active) {
      color: @color-primary;
    }

    // 蓝湖标注：指示条 15x4 @35,122，圆角 2
    :deep(.van-tabs__line) {
      bottom: 0;
      width: 15px;
      height: 4px;
      border-radius: 2px;
    }
  }

  // 中号 Tab（课程等）
  &--md {
    :deep(.van-tabs__wrap) {
      height: 30px;
    }

    // 与首页保持同一节奏：首项贴左、项间距 20px
    :deep(.van-tabs__nav--line) {
      padding: 0;
      gap: 20px;
    }

    :deep(.van-tab) {
      padding: 0;
      font-size: @font-size-base;
      line-height: 30px;
      letter-spacing: @letter-spacing-body;
    }

    :deep(.van-tabs__line) {
      bottom: 0;
      width: 20px;
      height: 3px;
      border-radius: 2px;
    }
  }
}
</style>
