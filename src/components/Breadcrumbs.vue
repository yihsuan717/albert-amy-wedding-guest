<!-- src/components/Breadcrumbs.vue -->
<template>
  <nav v-if="path.length" class="px-4 pt-2">
    <div class="relative flex items-center gap-1 pb-2 text-[13px] font-medium
             text-champagne-600">
      <!-- 底部香檳金光影線 -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[1px]
               bg-gradient-to-r from-transparent via-champagne-200 to-transparent
               shadow-[0_0_12px_rgba(197,169,104,0.45)]" />

      <!-- 麵包屑項目 -->
      <button v-for="(item, index) in path" :key="item.name + index" type="button"
        class="inline-flex items-center transition-colors duration-200" :class="[
          index === path.length - 1
            ? 'text-champagne-800 cursor-default'
            : 'text-champagne-500 hover:text-champagne-800 cursor-pointer'
        ]" @click="handleClick(item, index)">
        <span class="truncate max-w-[96px]">{{ item.name }}</span>
        <span v-if="index < path.length - 1" class="mx-1 text-champagne-300 select-none">
          /
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { PathItem } from '@/types'

const props = defineProps<{
  path: PathItem[]
}>()

const emit = defineEmits<{
  (e: 'navigate', target: PathItem): void
}>()

const handleClick = (item: PathItem, index: number) => {
  // 最後一個是當前頁，不要可點
  if (index === props.path.length - 1) return
  emit('navigate', item)
}
</script>
