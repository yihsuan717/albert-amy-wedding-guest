<template>
  <div class="min-h-dvh relative overflow-hidden font-sans text-gray-700 flex flex-col
           selection:bg-champagne-400 selection:text-white">
    <BackgroundGlow />
    <main class="flex-1 min-h-0 overflow-y-auto pb-4 pr-1 -mr-1 custom-scroll relative">
      <div class="w-full max-w-xl mx-auto px-4 md:px-6">
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import BackgroundGlow from './components/BackgroundGlow.vue'
</script>
