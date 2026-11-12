<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, default: '' },
  expanded: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  /** 窄屏时顶部有悬浮菜单按钮，锚点需要额外留出空间 */
  compact: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

const panelId = computed(() => `panel-${props.id}`)
const scrollOffset = computed(() => (props.compact ? '5rem' : '2rem'))

/**
 * 整个板块区域都可点击切换展开状态。
 * - 交互元素（链接、按钮、表单控件）保留自己的行为，不触发折叠
 * - 详细内容区不响应，避免选字或操作内容时被误收起
 */
function handleSectionClick(event) {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.closest('a, button, input, textarea, select, label')) return
  if (target.closest(`#${panelId.value}`)) return
  // 正在选字时不触发折叠，避免复制文本时整块收起
  if (window.getSelection()?.toString()) return
  emit('toggle')
}
</script>

<template>
  <section
    :id="id"
    :style="{ scrollMarginTop: scrollOffset }"
    class="cursor-pointer border-t py-12 first:border-t-0 first:pt-0 sm:py-16"
    :class="active ? 'border-line-strong' : 'border-line'"
    @click="handleSectionClick"
  >
    <header class="flex items-start justify-between gap-6">
      <!-- 编辑式大标题：负字距 + 紧行高 -->
      <h2
        class="min-w-0 flex-1 text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] transition-colors duration-300 sm:text-[2rem]"
        :class="active ? 'text-slate-900' : 'text-slate-800'"
      >
        {{ title }}
      </h2>

      <!-- 展开图标：无边框，仅图标本身 -->
      <button
        type="button"
        class="mt-0 -mr-1 grid size-8 shrink-0 place-items-center rounded-md text-slate-400 transition duration-200 ease-soft hover:bg-slate-900/[0.04] hover:text-slate-900 active:scale-95"
        :aria-expanded="expanded"
        :aria-controls="panelId"
        :aria-label="`${expanded ? '收起' : '展开'}「${title}」的详细内容`"
        @click.stop="emit('toggle')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          class="size-4 transition-transform duration-300 ease-soft"
          :class="expanded ? 'rotate-45' : ''"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </header>

    <p v-if="summary" class="mt-7 text-[1.0625rem] leading-[1.9] text-slate-600">{{ summary }}</p>

    <!-- 0fr → 1fr 折叠：高度由内容决定，不依赖测量，布局不会跳变 -->
    <div
      class="grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
      :style="{ gridTemplateRows: expanded ? '1fr' : '0fr' }"
    >
      <div class="overflow-hidden">
        <div
          :id="panelId"
          class="cursor-auto pt-8 transition-opacity duration-[340ms] ease-soft"
          :class="expanded ? 'opacity-100' : 'opacity-0'"
          :inert="expanded ? undefined : true"
        >
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
