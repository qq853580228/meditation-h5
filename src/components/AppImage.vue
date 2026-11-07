<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Image as VanImage } from 'vant'
import { FALLBACK_IMAGE } from '@/utils/image'

// van-image 增强封装：加载失败自动替换为默认图
// 其余 props/attrs（fit、round、lazy-load 等）全部透传给 van-image
const props = defineProps<{ src: string }>()

const failed = ref(false)
// src 变化时重置失败态，允许新图重新加载
watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const currentSrc = computed(() => (failed.value ? FALLBACK_IMAGE : props.src))
const onError = () => {
  failed.value = true
}
</script>

<template>
  <van-image v-bind="$attrs" :src="currentSrc" @error="onError" />
</template>
