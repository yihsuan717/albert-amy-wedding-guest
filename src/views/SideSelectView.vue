// src/views/SideSelectView.vue
<template>
  <div class="h-full flex flex-col">
    <!-- 麵包屑：固定兩層 -->
    <Breadcrumbs class="mb-4" :path="[
      { name: '首頁', step: 'welcome' },
      { name: '選擇親友方', step: 'side-select' },
    ]" @navigate="handleBreadcrumb" />

    <!-- STEP 標題區（避免硬斷行，句子完整性） -->
    <div class="text-center mt-4 mb-8 px-2">
      <p class="typo-brand-tag mb-3 whitespace-nowrap">
        STEP&nbsp;01
      </p>

      <h1 class="typo-step-title text-balance">
        請選擇您所屬的親友方
      </h1>

      <p class="mt-4 typo-body text-pretty">
        稍後仍可切換查看另一方名單。
      </p>
    </div>

    <!-- iOS-ish 清單卡：用 button + focus + active 手感 -->
    <div class="mx-4 space-y-4">
      <!-- 男方 -->
      <button type="button" class="side-card group" @click="goSide('albert')">
        <div class="side-card-bg" />

        <div class="relative z-10 w-full">
          <p class="typo-brand-tag mb-1 whitespace-nowrap">
            GROOM&nbsp;SIDE
          </p>

          <div class="flex items-center justify-between gap-4">
            <h2 class="typo-card-title">
              男方親友
            </h2>

            <svg class="w-5 h-5 text-champagne-400 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <p class="typo-body mt-2 text-pretty">
            與 Albert 較為親近的親友
          </p>
        </div>
      </button>

      <!-- 女方 -->
      <button type="button" class="side-card group" @click="goSide('amy')">
        <div class="side-card-bg" />

        <div class="relative z-10 w-full">
          <p class="typo-brand-tag mb-1 whitespace-nowrap">
            BRIDE&nbsp;SIDE
          </p>

          <div class="flex items-center justify-between gap-4">
            <h2 class="typo-card-title">
              女方親友
            </h2>

            <svg class="w-5 h-5 text-champagne-400 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <p class="typo-body mt-2 text-pretty">
            與 Amy 較為親近的親友
          </p>
        </div>
      </button>
    </div>

    <p class="text-center typo-body-muted mt-6 px-6 text-pretty">
      可隨時切換查看另一方。
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
/* 卡片：維持你原本色系 + 更像 iOS 的層次與互動 */
.side-card {
  position: relative;
  width: 100%;
  text-align: left;
  padding: 1.25rem;
  border-radius: 1.5rem;

  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.70);
  box-shadow: var(--shadow-glass);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.side-card:hover {
  background: rgba(255, 255, 255, 0.68);
  box-shadow: var(--shadow-glass-hover);
  transform: translateY(-2px);
}

.side-card:active {
  transform: scale(0.985) translateY(0px);
}

/* 鍵盤可見焦點 */
.side-card:focus-visible {
  outline: none;
  box-shadow:
    var(--shadow-glass-hover),
    0 0 0 4px rgba(214, 182, 120, 0.22);
}

/* 內層柔光：非常淡，不破壞香檳感 */
.side-card-bg {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(120px 80px at 18% 22%, rgba(246, 232, 203, 0.55), transparent 60%),
    radial-gradient(140px 90px at 88% 78%, rgba(238, 214, 170, 0.38), transparent 62%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.12));
  opacity: 0.9;
}
</style>
