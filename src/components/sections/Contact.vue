<script setup>
defineProps({
  content: { type: Object, required: true },
})

const isHttp = (href) => typeof href === 'string' && href.startsWith('http')
</script>

<template>
  <div class="space-y-6">
    <ul class="divide-y divide-line/70 border-t border-line/70">
      <li v-for="channel in content.channels" :key="channel.label">
        <component
          :is="channel.href ? 'a' : 'div'"
          :href="channel.href ?? undefined"
          :target="isHttp(channel.href) ? '_blank' : undefined"
          :rel="isHttp(channel.href) ? 'noreferrer' : undefined"
          class="group flex flex-wrap items-baseline gap-x-5 gap-y-1 py-3.5 transition-colors duration-200"
          :class="channel.href ? 'hover:text-slate-900' : ''"
        >
          <span class="w-20 shrink-0 text-[0.68rem] tracking-[0.12em] text-slate-400">
            {{ channel.label }}
          </span>
          <span
            class="text-[0.95rem] font-medium text-slate-800 transition-colors duration-200"
            :class="channel.href ? 'group-hover:text-slate-900' : ''"
          >
            {{ channel.value }}
          </span>
          <span class="text-[0.78rem] text-slate-400">{{ channel.hint }}</span>
        </component>
      </li>
    </ul>

    <p class="border-l-2 border-slate-300 pl-4 text-[0.8rem] leading-7 text-slate-500">
      {{ content.note }}
    </p>
  </div>
</template>
