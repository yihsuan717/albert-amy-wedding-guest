<!-- src/components/GuestDetailSheet.vue -->
<template>
  <DrawerRoot :open="open" @update:open="onUpdateOpen" :should-scale-background="shouldScaleBackground">
    <DrawerPortal>
      <DrawerOverlay class="vd-overlay" />

      <DrawerContent ref="contentEl" class="vd-sheet" role="dialog" aria-modal="true" tabindex="-1">
        <div class="vd-shell">
          <!-- Handle -->
          <div class="vd-handle-wrap" aria-hidden="true">
            <DrawerHandle class="vd-handle" />
          </div>

          <!-- Topbar -->
          <div class="vd-topbar">
            <div class="vd-topbar-title typo-brand-tag">SEATING DETAIL</div>

            <div class="vd-topbar-actions">
              <button type="button" class="vd-action" @click.stop="sharePerson" aria-label="分享">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <path d="M8 8l4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M6 12v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-5" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" />
                </svg>
              </button>

              <button ref="closeBtnEl" type="button" class="vd-action" @click.stop="requestClose" aria-label="關閉">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Header -->
          <header class="vd-header">
            <div class="vd-glow" aria-hidden="true" />

            <DrawerTitle class="typo-step-title font-semibold text-ink-900">
              {{ person?.name }}
            </DrawerTitle>

            <DrawerDescription class="mt-1 typo-body-muted text-champagne-800/70">
              歡迎您的蒞臨
            </DrawerDescription>

            <div class="mt-5 flex justify-center">
              <div class="table-card">
                <div class="table-card-inner">
                  <span class="block typo-brand-tag mb-1 text-center tracking-[0.26em] text-champagne-700/80">
                    TABLE&nbsp;NO.
                  </span>
                  <span class="block font-serif font-bold text-[36px] leading-none text-champagne-600">
                    {{ person?.seatGroup }}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <!-- Body（唯一可捲） -->
          <section class="vd-body custom-scroll scroll-fade">
            <div class="px-4 pt-4 pb-3">
              <p class="mb-2 ml-1 typo-body-muted text-champagne-700/70 text-[11px] tracking-[0.08em]">
                會場位置示意圖
              </p>

              <div class="seatmap-frame">
                <SeatMap v-if="person" :highlightGroup="person.seatGroup" />
              </div>

              <div class="h-8" />
            </div>
          </section>

          <!-- Footer -->
          <footer class="vd-footer">
            <p class="typo-body-muted text-champagne-700/70 text-[11px] tracking-[0.08em]">
              請洽現場接待人員引導為準
            </p>
          </footer>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
  DrawerDescription,
} from 'vaul-vue'
import SeatMap from '@/components/SeatMap.vue'
import type { IPerson } from '@/types/seating'

const props = defineProps<{ person: IPerson | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const open = computed(() => !!props.person)

/**
 * 只在「觸控裝置」開啟 shouldScaleBackground，桌面/DevTools 先關掉，避免「整個糊到看不到」。
 */
const shouldScaleBackground = ref(false)

onMounted(() => {
  const mq = window.matchMedia?.('(pointer: coarse)')
  const update = () => (shouldScaleBackground.value = !!mq?.matches)
  update()
  mq?.addEventListener?.('change', update)
  onBeforeUnmount(() => mq?.removeEventListener?.('change', update))
})

const closeBtnEl = ref<HTMLButtonElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)

/**
 * Drawer 打開後把 focus 移進 Drawer，避免 focus 還留在背景按鈕。
 */
watch(
  () => open.value,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    closeBtnEl.value?.focus?.()
    if (!document.activeElement || document.activeElement === document.body) {
      contentEl.value?.focus?.()
    }
  },
  { immediate: true },
)

function onUpdateOpen(next: boolean) {
  if (!next) emit('close')
}

function requestClose() {
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
    } catch { }
  }

  try {
    await navigator.clipboard.writeText(url)
    alert('已複製分享連結')
  } catch {
    alert('暫時無法自動複製，請手動複製網址分享。')
  }
}
</script>

<style scoped>
/* Overlay：固定 + 層級 */
.vd-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background:
    radial-gradient(920px 520px at 50% 10%, rgba(255, 255, 255, 0.18), transparent 60%),
    radial-gradient(820px 560px at 12% 92%, rgba(214, 182, 120, 0.16), transparent 62%),
    rgba(16, 12, 8, 0.42);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.vd-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  width: min(520px, 100%);
  margin: 0 auto;

  height: min(calc(100dvh - 14px - env(safe-area-inset-top)), 860px);

  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);

  border-top: 1px solid rgba(255, 255, 255, 0.72);

  box-shadow:
    0 -26px 70px rgba(0, 0, 0, 0.26),
    0 -12px 30px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.66);

  display: block;
  outline: none;
}

.vd-sheet::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(760px 260px at 50% -10%, rgba(255, 255, 255, 0.28), transparent 62%),
    radial-gradient(620px 360px at 92% 92%, rgba(214, 182, 120, 0.10), transparent 66%);
  opacity: 0.18;
}

.vd-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

/* Handle */
.vd-handle-wrap {
  padding-top: 10px;
  padding-bottom: 8px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.vd-handle {
  width: 120px;
  height: 4px;
  border-radius: 999px;
  background: rgba(120, 90, 40, 0.22);
  opacity: 0.35;
}

/* Topbar */
.vd-topbar {
  height: 52px;
  display: grid;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid rgba(214, 182, 120, 0.10);
  position: relative;
  flex: 0 0 auto;
}

.vd-topbar-title {
  justify-self: center;
  color: rgba(120, 90, 40, 0.72);
}

.vd-topbar-actions {
  position: absolute;
  right: 14px;
  display: flex;
  gap: 10px;
}

.vd-action {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: rgba(50, 42, 26, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.70);
}

.vd-action:active {
  transform: scale(0.94);
}

/* Header */
.vd-header {
  padding: 10px 22px 18px;
  text-align: center;
  border-bottom: 1px solid rgba(214, 182, 120, 0.10);
  position: relative;
  flex: 0 0 auto;
}

.vd-glow {
  position: absolute;
  left: 50%;
  top: -120px;
  transform: translateX(-50%);
  width: 320px;
  height: 320px;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, rgba(246, 232, 203, 0.56), transparent 62%);
  filter: blur(30px);
  opacity: 0.72;
  pointer-events: none;
}

/* Table card */
.table-card {
  display: inline-block;
  padding: 4px;
  border-radius: 18px;
  border: 2px solid rgba(214, 182, 120, 0.55);
  background: rgba(255, 255, 255, 0.86);
  box-shadow:
    0 14px 34px rgba(75, 51, 16, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.table-card-inner {
  border-radius: 14px;
  padding: 10px 28px;
  border: 1px solid rgba(214, 182, 120, 0.28);
  background: rgba(246, 232, 203, 0.50);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    inset 0 -1px 0 rgba(120, 90, 40, 0.10);
}

.vd-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* scroll fade */
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

.seatmap-frame {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.62),
    0 16px 40px rgba(75, 51, 16, 0.08);
  overflow: hidden;
}

/* Footer */
.vd-footer {
  flex: 0 0 auto;
  text-align: center;
  border-top: 1px solid rgba(214, 182, 120, 0.10);
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  padding: 8px 14px calc(14px + env(safe-area-inset-bottom));
}
</style>
