import { ref } from 'vue'

/**
 * 导航状态机：负责「选中 / 展开 / 抽屉」三类交互。
 *
 * 侧栏标题点击规则：
 * - 目标不是当前板块 → 滚动定位并选中（不展开）
 * - 目标已是当前板块 → 切换该板块详细内容的展开状态
 */
export function useNavigation({ activeId, lockTo }) {
  const expandedMap = ref({})
  const drawerOpen = ref(false)

  function isExpanded(id) {
    return expandedMap.value[id] === true
  }

  function setExpanded(id, value) {
    expandedMap.value[id] = value
  }

  function toggleExpanded(id) {
    setExpanded(id, !isExpanded(id))
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function scrollToSection(id) {
    const element = document.getElementById(id)
    if (!element) return
    lockTo(id)
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  function activateSection(id) {
    if (activeId.value !== id) {
      scrollToSection(id)
      return
    }
    toggleExpanded(id)
  }

  function openDrawer() {
    drawerOpen.value = true
  }

  function closeDrawer() {
    drawerOpen.value = false
  }

  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  /** 抽屉中点选板块：先定位/展开，再收起抽屉 */
  function activateFromDrawer(id) {
    activateSection(id)
    closeDrawer()
  }

  return {
    expandedMap,
    isExpanded,
    setExpanded,
    toggleExpanded,
    activateSection,
    activateFromDrawer,
    drawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
}
