<template>
  <div class="h-full flex flex-col">
    <!-- 麵包屑：固定兩層 -->
    <Breadcrumbs class="mb-4" :path="[
      { name: '首頁', step: 'welcome' },
      { name: '選擇親友方', step: 'side-select' },
    ]" @navigate="handleBreadcrumb" />

    <!-- STEP 標題區 -->
    <div class="text-center mt-4 mb-8">
      <p class="tracking-[0.4em] text-[13px] text-champagne-600 mb-3">STEP 01</p>
      <h1 class="text-[30px] leading-snug font-serif font-bold text-gray-900">
        您是哪一方的<br />尊貴親友呢？
      </h1>
      <p class="mt-4 text-gray-600 leading-relaxed text-[14px]">
        請先選擇與新人較親近的一方，<br>
        之後仍可切換查看另一方名單。
      </p>
    </div>

    <!-- 男方 -->
    <div class="mx-4 mb-6 p-5 rounded-3xl bg-white/90 backdrop-blur-xl shadow-soft border border-white/70"
      @click="goSide('albert')">
      <p class="text-champagne-600 uppercase text-[12px] tracking-[0.3em] mb-1">GROOM SIDE</p>
      <h2 class="text-[22px] font-bold text-gray-900 mb-2">男方親友</h2>
      <p class="text-gray-600 text-[14px]">和 Albert 關係較親近的親友，請選這一方。</p>
    </div>

    <!-- 女方 -->
    <div class="mx-4 mb-6 p-5 rounded-3xl bg-white/90 backdrop-blur-xl shadow-soft border border-white/70"
      @click="goSide('amy')">
      <p class="text-champagne-600 uppercase text-[12px] tracking-[0.3em] mb-1">BRIDE SIDE</p>
      <h2 class="text-[22px] font-bold text-gray-900 mb-2">女方親友</h2>
      <p class="text-gray-600 text-[14px]">和 Amy 關係較親近的親友，請選這一方。</p>
    </div>

    <p class="text-center text-gray-600/80 text-[13px] mt-4">
      之後在名單頁面也可以隨時返回首頁，重新選擇親友方。
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const router = useRouter()

const goSide = (side: 'albert' | 'amy') => {
  router.push({
    name: 'category-list',
    params: { side },
  })
}

const handleBreadcrumb = (target: { step: string }) => {
  if (target.step === 'welcome') {
    router.push({ name: 'welcome' })
  }
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
</style>
