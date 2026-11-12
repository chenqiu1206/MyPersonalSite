import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 窄屏抽屉导航的状态与副作用。
 *
 * 负责：开关状态、背景滚动锁、焦点转移与归还、Esc 关闭。
 * 调用方只需把 `triggerRef` 绑到汉堡按钮、`panelRef` 绑到抽屉面板。
 */
export function useDrawer() {
  const drawerOpen = ref(false)
  /** 触发按钮（组件实例或原生元素，需可 focus） */
  const triggerRef = ref(null)
  /** 抽屉面板，打开时接收焦点 */
  const panelRef = ref(null)

  function open() {
    drawerOpen.value = true
  }

  function close() {
    drawerOpen.value = false
  }

  function toggle() {
    drawerOpen.value = !drawerOpen.value
  }

  watch(drawerOpen, (isOpen) => {
    document.body.classList.toggle('is-scroll-locked', isOpen)
    if (isOpen) {
      nextTick(() => panelRef.value?.focus())
      return
    }
    triggerRef.value?.focus?.()
  })

  function handleKeydown(event) {
    if (event.key === 'Escape' && drawerOpen.value) {
      event.preventDefault()
      close()
    }
  }

  onMounted(() => document.addEventListener('keydown', handleKeydown))

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.classList.remove('is-scroll-locked')
  })

  return { drawerOpen, open, close, toggle, triggerRef, panelRef }
}
