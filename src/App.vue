<template>
  <div class="min-h-dvh relative overflow-hidden font-sans text-gray-700 flex flex-col
           selection:bg-champagne-400 selection:text-white">
    <!-- 背景光影層 -->
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-[#f8f5f0] via-[#fffbf2] to-[#f0eadd]" />
    <div class="fixed top-[-15%] left-[-15%] w-[70vw] h-[70vw]
             bg-champagne-200/60 rounded-full blur-[120px]
             animate-float opacity-70 pointer-events-none" />
    <div class="fixed bottom-[-10%] right-[-20%] w-[80vw] h-[80vw]
             bg-pink-100/50 rounded-full blur-[140px]
             animate-float-slow opacity-60 pointer-events-none" />
    <div class="fixed top-[30%] left-[20%] w-[40vw] h-[40vw]
             bg-blue-100/40 rounded-full blur-[100px]
             animate-float opacity-50 pointer-events-none" />
    <div class="fixed bottom-[5%] left-[5%] w-[50vw] h-[50vw]
             bg-green-100/30 rounded-full blur-[110px]
             animate-float-slow opacity-40 pointer-events-none" />

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
</script>
