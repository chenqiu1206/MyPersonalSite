<script setup>
defineProps({
  content: { type: Object, required: true },
})
</script>

<template>
  <ul class="border-t border-line/70">
    <li
      v-for="item in content.items"
      :key="item.name"
      class="border-b border-line/70 py-5 last:border-b-0 last:pb-0"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 class="text-[1.1rem] font-medium text-slate-900">{{ item.name }}</h3>
        <span class="font-mono text-[0.7rem] tabular-nums text-slate-400">{{ item.year }}</span>
      </div>

      <p class="mt-1 text-[0.76rem] text-slate-500">{{ item.role }}</p>
      <p class="mt-2.5 text-[0.92rem] leading-[1.8] text-slate-600">{{ item.desc }}</p>

      <dl v-if="item.metrics?.length" class="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5">
        <div v-for="metric in item.metrics" :key="metric.label" class="flex items-baseline gap-1.5">
          <dt class="text-[0.68rem] text-slate-400">{{ metric.label }}</dt>
          <dd class="font-mono text-[0.82rem] text-slate-700">{{ metric.value }}</dd>
        </div>
      </dl>

      <p class="mt-2.5 text-[0.72rem] text-slate-400">{{ item.tags.join(' / ') }}</p>

      <a
        v-if="item.href"
        :href="item.href"
        target="_blank"
        rel="noreferrer"
        class="mt-2 inline-flex w-fit items-center gap-1 text-[0.72rem] text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900 hover:decoration-slate-500"
      >
        查看项目
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </a>
    </li>
  </ul>
</template>
