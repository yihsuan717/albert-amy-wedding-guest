<!-- src/components/GuestDetailModal.vue -->
<template>
  <Transition name="guest-modal-fade">
    <div v-if="person" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- 背景 -->
      <div class="absolute inset-0 bg-champagne-900/30 backdrop-blur-sm" @click="handleClose" />

      <!-- 主卡片 -->
      <div class="relative w-full h-full max-w-md bg-white/80 backdrop-blur-xl
               rounded-[20px] border border-white/80
               shadow-[0_20px_40px_rgba(0,0,0,0.18)]
               overflow-hidden flex flex-col justify-between">
        <!-- 右上角：Share + 關閉，一組操作區 -->
        <div class="absolute top-4 right-4 flex items-center gap-2 z-50">
          <!-- Share 按鈕：樣式跟 X 一樣 -->
          <button type="button" class="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md shadow
                   flex items-center justify-center
                   hover:bg-white active:scale-95 transition" @click.stop="sharePerson">
            <!-- iOS 風格 share icon（箭頭往上） -->
            <svg class="w-5 h-5 text-ink-700" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M8 8l4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M6 12v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" />
            </svg>
          </button>

          <!-- 關閉按鈕 -->
          <button type="button" class="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md shadow
                   flex items-center justify-center
                   hover:bg-white active:scale-95 transition" @click="handleClose">
            <svg class="w-5 h-5 text-ink-500" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- Header：名字 ＋ TableNo -->
        <header class="relative px-6 pt-9 pb-4 text-center shrink-0 border-b border-champagne-100/70">
          <!-- 淡淡光暈 -->
          <div class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
                   w-52 h-52 bg-champagne-100/70 blur-3xl rounded-full opacity-70" />

          <h3 class="relative z-10 typo-step-title font-bold">
            {{ person.name }}
          </h3>
          <p class="relative z-10 mt-1 typo-body-muted">
            歡迎您的蒞臨
          </p>

          <!-- Table No 卡片 -->
          <div class="relative z-10 mt-4 flex justify-center">
            <div class="inline-block rounded-2xl border-2 border-champagne-200/80 p-[4px]
                     shadow-inner-glow bg-white/80">
              <div class="rounded-xl border border-champagne-100/90
                       bg-champagne-50/85 px-7 py-2.5">
                <span class="block typo-brand-tag mb-1 text-center tracking-[0.26em]">
                  TABLE&nbsp;NO.
                </span>
                <span class="block font-serif font-bold text-[36px] leading-none text-champagne-600">
                  {{ person.seatGroup }}
                </span>
              </div>
            </div>
          </div>
        </header>

        <!-- 內容區：座位圖可滾動 -->
        <section class="px-4 pt-3 pb-2 overflow-y-auto custom-scroll scroll-fade">
          <p class="mb-2 ml-1 typo-body-muted text-champagne-600 text-[11px]">
            ● 會場位置示意圖
          </p>

          <SeatMap :highlightGroup="person.seatGroup" />
          <!-- <SeatMapCanvas :highlightGroup="person.seatGroup" /> -->
        </section>

        <!-- Footer -->
        <footer class="shrink-0 bg-champagne-50/80 border-t border-champagne-100/90
                 py-3 text-center">
          <p class="typo-body-muted text-champagne-600 text-[11px]">
            請洽現場接待人員引導為準
          </p>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import SeatMap from '@/components/SeatMap.vue'
import SeatMapCanvas from './SeatMapCanvas.vue'
import type { IPerson } from '@/types/seating'

const props = defineProps<{
  person: IPerson | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

const sharePerson = async () => {
  if (!props.person) return

  const url = window.location.href
  const title = `座位查詢 - ${props.person.name}`
  const text = `${props.person.name} 的座位資訊（桌次：${props.person.seatGroup}）`

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return
    } catch (err) {
      // 使用者取消不用特別處理
      console.log('share cancelled', err)
    }
  }

  // fallback：複製連結
  try {
    await navigator.clipboard.writeText(url)
    alert('已複製分享連結')
  } catch (e) {
    alert('暫時無法自動複製，請手動複製網址分享。')
  }
}
</script>

<style scoped>
/* 進出場動畫：輕微縮放＋淡入，維持絲滑感 */
.guest-modal-fade-enter-from,
.guest-modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.guest-modal-fade-enter-active,
.guest-modal-fade-leave-active {
  transition: all 0.22s ease-out;
}

/* 滾動區上下邊界做淡淡漸隱，提醒可以滑 */
.scroll-fade {
  --fade-edge: 12px;
  -webkit-mask-image: linear-gradient(to bottom,
      transparent 0,
      black var(--fade-edge),
      black calc(100% - var(--fade-edge)),
      transparent 100%);
  mask-image: linear-gradient(to bottom,
      transparent 0,
      black var(--fade-edge),
      black calc(100% - var(--fade-edge)),
      transparent 100%);
}
</style>
