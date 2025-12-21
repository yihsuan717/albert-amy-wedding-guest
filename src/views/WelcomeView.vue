<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in px-4">
    <div class="relative w-full max-w-sm rounded-[28px]
             bg-white/28 backdrop-blur-2xl
             border border-white/60
             shadow-[0_18px_50px_rgba(75,51,16,0.10)]
             overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-champagne-200/35 blur-3xl" />
        <div class="absolute -bottom-28 -right-24 w-80 h-80 rounded-full bg-champagne-300/25 blur-3xl" />
        <div
          class="absolute inset-0 [background:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.12))]" />
      </div>

      <div class="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/50" />
      <div
        class="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(255,255,255,0.18)]" />

      <div class="relative z-10 p-4">
        <!-- 香檳 + 光暈 -->
        <div class="relative mb-8 flex items-center justify-center">
          <!-- 柔光暈 -->
          <div class="absolute w-24 h-24 rounded-full
                   bg-gradient-to-b from-champagne-200/55 to-transparent
                   blur-2xl opacity-85" />

          <!-- 星光群：更克制、更「細」 -->
          <div class="pointer-events-none absolute inset-0 flex items-center justify-center animate-star-cluster">
            <span class="absolute -top-1 text-[12px] text-champagne-400 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
              ✦
            </span>
            <span class="absolute -top-3 -left-1 text-[9px] text-champagne-400 [transform:translateX(-2px)] opacity-90">
              ✧
            </span>
            <span class="absolute -top-4 right-0 text-[9px] text-champagne-400 [transform:translateX(2px)] opacity-90">
              ✧
            </span>
            <span class="absolute -top-0.5 -left-3 text-[8px] text-champagne-300 opacity-80">
              ✦
            </span>
            <span class="absolute -top-0.5 left-4 text-[8px] text-champagne-300 opacity-80">
              ✦
            </span>
          </div>

          <!-- 香檳 icon：微漂浮（更像原生） -->
          <div class="text-6xl animate-glass-cluster select-none drop-shadow-[0_8px_18px_rgba(120,90,40,0.18)]">
            🥂
          </div>
        </div>

        <!-- 英文小標 -->
        <p class="typo-brand-tag mb-3 whitespace-nowrap">
          WEDDING&nbsp;SEATING
        </p>

        <!-- 新人姓名主標 -->
        <h1 class="typo-hero-names mb-3">
          Albert &amp; Amy
        </h1>

        <!-- 主文案 -->
        <p class="typo-body mb-6 text-pretty">
          <span class="block">光影交織，緣分相會。</span>
          <span class="block mt-1">歡迎您蒞臨，讓我們先為您找到專屬座位。</span>
          <!-- 光影交織，緣分相會。<br />
          歡迎您蒞臨，讓我們先為您找到專屬座位。 -->
        </p>

        <!-- CTA 按鈕 -->
        <button type="button" class="cta-btn" @click="goSideSelect">
          <span class="cta-label typo-cta whitespace-nowrap">開始查詢座位</span>
        </button>

        <!-- 底部小提示 -->
        <p class="typo-body-muted mt-4 tracking-[0.16em] text-pretty">
          點擊開始，尋找您的專屬席次。
        </p>
      </div>
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
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  overflow: hidden;

  /* 霧面淡香檳金漸層 */
  background: linear-gradient(180deg,
      #f9f4ea 0%,
      #f3e4c6 45%,
      #e6cfaa 100%);

  border: 1px solid rgba(255, 252, 245, 0.85);

  /* 外陰影 + 內高光（更像玻璃按鈕） */
  box-shadow:
    0 10px 26px rgba(187, 152, 92, 0.20),
    0 0 0 1px rgba(255, 255, 255, 0.70),
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    inset 0 -1px 0 rgba(255, 255, 255, 0.18);

  transition:
    transform 0.16s ease-out,
    box-shadow 0.16s ease-out,
    filter 0.16s ease-out;
}

/* 鍵盤可見焦點：不破壞你整體風格 */
.cta-btn:focus-visible {
  outline: none;
  box-shadow:
    0 10px 26px rgba(187, 152, 92, 0.20),
    0 0 0 1px rgba(255, 255, 255, 0.75),
    0 0 0 4px rgba(214, 182, 120, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    inset 0 -1px 0 rgba(255, 255, 255, 0.18);
}

/* 按下去的手感 */
.cta-btn:active {
  transform: scale(0.975) translateY(1px);
  filter: saturate(1.03);
  box-shadow:
    0 6px 16px rgba(160, 130, 76, 0.30),
    0 0 0 1px rgba(255, 255, 255, 0.70),
    inset 0 1px 0 rgba(255, 255, 255, 0.62),
    inset 0 -1px 0 rgba(255, 255, 255, 0.16);
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
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 0 0 0 rgba(214, 182, 120, 0);
  z-index: 1;
  pointer-events: none;
  animation: ctaBorderGlow 3.1s ease-in-out infinite;
}

/* 偶爾刷光：窄光條從左到右掃過一次 */
.cta-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.86),
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
    box-shadow: 0 0 0 0 rgba(214, 182, 120, 0);
  }

  40% {
    box-shadow: 0 0 0 5px rgba(214, 182, 120, 0.22);
  }
}

/* 刷光 keyframes */
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
