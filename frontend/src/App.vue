<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="max-h-screen p-6">
      <img alt="Vue logo" class="w-32 h-32 mx-auto mb-8" src="@/assets/logo.svg" />

      <div class="max-w-4xl mx-auto">
        <HelloWorld msg="You did it!" />

        <nav class="mt-8 text-center">
          <RouterLink to="/" class="inline-block px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors border-l border-gray-300 first:border-0">Home</RouterLink>
          <RouterLink to="/about" class="inline-block px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors border-l border-gray-300">About</RouterLink>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>