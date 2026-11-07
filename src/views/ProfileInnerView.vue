<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NavBar as VanNavBar, CellGroup as VanCellGroup, Cell as VanCell, Empty as VanEmpty, Loading as VanLoading } from 'vant'
import { getProfileInner } from '@/api/modules/meditation'
import type { ProfileInner } from '@/types'

// 个人页通用内页：按路由参数 type 拉取对应数据（收藏/记录/下载/帮助）
const route = useRoute()
const router = useRouter()

const inner = ref<ProfileInner>()
const loading = ref(false)

const fetchInner = async (type: string) => {
  loading.value = true
  inner.value = undefined
  try {
    inner.value = await getProfileInner(type)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchInner(String(route.params.type)))
// 同一组件在不同内页间跳转时复用，需监听参数变化
watch(() => route.params.type, (type) => type && fetchInner(String(type)))
</script>

<template>
  <div class="profile-inner">
    <van-nav-bar
      class="profile-inner__nav"
      :title="inner?.title ?? ''"
      left-arrow
      @click-left="router.back()"
    />

    <div v-if="loading" class="profile-inner__loading">
      <van-loading size="24px">加载中...</van-loading>
    </div>

    <template v-else-if="inner">
      <van-cell-group v-if="inner.items.length" inset class="profile-inner__cells">
        <van-cell
          v-for="item in inner.items"
          :key="item.id"
          :title="item.title"
          :label="item.desc"
          is-link
          center
        />
      </van-cell-group>
      <van-empty v-else description="暂无数据" />
    </template>

    <van-empty v-else description="页面不存在" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.profile-inner {
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

  &__cells {
    margin: 16px @page-padding 0;
  }
}
</style>
