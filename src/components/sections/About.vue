<script setup>
defineProps({
  content: { type: Object, required: true },
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4 text-[1rem] leading-[1.85] text-slate-600">
      <p v-for="(paragraph, index) in content.paragraphs" :key="index">{{ paragraph }}</p>
    </div>

    <ul class="grid gap-x-8 gap-y-5 border-t border-line/70 pt-5 sm:grid-cols-2">
      <li v-for="trait in content.traits" :key="trait.title">
        <h3 class="text-[0.95rem] font-medium text-slate-800">
          <span class="mr-1.5 text-slate-300" aria-hidden="true">—</span>{{ trait.title }}
        </h3>
        <p class="mt-1.5 text-[0.86rem] leading-7 text-slate-500">{{ trait.desc }}</p>
      </li>
    </ul>
  </div>
</template>
