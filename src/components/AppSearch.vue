<script setup lang="ts">
import { Search as VanSearch } from 'vant'

// 搜索关键词，支持 v-model 双向绑定
const keyword = defineModel<string>({ default: '' })

interface Props {
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '想听些什么呢？',
})
</script>

<template>
  <van-search
    v-model="keyword"
    class="app-search"
    :placeholder="placeholder"
    :show-action="false"
  >
    <!-- 蓝湖标注：搜索图标 16x16 @35,153，路径色 #C4C4C4 -->
    <template #left-icon>
      <svg class="app-search__icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" stroke-width="1.2" />
        <path d="M10.9 10.9 14.2 14.2" fill="none" stroke="currentColor" stroke-width="1.2" />
      </svg>
    </template>
  </van-search>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

// 蓝湖标注：搜索框 335x34 @20,144，圆角 5，底色 #F4F4F4
// 图标 @35,153（框内左 15），文本 @63,152（图标 16 + 间距 12）
.app-search {
  padding: 0;
  background-color: transparent;

  &__icon {
    display: block;
    width: 16px;
    height: 16px;
    color: @color-text-light;
  }

  :deep(.van-search__content) {
    height: 34px;
    padding-left: 15px;
    border-radius: @radius-md;
    background-color: @color-bg-search;
  }

  :deep(.van-search__field) {
    padding-right: 0;
  }

  :deep(.van-field__left-icon) {
    display: flex;
    align-items: center;
    margin-right: 12px;
    line-height: 1;
  }

  :deep(.van-field__control) {
    font-size: @font-size-sm;
    line-height: 18px;
    letter-spacing: @letter-spacing-caption;
    color: @color-primary;

    &::placeholder {
      font-size: @font-size-sm;
      color: @color-text-light;
    }
  }
}
</style>
