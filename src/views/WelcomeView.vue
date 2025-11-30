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
      <button type="button" class="cta-btn" @click="goSideSelect">
        <span class="cta-label">開始查詢座位</span>
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
<style scoped>
.cta-btn {
  position: relative;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  overflow: hidden;

  /* 霧面淡香檳金漸層 */
  background: linear-gradient(180deg,
      #f9f4ea 0%,
      #f3e4c6 45%,
      #e6cfaa 100%);

  color: #5b4524;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.06em;

  border: 1px solid rgba(255, 252, 245, 0.8);
  box-shadow:
    0 8px 20px rgba(187, 152, 92, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.7);

  /* 按下去的手感 */
  transition:
    transform 0.16s ease-out,
    box-shadow 0.16s ease-out;
}

.cta-btn:active {
  transform: scale(0.97) translateY(1px);
  box-shadow:
    0 4px 12px rgba(160, 130, 76, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.7);
}

/* 文字浮在所有特效上方 */
.cta-label {
  position: relative;
  z-index: 2;
}

/* 邊線呼吸光暈（淡淡一圈） */
.cta-btn::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 0 rgba(214, 182, 120, 0.0);
  z-index: 1;
  pointer-events: none;
  animation: ctaBorderGlow 3.1s ease-in-out infinite;
}

/* 偶爾刷光：窄光條從左到右掃過一次，剩下時間在畫面外休息 */
.cta-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.88),
      transparent);
  transform: translateX(-130%);
  z-index: 1;
  pointer-events: none;
  animation: ctaSweep 4.6s ease-in-out infinite;
}

/* 邊線呼吸 keyframes */
@keyframes ctaBorderGlow {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(214, 182, 120, 0.0);
  }

  40% {
    box-shadow: 0 0 0 5px rgba(214, 182, 120, 0.26);
  }
}

/* 刷光 keyframes：只有 0%~40% 在動，其餘時間停在外面等下一輪 */
@keyframes ctaSweep {
  0% {
    transform: translateX(-130%);
    opacity: 0;
  }

  8% {
    opacity: 1;
  }

  32% {
    transform: translateX(130%);
    opacity: 1;
  }

  40% {
    transform: translateX(130%);
    opacity: 0;
  }

  100% {
    transform: translateX(130%);
    opacity: 0;
  }
}
</style>
