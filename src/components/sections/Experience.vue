<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  content: { type: Object, required: true },
})

/** work：工作履历时间线；social：社会时间线 */
const view = ref('work')

const socialItems = computed(() => props.content.social ?? [])
const hasSocial = computed(() => socialItems.value.length > 0)

/** 两条时间线字段一致，可直接复用同一套渲染 */
const timeline = computed(() =>
  view.value === 'social' ? socialItems.value : props.content.items,
)

/** 两张牌完全重叠、无法单独点选，因此由外层容器整块承担切换 */
function toggleView() {
  view.value = view.value === 'work' ? 'social' : 'work'
}
</script>

<template>
  <div class="space-y-5">
    <!--
      视图切换：3D 翻转对调（Card Flip / Rotate Swap）。
      两张牌背靠背叠在同一位置，切换时整体绕 Y 轴转 180°：
      原先在后方的「社会实践」转到正面，工作履历退到背面。
    -->
    <div v-if="hasSocial" class="flex justify-end">
      <div
        class="relative mr-2 h-11 w-24 cursor-pointer"
        role="button"
        tabindex="0"
        :aria-label="`当前是${view === 'work' ? '工作履历' : '社会实践'}，点击切换到${view === 'work' ? '社会实践' : '工作履历'}`"
        @click.stop="toggleView"
        @keydown.enter.prevent="toggleView"
        @keydown.space.prevent="toggleView"
      >
        <!-- 工作履历：选中时在左上，未选中时退到右下 -->
        <span
          class="pointer-events-none absolute left-0 top-0 flex h-9 w-14 items-center justify-center text-[0.72rem] font-medium transition-[translate,color,opacity] duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          :class="
            view === 'work'
              ? 'translate-x-0 translate-y-0 text-slate-900 opacity-100'
              : 'translate-x-10 translate-y-1 text-slate-400 opacity-45'
          "
        >
          工作履历
        </span>

        <!-- 社会实践：两者位置交替，切换时位置与明暗同时互换 -->
        <span
          class="pointer-events-none absolute left-0 top-0 flex h-9 w-14 items-center justify-center text-[0.72rem] font-medium transition-[translate,color,opacity] duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          :class="
            view === 'social'
              ? 'translate-x-0 translate-y-0 text-slate-900 opacity-100'
              : 'translate-x-10 translate-y-1 text-slate-400 opacity-45'
          "
        >
          社会实践
        </span>
      </div>
    </div>

    <Transition name="timeline" mode="out-in">
      <ol :key="view" class="space-y-0">
        <li
          v-for="(item, index) in timeline"
          :key="item.company + item.period"
          class="relative pb-8 pl-6 last:pb-0"
        >
          <span
            class="absolute left-1.5 top-1 size-2.5 -translate-x-1/2 rounded-full bg-slate-400 ring-4 ring-slate-400/10"
            aria-hidden="true"
          />
          <span
            v-if="index < timeline.length - 1"
            class="absolute bottom-0 left-1.5 top-5 w-px -translate-x-1/2 bg-line"
            aria-hidden="true"
          />

          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 class="text-[1rem] font-medium text-slate-900">{{ item.company }}</h3>
            <span class="text-[0.84rem] text-slate-500">{{ item.role }}</span>
            <span class="font-mono text-[0.72rem] tabular-nums text-slate-400">{{ item.period }}</span>
          </div>

          <p class="mt-2 text-[0.88rem] leading-[1.75] text-slate-500">{{ item.desc }}</p>

          <ul class="mt-3 space-y-2">
            <li
              v-for="highlight in item.highlights"
              :key="highlight"
              class="flex gap-2.5 text-[0.88rem] leading-[1.75] text-slate-600"
            >
              <span class="mt-2.5 size-1 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </li>
      </ol>
    </Transition>

    <div
      v-if="view === 'work' && content.education?.length"
      class="border-t border-line/70 pt-5"
    >
      <h3 class="text-[0.68rem] tracking-[0.18em] text-slate-400">教育背景</h3>
      <ul class="mt-2.5 space-y-2">
        <li
          v-for="edu in content.education"
          :key="edu.school"
          class="flex flex-wrap items-baseline gap-x-3 gap-y-1"
        >
          <span class="text-[0.84rem] text-slate-800">{{ edu.school }}</span>
          <span class="text-[0.78rem] text-slate-500">{{ edu.major }}</span>
          <span class="font-mono text-[0.7rem] tabular-nums text-slate-400">{{ edu.period }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.timeline-enter-active,
.timeline-leave-active {
  transition: opacity 0.2s ease;
}
.timeline-enter-from,
.timeline-leave-to {
  opacity: 0;
}
</style>
