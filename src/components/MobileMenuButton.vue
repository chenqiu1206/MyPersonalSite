<script setup>
import { ref } from 'vue'

defineProps({
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])
const buttonRef = ref(null)

defineExpose({
  focus: () => buttonRef.value?.focus(),
})
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    class="fixed left-4 top-4 z-[60] grid size-11 place-items-center rounded-xl border border-line bg-ink-950/90 text-slate-600 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.32)] backdrop-blur-md transition duration-200 ease-soft hover:border-line-strong hover:text-slate-900 active:scale-95"
    :aria-expanded="expanded"
    aria-controls="site-drawer"
    :aria-label="expanded ? '关闭导航菜单' : '打开导航菜单'"
    @click="emit('toggle')"
  >
    <span class="sr-only">导航菜单</span>
    <span class="relative block h-4 w-5" aria-hidden="true">
      <span
        class="absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-soft"
        :class="expanded ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'"
      />
      <span
        class="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-200"
        :class="expanded ? 'scale-x-0 opacity-0' : 'opacity-100'"
      />
      <span
        class="absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-soft"
        :class="expanded ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'"
      />
    </span>
  </button>
</template>
