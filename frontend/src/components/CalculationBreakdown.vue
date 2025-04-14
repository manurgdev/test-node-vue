<template>
  <div class="mb-5 p-4 bg-gray-100 rounded-md">
    <div class="font-bold text-gray-800 mb-1">{{ title }}:</div>
    <div class="font-mono mb-1 text-gray-600">{{ formula }}</div>
    <div class="font-bold text-green-600 mb-1">= {{ result }}</div>
    <div class="text-sm text-gray-500">
      {{ explanation }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  title: string
  formula: string
  result: string
  explanation: string
}>()
</script>
