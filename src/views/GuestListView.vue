<template>
  <!-- 整頁容器，加 relative 讓 fixed breadcrumb 好控制 -->
  <div class="h-full relative">
    <!-- 🧭 固定在最上方的麵包屑列 -->
    <div class="fixed inset-x-0 top-0 z-40 bg-gradient-to-b
             from-[#f7f1e6]/98 to-transparent backdrop-blur-sm">
      <Breadcrumbs :path="breadcrumbPath" @navigate="handleBreadcrumb" />
    </div>

    <!-- 下面整塊才是可滾動內容，往下推一點讓出麵包屑高度 -->
    <div class="h-full flex flex-col pt-[40px]">
      <!-- 🔎 搜尋列 -->
      <header class="mb-4 mt-1 animate-fade-in">
        <div class="relative mt-1">
          <!-- 左邊放大鏡 -->
          <div class="absolute inset-y-0 left-0 pl-4 z-10 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-champagne-500/85" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- 右邊清除鍵（有字才出現） -->
          <button v-if="searchQuery" type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center
                   text-ink-300 hover:text-ink-700 transition z-10" @mousedown.prevent.stop="onClearSearch">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <input v-model="searchQuery" type="text" placeholder="輸入姓名快速搜尋..." class="w-full pl-11 pr-10 py-3
                   bg-white/80 backdrop-blur-xl
                   border border-white/90
                   rounded-2xl shadow-glass
                   text-ink-700
                   placeholder-champagne-300/90
                   focus:outline-none focus:ring-2 focus:ring-champagne-400/60
                   transition-all duration-300" />
        </div>
      </header>

      <!-- 📋 主內容（分類 / 名單列表） -->
      <main class="flex-1 min-h-0 overflow-y-auto pb-4 pr-1 -mr-1 custom-scroll space-y-6">
        <!-- loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-3">
          <div class="animate-spin rounded-full h-8 w-8
                   border-2 border-champagne-200 border-t-champagne-600" />
          <span class="typo-body-muted tracking-[0.24em] text-champagne-500">
            資料解密中...
          </span>
        </div>

        <!-- error -->
        <div v-else-if="!rawData">
          <p class="text-center typo-body-muted text-red-500">
            資料載入失敗，請稍後再試。
          </p>
        </div>

        <!-- 正常列表 -->
        <GuestList v-else :rawData="rawData" :selectedSide="side!" :searchQuery="searchQuery"
          :currentStep="currentStepForGuestList" :selectedCategory="selectedCategory" @select-category="selectCategory"
          @open-detail="openModalAndSyncRoute" />
      </main>

      <!-- 詳情 Sheet -->
      <!-- <GuestDetailSheet :person="selectedPerson" @close="closeModalAndSyncRoute" /> -->
      <GuestDetailModal :person="selectedPerson" @close="closeModalAndSyncRoute" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import GuestList from '@/components/GuestList.vue'
// import GuestDetailSheet from '@/components/GuestDetailSheet.vue'
import GuestDetailModal from '@/components/GuestDetailModal.vue'
import { useSeatingData } from '@/composables/useSeatingData'
import type { IPerson, ISeatingData } from '@/types/seating'
import type { PathItem, Step } from '@/types'

const route = useRoute()
const router = useRouter()
const { rawData, loading } = useSeatingData()

const searchQuery = ref('')
const selectedPerson = ref<IPerson | null>(null)

const side = computed(() => route.params.side as 'albert' | 'amy' | undefined)
const selectedCategory = computed(
  () => (route.params.category as string) || null,
)

const currentStepForGuestList = computed<Step>(() =>
  route.params.category ? 'guest-list' : 'category-list',
)

// ===== 麵包屑 =====
const sideNameMap: Record<'albert' | 'amy', string> = {
  albert: '男方親友',
  amy: '女方親友',
}

const breadcrumbPath = computed<PathItem[]>(() => {
  const path: PathItem[] = [
    { name: '首頁', step: 'welcome' },
    { name: '選擇親友方', step: 'side-select' },
  ]

  if (side.value) {
    path.push({
      name: sideNameMap[side.value],
      step: 'category-list',
      side: side.value,
    })
  }

  if (selectedCategory.value) {
    path.push({
      name: selectedCategory.value,
      step: 'guest-list',
      side: side.value,
      category: selectedCategory.value,
    })
  }

  return path
})

const handleBreadcrumb = (target: PathItem) => {
  if (target.step === 'welcome') {
    router.push({ name: 'welcome' })
    return
  }

  if (target.step === 'side-select') {
    router.push({ name: 'side-select' })
    searchQuery.value = ''
    selectedPerson.value = null
    return
  }

  if (target.step === 'category-list' && target.side) {
    router.push({
      name: 'category-list',
      params: { side: target.side },
    })
    searchQuery.value = ''
    selectedPerson.value = null
    return
  }

  if (target.step === 'guest-list' && target.side && target.category) {
    router.push({
      name: 'guest-list',
      params: { side: target.side, category: target.category },
    })
    selectedPerson.value = null
  }
}

const onClearSearch = () => {
  searchQuery.value = ''
}

// ===== 行為：選分類 / 打開詳情 =====
const selectCategory = (category: string) => {
  if (!side.value) return
  router.push({
    name: 'guest-list',
    params: { side: side.value, category },
  })
}

const openModalAndSyncRoute = (person: IPerson) => {
  selectedPerson.value = person
  if (!side.value || !selectedCategory.value) return

  const encodedName = encodeURIComponent(person.name)
  router.replace({
    name: 'guest-detail',
    params: {
      side: side.value,
      category: selectedCategory.value,
      person: encodedName,
    },
  })
}

const closeModalAndSyncRoute = () => {
  selectedPerson.value = null
  if (!side.value || !selectedCategory.value) return

  router.replace({
    name: 'guest-list',
    params: { side: side.value, category: selectedCategory.value },
  })
}

// ===== Deep-link：網址直接帶 person，自動開 modal =====
watch(
  () => ({
    data: rawData.value as ISeatingData | null,
    side: side.value as 'albert' | 'amy' | null,
    category: selectedCategory.value,
    person: route.params.person as string | undefined,
  }),
  ({ data, side, category, person }) => {
    if (!data || !side || !category || !person) {
      selectedPerson.value = null
      return
    }

    const decodedName = decodeURIComponent(person)
    const sideData = data.seats[side]
    const categoryData = sideData.category.find(
      (c) => c.title === category,
    )

    const found = categoryData?.people.find(
      (p: IPerson) => p.name === decodedName,
    )

    selectedPerson.value = found ?? null
  },
  { immediate: true },
)
</script>
