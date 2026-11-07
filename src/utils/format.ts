// 通用格式化工具函数

/** 访问量格式化：过万显示 x.x万 */
export const formatViews = (count: number): string => {
  if (count >= 10000) {
    const wan = count / 10000
    return `${Number.isInteger(wan) ? wan : wan.toFixed(1)}万`
  }
  return String(count)
}
