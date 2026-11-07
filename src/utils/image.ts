// 图片加载失败时的默认图（内联 SVG，保证永远可用、无额外请求）
export const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#F2F2F2"/><g fill="#C4C4C4"><circle cx="84" cy="76" r="12"/><path d="M48 146l40-42 26 27 18-16 28 31z"/></g></svg>',
  )

/** 原生 <img> 的加载失败兜底：替换为默认图（dataset 标记防止重复触发死循环） */
export const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = FALLBACK_IMAGE
}
