<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <header class="page-header">
    <div class="page-header__text">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <slot name="right" />
  </header>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 28px;

  &__text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__title {
    font-size: @font-size-xxl;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: @letter-spacing-body;
    color: @color-primary;
  }

  &__subtitle {
    font-size: @font-size-xs;
    line-height: 17px;
    letter-spacing: @letter-spacing-caption;
    color: @color-text-gray;
  }
}
</style>
