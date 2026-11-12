<script setup>
defineProps({
  content: { type: Object, required: true },
})
</script>

<template>
  <div class="space-y-7">
    <div v-for="group in content.groups" :key="group.name">
      <h3
        class="flex items-center gap-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-500"
      >
        <span class="h-px w-4 bg-line-strong" aria-hidden="true" />
        {{ group.name }}
      </h3>

      <ul class="mt-3.5 space-y-3.5">
        <li v-for="item in group.items" :key="item.name">
          <span class="text-[0.95rem] text-slate-800">{{ item.name }}</span>
          <div class="mt-2 h-[3px] overflow-hidden bg-slate-200">
            <div class="h-full bg-slate-400" :style="{ width: `${item.level}%` }" />
          </div>
          <p class="mt-2 text-[0.86rem] leading-7 text-slate-500">{{ item.note }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
