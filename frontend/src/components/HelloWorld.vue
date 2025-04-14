<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="text-center md:text-left">
    <h1 class="text-4xl font-medium text-green-600 -mt-2.5 mb-4">{{ msg }}</h1>
    <h3 class="text-xl text-gray-700">
      You've successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener" class="text-indigo-600 hover:text-indigo-800">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener" class="text-indigo-600 hover:text-indigo-800">Vue 3</a>. What's next?
    </h3>
  </div>
</template>
