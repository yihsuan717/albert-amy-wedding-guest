<!-- src/components/GuestList.vue -->
<template>
  <div class="space-y-4 animate-[theme(animate.fade-in)]">
    <!-- 🔍 全域搜尋結果 -->
    <div v-if="searchQuery" class="space-y-3">
      <div v-if="filteredAllPeople.length === 0" class="text-center py-12">
        <div class="text-3xl mb-2">🕊️</div>
        <p class="typo-body-muted text-champagne-800/70">
          找不到符合條件的賓客。
        </p>
      </div>

      <div class="glass-list mx-4">
        <button v-for="(person, idx) in filteredAllPeople" :key="idx" type="button" class="glass-row group"
          @click="$emit('open-detail', person)">
          <div class="glass-refraction" />
          <div class="glass-sheen" />

          <div class="min-w-0 flex-1 relative z-10">
            <div class="typo-guest-name text-ink-900 transition-colors truncate">
              {{ person.name }}
            </div>
            <div class="mt-1 text-[11px] text-champagne-700/90 truncate">
              {{ person.sideName }} · {{ person.category }}
            </div>
          </div>

          <div class="shrink-0 relative z-10 flex items-baseline gap-2">
            <span class="typo-body-muted uppercase text-[10px] tracking-[0.26em]">
              TABLE
            </span>
            <span class="font-serif font-bold text-[22px] leading-none text-champagne-600">
              {{ person.seatGroup }}
            </span>
            <svg class="ml-1 w-4 h-4 text-champagne-400/90 transition-transform duration-300" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- 📂 分類列表 -->
    <div v-else-if="currentStep === 'category-list'" class="space-y-3 py-3">
      <h2 class="typo-section-title text-center mb-6">
        請選擇親友分類
      </h2>

      <div class="glass-list mx-4">
        <button v-for="(cat, idx) in currentCategories" :key="idx" type="button" class="glass-row group"
          @click="$emit('select-category', cat.title)">
          <div class="glass-refraction" />
          <div class="glass-sheen" />

          <!-- ✅ 不要點點，改成左側導引線點綴（由 glass-row::before 負責） -->
          <div class="min-w-0 flex-1 relative z-10 flex items-center gap-3">
            <span class="typo-card-title text-ink-900 truncate">
              {{ cat.title }}
            </span>
          </div>

          <div class="shrink-0 relative z-10 flex items-center gap-3">
            <span class="glass-badge whitespace-nowrap">
              {{ cat.count }} 人
            </span>

            <svg class="w-4 h-4 text-champagne-400/90 transition-transform duration-300" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- 👥 分類內名單 -->
    <div v-else-if="currentStep === 'guest-list' && selectedCategory" class="space-y-3 py-3">
      <h2 class="text-center mb-6">
        <span class="block typo-section-title text-[20px]">
          {{ selectedCategory }}
        </span>
        <span class="block typo-body-muted mt-1">
          點擊查看座位
        </span>
      </h2>

      <div class="glass-list mx-4">
        <button v-for="(person, pIdx) in currentGuests" :key="pIdx" type="button" class="glass-row group"
          @click="$emit('open-detail', person)">
          <div class="glass-refraction" />
          <div class="glass-sheen" />

          <div class="min-w-0 flex-1 relative z-10">
            <div class="typo-guest-name text-ink-900 transition-colors truncate">
              {{ person.name }}
            </div>
          </div>

          <div class="shrink-0 relative z-10 flex items-baseline gap-2">
            <span class="typo-body-muted uppercase text-[10px] tracking-[0.26em]">
              TABLE
            </span>
            <span class="font-serif font-bold text-[22px] leading-none text-champagne-600">
              {{ person.seatGroup }}
            </span>
            <svg class="ml-1 w-4 h-4 text-champagne-400/90 transition-transform duration-300" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <div v-if="currentGuests.length === 0" class="text-center py-12">
          <p class="typo-body-muted text-champagne-800/70">
            該分類目前尚無資料。
          </p>
        </div>
      </div>
    </div>

    <!-- 🧭 fallback -->
    <div v-else class="text-center py-12">
      <p class="typo-body-muted text-champagne-800/70">
        請從首頁開始操作。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ISeatingData, ISearchResult, IPerson, ICategory } from '../types/seating'
import type { Step } from '@/types'

const props = defineProps<{
  rawData: ISeatingData | null
  selectedSide: 'albert' | 'amy' | null
  searchQuery: string
  currentStep: Step
  selectedCategory?: string | null
}>()

defineEmits<{
  (e: 'select-category', categoryTitle: string): void
  (e: 'open-detail', person: IPerson): void
}>()

const currentCategories = computed<ICategory[]>(() => {
  if (!props.rawData || !props.selectedSide) return []
  return props.rawData.seats[props.selectedSide]?.category || []
})

const currentGuests = computed<IPerson[]>(() => {
  if (!props.rawData || !props.selectedSide || !props.selectedCategory) return []
  const category = currentCategories.value.find((cat) => cat.title === props.selectedCategory)
  return category ? category.people : []
})

const filteredAllPeople = computed<ISearchResult[]>(() => {
  if (!props.searchQuery || !props.rawData) return []
  const query = props.searchQuery.toLowerCase().trim()
  const results: ISearchResult[] = []

    ; (['albert', 'amy'] as const).forEach((sideKey) => {
      const sideName = sideKey === 'albert' ? '男方' : '女方'
      const categories = props.rawData!.seats[sideKey]?.category || []
      categories.forEach((cat) => {
        cat.people.forEach((person) => {
          if (person.name.toLowerCase().includes(query) || cat.title.toLowerCase().includes(query)) {
            results.push({ ...person, category: cat.title, sideName })
          }
        })
      })
    })

  return results
})
</script>

<style scoped>
/* ===== Liquid Glass List (iOS26-ish) ===== */

.glass-list {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.30);
  backdrop-filter: blur(22px);

  /* iOS-ish: short + soft shadows (avoid big “background block”) */
  box-shadow:
    0 10px 26px rgba(75, 51, 16, 0.06),
    0 2px 6px rgba(75, 51, 16, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.62),
    inset 0 -1px 0 rgba(255, 255, 255, 0.16);
}

/* film + soft highlights (keep bottom very light) */
.glass-list::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(520px 200px at 20% 6%, rgba(246, 232, 203, 0.42), transparent 62%),
    radial-gradient(520px 200px at 92% 96%, rgba(238, 214, 170, 0.08), transparent 72%),
    repeating-linear-gradient(0deg,
      rgba(255, 255, 255, 0.040),
      rgba(255, 255, 255, 0.040) 1px,
      rgba(255, 255, 255, 0.00) 2px,
      rgba(255, 255, 255, 0.00) 4px);
  opacity: 0.38;
}

.glass-row {
  position: relative;
  width: 100%;
  min-width: 0;
  text-align: left;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  background: transparent;
  transition: transform 180ms ease, background 180ms ease, filter 180ms ease;
}

/* ✅ left accent rail (replaces dot) */
.glass-row::before {
  content: "";
  position: absolute;
  left: 12px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg,
      rgba(214, 182, 120, 0.00),
      rgba(214, 182, 120, 0.28),
      rgba(214, 182, 120, 0.00));
  opacity: 0;
  transform: translateX(-2px);
  transition: opacity 220ms ease, transform 220ms ease;
  pointer-events: none;
}

/* hairline divider */
.glass-row::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  height: 1px;
  background: rgba(214, 182, 120, 0.20);
  transform: scaleY(0.5);
  transform-origin: bottom;
  pointer-events: none;
}

/* last row owns bottom rounding */
.glass-row:last-child {
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.glass-row:last-child::after {
  display: none;
}

/* Desktop hover */
@media (hover: hover) and (pointer: fine) {
  .glass-row:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  .glass-row:hover::before {
    opacity: 1;
    transform: translateX(0);
  }

  .glass-row:hover .glass-refraction {
    opacity: 0.85;
    transform: translateX(0%);
  }

  .glass-row:hover .glass-sheen {
    opacity: 0.28;
    animation: glassSweep 1.15s ease-in-out 1;
  }

  .glass-row:hover svg {
    transform: translateX(2px);
  }
}

/* Mobile: use active instead of hover */
@media (hover: none) and (pointer: coarse) {
  .glass-row:active {
    background: rgba(255, 255, 255, 0.20);
    transform: scale(0.992);
    filter: saturate(1.03);
  }

  .glass-row:active::before {
    opacity: 1;
    transform: translateX(0);
  }

  .glass-row:active .glass-refraction {
    opacity: 0.90;
    transform: translateX(0%);
  }

  .glass-row:active .glass-sheen {
    opacity: 0.28;
    animation: glassSweep 0.95s ease-in-out 1;
  }

  .glass-row:active svg {
    transform: translateX(2px);
  }
}

/* keyboard focus */
.glass-row:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 4px rgba(214, 182, 120, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  border-radius: 18px;
}

/* refraction band */
.glass-refraction {
  pointer-events: none;
  position: absolute;
  inset: -1px;
  border-radius: 16px;
  background: linear-gradient(110deg,
      rgba(255, 255, 255, 0.00) 0%,
      rgba(255, 255, 255, 0.20) 22%,
      rgba(255, 255, 255, 0.00) 48%,
      rgba(255, 255, 255, 0.10) 72%,
      rgba(255, 255, 255, 0.00) 100%);
  opacity: 0.55;
  transform: translateX(-18%);
  transition: opacity 260ms ease, transform 260ms ease;
}

/* sheen sweep */
.glass-sheen {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
  transform: translateX(-140%);
  opacity: 0;
}

@keyframes glassSweep {
  0% {
    transform: translateX(-140%);
  }

  100% {
    transform: translateX(140%);
  }
}

/* glass badge */
.glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid rgba(214, 182, 120, 0.26);
  background: rgba(246, 232, 203, 0.30);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
  color: rgba(120, 90, 40, 0.90);
  font-size: 11px;
}
</style>
