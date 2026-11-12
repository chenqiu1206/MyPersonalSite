import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 订阅一条媒体查询，返回响应式布尔值。
 * 初始值同步读取，避免首帧使用错误布局造成闪烁。
 */
export function useMediaQuery(query) {
  const matches = ref(
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  let mql = null
  const handleChange = (event) => {
    matches.value = event.matches
  }

  onMounted(() => {
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', handleChange)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', handleChange)
    mql = null
  })

  return matches
}
