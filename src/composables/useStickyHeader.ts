import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 吸顶元素滚动显隐：
 * 向下滚动隐藏、向上滚动显示。
 * 关键约束：未吸顶（scrollY 未超过元素文档流位置）时永远不隐藏，
 * 否则 translateY(-100%) 会在页面中间留下空白带（快速滚动时的"错位"）。
 *
 * 注意1：Chrome 中 sticky 元素吸附后 offsetTop 会变为当前吸附位置而非文档流位置，
 * 因此文档流位置只能在未吸附时测量——挂载时缓存一次，回到顶部时重新校准。
 *
 * 注意2：Chrome scroll anchoring 会在列表内容增删（如切换 tab 过滤）时静默调整
 * scrollY 且不触发 scroll 事件，导致 lastY 脱节、下一次滚动事件算出假的方向差值。
 * 因此"向下隐藏"需连续两次同向事件才生效（单次污染事件不触达），"向上显示"保持即时。
 */
export function useStickyHeader(threshold = 8) {
  const hidden = ref(false)
  const instance = getCurrentInstance()
  let lastY = 0
  let flowTop = 0
  let downStreak = 0 // 连续向下滚动事件计数

  const measure = () => {
    const el = instance?.proxy?.$el as HTMLElement | undefined
    if (el) flowTop = el.offsetTop
  }

  const onScroll = () => {
    const y = Math.max(window.scrollY, 0)

    if (y === 0) {
      // 回到顶部时元素必然未吸附，此时校准文档流位置（兼容 resize 后 vw 变化）
      measure()
      hidden.value = false
      downStreak = 0
    } else if (y <= flowTop) {
      // 元素还在文档流位置可见，强制显示，避免留空
      hidden.value = false
      downStreak = 0
    } else if (y - lastY > threshold) {
      downStreak += 1
      if (downStreak >= 2) hidden.value = true
    } else if (lastY - y > threshold) {
      downStreak = 0
      hidden.value = false
    }
    // 微小抖动（差值未达阈值）：保持现状，不清空 downStreak

    lastY = y
  }

  onMounted(() => {
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  return { hidden }
}
