<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { profile } from '../content'

const props = defineProps({
  sections: { type: Array, required: true },
  activeId: { type: String, default: '' },
  /** (id) => boolean，判断板块详细内容是否展开 */
  isExpanded: { type: Function, required: true },
})

const emit = defineEmits(['activate'])

const currentYear = new Date().getFullYear()

const listRef = ref(null)
/** 高亮块的位移与高度（相对 ul） */
const indicator = ref({ y: 0, h: 0, ready: false })
/** 首帧定位完成后再开启过渡，避免高亮块从左上角滑入 */
const animated = ref(false)

let resizeObserver = null
let animateTimer = 0

function updateIndicator() {
  const list = listRef.value
  if (!list) return

  const index = props.sections.findIndex((section) => section.id === props.activeId)
  const target = list.querySelectorAll('[data-nav-item]')[index]
  if (!target) {
    indicator.value = { ...indicator.value, ready: false }
    return
  }

  indicator.value = {
    y: target.offsetTop,
    h: target.offsetHeight,
    ready: true,
  }
}

function scheduleUpdate() {
  nextTick(updateIndicator)
}

watch(() => props.activeId, scheduleUpdate)
watch(() => props.sections.length, scheduleUpdate)

onMounted(() => {
  scheduleUpdate()
  animateTimer = window.setTimeout(() => {
    animated.value = true
  }, 400)

  window.addEventListener('resize', scheduleUpdate)
  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleUpdate)
  window.clearTimeout(animateTimer)
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- 个人照片 + 姓名 -->
    <div class="flex items-center gap-4 px-7 pb-8 pt-8">
      <div class="relative shrink-0">
        <div class="size-20 rounded-full bg-slate-200 p-[2px]">
          <div
            class="grid size-full place-items-center rounded-full bg-white text-xl font-semibold tracking-wide text-slate-500"
          >
            {{ profile.initials }}
          </div>
        </div>
        <span
          class="absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-white bg-slate-500"
          aria-hidden="true"
        />
      </div>
      <div class="min-w-0">
        <p class="truncate text-[1.05rem] font-semibold text-slate-900">{{ profile.name }}</p>
        <p class="mt-1 truncate text-[0.82rem] text-slate-500">{{ profile.role }}</p>
      </div>
    </div>

    <div class="mx-7 h-px bg-gradient-to-r from-line to-transparent" />

    <!-- 垂直导航 -->
    <nav class="mt-6 flex-1 overflow-y-auto px-4" aria-label="板块导航">
      <ul ref="listRef" class="relative">
        <!-- 高亮块：整站只有一个，靠 translateY 在选中项之间滑动 -->
        <li
          class="pointer-events-none absolute inset-x-0 top-0 z-0"
          :class="
            animated && indicator.ready
              ? 'transition-[transform,height,opacity] duration-300 ease-soft'
              : ''
          "
          :style="{
            transform: `translateY(${indicator.y}px)`,
            height: `${indicator.h}px`,
            opacity: indicator.ready ? '1' : '0',
          }"
          aria-hidden="true"
        >
          <div class="h-full w-full bg-[linear-gradient(90deg,rgba(15,23,42,0.08),transparent)]" />
          <span class="absolute inset-y-0 left-0 w-[2px] bg-slate-900/[0.3]" />
        </li>

        <li v-for="section in sections" :key="section.id" class="pb-1.5 last:pb-0">
          <button
            type="button"
            data-nav-item
            class="relative z-10 flex w-full items-center py-3 pl-4 pr-3.5 text-left transition-colors duration-200"
            :class="
              activeId === section.id
                ? 'text-slate-900'
                : 'text-slate-500 hover:bg-slate-900/[0.03] hover:text-slate-800'
            "
            :aria-current="activeId === section.id ? 'true' : undefined"
            :aria-expanded="isExpanded(section.id)"
            :aria-controls="`panel-${section.id}`"
            @click="emit('activate', section.id)"
          >
            <span class="flex-1 truncate text-[0.95rem]">{{ section.title }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- 底部信息 -->
    <div class="px-7 py-7">
      <p class="text-[0.72rem] text-slate-400">© {{ currentYear }} {{ profile.name }}</p>
    </div>
  </div>
</template>
