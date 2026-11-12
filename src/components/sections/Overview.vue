<script setup>
defineProps({
  content: { type: Object, required: true },
})

const isHttp = (href) => typeof href === 'string' && href.startsWith('http')
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4 text-[1rem] leading-[1.85] text-slate-600">
      <p v-for="(paragraph, index) in content.lead" :key="index">{{ paragraph }}</p>
    </div>

    <dl class="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-line/70 pt-5 sm:grid-cols-4">
      <div v-for="fact in content.facts" :key="fact.label">
        <dt class="text-[0.66rem] tracking-[0.14em] text-slate-400">{{ fact.label }}</dt>
        <dd class="mt-1 text-[0.9rem] text-slate-800">{{ fact.value }}</dd>
      </div>
    </dl>

    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
      <a
        v-for="link in content.links"
        :key="link.label"
        :href="link.href"
        :target="isHttp(link.href) ? '_blank' : undefined"
        :rel="isHttp(link.href) ? 'noreferrer' : undefined"
        class="group inline-flex items-center gap-1 text-[0.78rem] text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors duration-200 hover:text-slate-900 hover:decoration-slate-500"
      >
        {{ link.label }}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </a>
    </div>
  </div>
</template>
