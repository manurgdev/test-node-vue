<script setup lang="ts">
withDefaults(defineProps<{
  msg?: string
}>(), {
  msg: 'Welcome to Tramitech'
})
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-medium text-green-600 -mt-2.5 mb-4">{{ msg }}</h1>
  </div>
</template>

