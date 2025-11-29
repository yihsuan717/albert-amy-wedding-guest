<template>
  <div class="space-y-4 animate-[theme(animate.fade-in)]">

    <div v-if="searchQuery" class="space-y-3">
      <div v-if="filteredAllPeople.length === 0" class="text-center py-12">
        <div class="text-4xl mb-2">🕊️</div>
        <p class="text-champagne-800/60">找不到這位賓客，試試其他關鍵字？</p>
      </div>

      <div v-for="(person, idx) in filteredAllPeople" :key="idx" @click="$emit('open-detail', person)"
        class="relative overflow-hidden group bg-white/50 backdrop-blur-md border border-white/70 p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[theme(shadow.glass-hover)] hover:bg-white/70
               after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent after:opacity-0 after:animate-shimmer group-hover:after:opacity-100">
        <div>
          <div class="font-bold text-gray-800 text-lg group-hover:text-champagne-800 transition-colors relative z-10">{{
            person.name }}</div>
          <div class="text-xs text-gray-500 mt-0.5 flex items-center gap-1 relative z-10">
            <span class="px-1.5 py-0.5 bg-champagne-100/90 rounded text-champagne-800 border border-champagne-200/50">{{
              person.sideName }}</span>
            <span>{{ person.category }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end relative z-10">
          <span class="text-[10px] text-gray-400 uppercase tracking-wide">Table</span>
          <span class="text-2xl font-serif font-bold text-champagne-600">{{ person.seatGroup }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="currentStep === 'category-list'" class="space-y-3 py-3">
      <h2 class="text-3xl font-serif text-champagne-800 text-center mb-6 font-medium">請選擇親友關係類別</h2>
      <div v-for="(cat, idx) in currentCategories" :key="idx" class="overflow-hidden">
        <button @click="$emit('select-category', cat.title)" class="w-full bg-white/40 backdrop-blur-sm hover:bg-white/60 border border-white/70 p-4 rounded-2xl flex justify-between items-center transition-all duration-300 shadow-sm group
                 hover:shadow-[theme(shadow.glass-hover)] hover:scale-[1.02] hover:-translate-y-0.5">
          <div class="flex items-center gap-3 relative z-10">
            <div class="h-2 w-2 rounded-full bg-champagne-400 group-hover:scale-150 transition-transform"></div>
            <span class="font-medium text-lg text-gray-700">{{ cat.title }}</span>
            <span
              class="bg-champagne-100/80 text-champagne-800 text-[10px] px-2 py-0.5 rounded-full border border-champagne-200">{{
                cat.count }}人</span>
          </div>
          <svg class="w-5 h-5 text-champagne-400 transform transition-transform duration-300 group-hover:rotate-90"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div v-else-if="currentStep === 'guest-list' && selectedCategory" class="space-y-3 py-3">
      <h2 class="text-2xl font-serif text-champagne-800 text-center mb-6">
        <span class="block text-xl">{{ selectedCategory }} 名單</span>
        <span class="block text-sm text-gray-500 mt-1">點擊查看座位</span>
      </h2>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="(person, pIdx) in currentGuests" :key="pIdx"
          class="relative overflow-hidden bg-white/70 p-3 rounded-xl border border-white/70 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-[theme(shadow.glass)] hover:-translate-y-1 transition-all duration-300
                 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent after:opacity-0 after:animate-shimmer group-hover:after:opacity-100"
          @click="$emit('open-detail', person)">
          <div class="absolute -right-4 -top-4 w-12 h-12 bg-champagne-100 rounded-full blur-md opacity-50"></div>
          <span class="font-medium text-gray-800 relative z-10">{{ person.name }}</span>
          <div class="mt-1 w-full border-t border-champagne-200/50 pt-1 relative z-10">
            <span class="font-serif font-bold text-xl text-champagne-600">{{ person.seatGroup }}</span>
          </div>
        </div>
      </div>
      <div v-if="currentGuests.length === 0" class="text-center py-12">
        <p class="text-champagne-800/60">該類別暫無賓客資料。</p>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-4xl mb-2">🤔</div>
      <p class="text-champagne-800/60">似乎迷路了，請從歡迎頁面重新開始。</p>
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

const emit = defineEmits<{
  (e: 'select-category', categoryTitle: string): void;
  (e: 'open-detail', person: IPerson): void
}>()

const currentCategories = computed<ICategory[]>(() => {
  if (!props.rawData || !props.selectedSide) return []
  return props.rawData.seats[props.selectedSide]?.category || []
})

const currentGuests = computed<IPerson[]>(() => {
  if (!props.rawData || !props.selectedSide || !props.selectedCategory) return []
  const category = currentCategories.value.find(cat => cat.title === props.selectedCategory)
  return category ? category.people : []
})

const filteredAllPeople = computed<ISearchResult[]>(() => {
  if (!props.searchQuery || !props.rawData) return []

  const query = props.searchQuery.toLowerCase().trim()
  const allResults: ISearchResult[] = [];

  (['albert', 'amy'] as Array<'albert' | 'amy'>).forEach(sideKey => {
    const sideName = sideKey === 'albert' ? '男方' : '女方'
    const categories = props.rawData!.seats[sideKey]?.category || []

    categories.forEach(cat => {
      cat.people.forEach(person => {
        if (
          person.name.toLowerCase().includes(query) ||
          cat.title.toLowerCase().includes(query)
        ) {
          allResults.push({
            ...person,
            category: cat.title,
            sideName: sideName
          })
        }
      })
    })
  })

  return allResults
})
</script>
