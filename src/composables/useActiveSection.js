import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 滚动联动：根据视口判定线计算当前阅读板块。
 *
 * 判定线贴近视口顶部（视口高度的 `offsetRatio`，并有 `maxOffset` 上限），
 * 命中「顶部已越过判定线」的最后一个板块 —— 也就是用户视觉上正在看的那一块。
 * 大屏上按比例算出的判定线会过于靠下（导致顶部显示第一块却高亮第二块），
 * 因此加了绝对像素上限。
 *
 * @param {string[]} ids 板块 id 列表（顺序等于页面顺序）
 */
export function useActiveSection(ids, { offsetRatio = 0.16, maxOffset = 160 } = {}) {
  const activeId = ref(ids[0] ?? '')

  let lockId = null
  let quietTimer = 0
  let frame = 0

  function measure() {
    frame = 0
    if (lockId !== null) return

    // 页面贴顶时视觉焦点必然是第一板块，直接短路，避免任何边界误差
    if (window.scrollY <= 4) {
      activeId.value = ids[0] ?? ''
      return
    }

    const line = Math.min(window.innerHeight * offsetRatio, maxOffset)
    let current = ids[0] ?? ''

    for (const id of ids) {
      const element = document.getElementById(id)
      if (!element) continue
      if (element.getBoundingClientRect().top <= line) current = id
    }

    // 触底时强制高亮最后一个板块，避免最后一屏因高度不足永远无法选中
    const doc = document.documentElement
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
      current = ids[ids.length - 1] ?? current
    }

    activeId.value = current
  }

  function schedule() {
    if (frame) return
    frame = requestAnimationFrame(measure)
  }

  function handleScroll() {
    if (lockId !== null) {
      // 程序化滚动进行中：持续保持目标高亮，滚动停止 120ms 后解锁并重算
      window.clearTimeout(quietTimer)
      quietTimer = window.setTimeout(() => {
        lockId = null
        schedule()
      }, 120)
      return
    }
    schedule()
  }

  /**
   * 程序化跳转前锁定高亮目标，避免平滑滚动途中高亮逐个掠过其他板块。
   * 900ms 兜底用于「点击后未产生滚动」的情况，防止锁定状态残留。
   */
  function lockTo(id) {
    lockId = id
    activeId.value = id
    window.clearTimeout(quietTimer)
    quietTimer = window.setTimeout(() => {
      lockId = null
    }, 900)
  }

  function refresh() {
    schedule()
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    measure()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    window.clearTimeout(quietTimer)
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  })

  return { activeId, lockTo, refresh }
}
