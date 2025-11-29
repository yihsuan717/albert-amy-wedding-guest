<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
    <div class="relative p-8 rounded-3xl bg-white/30 backdrop-blur-xl shadow-2xl
             shadow-champagne-800/10 border border-white/60 w-full max-w-sm">
      <!-- 香檳 + 光暈 -->
      <div class="relative mb-8 flex items-center justify-center">
        <!-- 柔光暈 -->
        <div class="absolute w-24 h-24 rounded-full
           bg-gradient-to-b from-champagne-200/55 to-transparent
           blur-2xl opacity-85" />

        <!-- 星光群：5 顆集中在杯上方，跟碰撞同一個節奏 -->
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center
           animate-star-cluster">
          <!-- 中央最大 -->
          <span class="absolute -top-1 text-[12px] text-champagne-400">
            ✦
          </span>

          <!-- 左上 -->
          <span class="absolute -top-3 -left-1 text-[9px] text-champagne-400
             [transform:translateX(-2px)]">
            ✧
          </span>

          <!-- 右上 -->
          <span class="absolute -top-4 right-0 text-[9px] text-champagne-400
             [transform:translateX(2px)]">
            ✧
          </span>

          <!-- 左下微光 -->
          <span class="absolute -top-0.5 -left-3 text-[8px] text-champagne-300">
            ✦
          </span>

          <!-- 右下微光 -->
          <span class="absolute -top-0.5 left-4 text-[8px] text-champagne-300">
            ✦
          </span>
        </div>

        <!-- 香檳 icon：偶爾碰撞 + 微漂浮 -->
        <div class="text-6xl animate-glass-cluster select-none">
          🥂
        </div>
      </div>

      <p class="text-xs tracking-[0.35em] text-champagne-500 mb-2">
        WEDDING&nbsp;SEATING
      </p>

      <h1 class="text-4xl font-serif text-champagne-800 font-bold tracking-wide mb-2">
        Albert &amp; Amy
      </h1>

      <p class="text-sm text-gray-600 mb-8">
        光影交織，緣分相會。<br />
        歡迎您蒞臨，讓我們先為您找到專屬座位。
      </p>

      <!-- CTA 按鈕 -->
      <button type="button" class="group relative w-full py-3.5 px-4 rounded-2xl
               bg-gradient-to-r from-[#f7efe4] via-[#e8ddb8] to-[#d5bf8a]
               text-[#5c4826] text-[15px] font-semibold tracking-wide
               border border-white/70 overflow-hidden
               transition-transform duration-150 ease-out
               active:scale-[0.97]
               shadow-[0_10px_26px_rgba(197,169,104,0.22)]
               animate-cta-pulse" @click="goSideSelect">
        <span class="relative z-20">開始查詢座位</span>

        <!-- 固定玻璃高光 -->
        <span class="pointer-events-none absolute inset-0
                 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.9),transparent_55%)]
                 opacity-70 mix-blend-screen z-10" />

        <!-- hover / tap 刷光 -->
        <span class="pointer-events-none absolute inset-0
                 bg-gradient-to-r from-white/0 via-white/80 to-white/0
                 translate-x-[-130%]
                 group-hover:translate-x-[130%]
                 transition-transform duration-900 ease-out
                 mix-blend-screen z-10" />
      </button>

      <p class="text-xs text-gray-500 mt-4 tracking-wider">
        點擊開始，尋找您的專屬席次。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goSideSelect = () => {
  router.push({ name: 'side-select' })
}
</script>
