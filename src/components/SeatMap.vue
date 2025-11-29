<!-- src/components/SeatMap.vue -->
<template>
  <div ref="mapRoot"
    class="seatmap-root mx-auto bg-white/90 backdrop-blur-xl rounded-2xl border border-champagne-100/80 shadow-[0_18px_40px_rgba(0,0,0,0.08)] px-5 pt-5 pb-4">
    <!-- 舞台 / 主桌 -->
    <div class="mb-4 flex flex-col items-center gap-2">
      <div class="stage-bar">舞台</div>
      <div class="main-table-pill">主桌</div>
    </div>

    <!-- 前半區 -->
    <div class="blocks-grid">
      <div v-for="(col, colIdx) in frontBlocks" :key="'front-' + colIdx" class="block-col">
        <div v-for="tableId in col" :key="tableId" class="table-wrapper">
          <div class="table-rect" :data-table-id="tableId" :class="{ 'table-rect--highlight': isHighlight(tableId) }">
            <div class="seat-dots">
              <span v-for="n in 6" :key="n" class="seat-dot" />
            </div>
          </div>
          <div class="table-label" :class="{ 'table-label--highlight': isHighlight(tableId) }">
            {{ tableId }}
          </div>
        </div>
      </div>
    </div>

    <!-- 中間走道 -->
    <div class="mt-4 mb-4 flex justify-center">
      <div class="walkway-pill">走道</div>
    </div>

    <!-- 後半區 -->
    <div class="blocks-grid">
      <div v-for="(col, colIdx) in backBlocks" :key="'back-' + colIdx" class="block-col">
        <div v-for="tableId in col" :key="tableId" class="table-wrapper">
          <div class="table-rect" :data-table-id="tableId" :class="{ 'table-rect--highlight': isHighlight(tableId) }">
            <div class="seat-dots">
              <span v-for="n in 6" :key="n" class="seat-dot" />
            </div>
          </div>
          <div class="table-label" :class="{ 'table-label--highlight': isHighlight(tableId) }">
            {{ tableId }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  /** 例如 '3-1'，用來高亮＋自動捲動 */
  highlightGroup?: string
}>()

const mapRoot = ref<HTMLDivElement | null>(null)

const highlightId = computed(() => props.highlightGroup ?? '')

const isHighlight = (tableId: string) => tableId === highlightId.value

// 佈局：每個陣列是一「欄」直直排下來的長桌（對應你 Excel）
const frontBlocks: string[][] = [
  ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6'],
  ['2-1', '2-2', '2-3', '2-4', '2-5'],
  ['3-1', '3-2', '3-3', '3-4', '3-5'],
  ['5-1', '5-2', '5-3', '5-4', '5-5'],
]

const backBlocks: string[][] = [
  ['1-7', '1-8', '1-9', '1-10'],
  ['2-6', '2-7', '2-8', '2-9'],
  ['3-6', '3-7', '3-8', '3-9'],
  ['5-6', '5-7', '5-8', '5-9'],
]

// 高亮桌次自動捲到視窗中間
const scrollToHighlight = () => {
  if (!mapRoot.value || !highlightId.value) return
  const el = mapRoot.value.querySelector<HTMLElement>(
    `[data-table-id="${highlightId.value}"]`,
  )
  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

onMounted(() => {
  if (highlightId.value) {
    nextTick(scrollToHighlight)
  }
})

watch(
  () => highlightId.value,
  () => {
    nextTick(scrollToHighlight)
  },
)
</script>

<style scoped>
.seatmap-root {
  transform-origin: top center;
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.98);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(248, 240, 225, 0.9);
}

/* ===== 舞台 / 主桌 ===== */
.stage-bar {
  width: 100%;
  max-width: 260px;
  border-radius: 9999px;
  background: linear-gradient(to right,
      rgba(244, 223, 221, 0.98),
      rgba(250, 237, 226, 0.98));
  text-align: center;
  padding: 4px 0;
  font-size: 12px;
  letter-spacing: 0.25em;
  color: #8c703d;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.main-table-pill {
  padding: 6px 18px;
  border-radius: 9999px;
  background: #f2e3c4;
  color: #5c4826;
  font-size: 12px;
  letter-spacing: 0.2em;
  box-shadow:
    0 6px 16px rgba(168, 139, 77, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.9);
}

/* ===== 桌子區塊 ===== */
.blocks-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 14px;
  row-gap: 18px;
  justify-items: center;
}

.block-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 長桌外框 */
.table-rect {
  width: 56px;
  height: 118px;
  border-radius: 20px;
  background: #f9f2e5;
  box-shadow:
    0 10px 22px rgba(161, 140, 96, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.95);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 上方高光，讓桌子邊緣更利 */
.table-rect::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%,
      rgba(255, 255, 255, 0.95),
      transparent 70%);
  opacity: 0.9;
  pointer-events: none;
}

/* 6 個座位點 */
.seat-dots {
  position: relative;
  width: 72%;
  height: 78%;
}

.seat-dot {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.95);
  background: radial-gradient(circle, #f7e7c3 0%, #e8d6b0 55%, #d8c398 100%);
  box-shadow:
    0 0 0 1px rgba(201, 174, 121, 0.35),
    0 3px 5px rgba(0, 0, 0, 0.12);
  transform: translate(-50%, -50%);
}

/* 上方一組（靠桌子兩端） */
.seat-dot:nth-child(1),
.seat-dot:nth-child(2) {
  top: 10%;
}

/* 中間一組 */
.seat-dot:nth-child(3),
.seat-dot:nth-child(4) {
  top: 50%;
}

/* 下方一組 */
.seat-dot:nth-child(5),
.seat-dot:nth-child(6) {
  top: 90%;
}

/* 左側三個 */
.seat-dot:nth-child(1),
.seat-dot:nth-child(3),
.seat-dot:nth-child(5) {
  left: 20%;
}

/* 右側三個 */
.seat-dot:nth-child(2),
.seat-dot:nth-child(4),
.seat-dot:nth-child(6) {
  left: 80%;
}

/* 高亮桌：用設計系統原本的 pulse-light，外框微金 */
.table-rect--highlight {
  position: relative;
  background: #fdf8e9;
  /* 乳白偏金 */
  border-radius: 20px;
  box-shadow:
    0 0 0 1.5px rgba(199, 164, 96, 0.95),
    /* 金色細框 */
    inset 0 0 0 1px rgba(255, 255, 255, 0.9),
    /* 內白框 */
    0 10px 28px rgba(168, 139, 77, 0.24);
  /* 柔和下影 */
  animation: var(--animate-pulse-light);
}

/* pulse 外光暈，跟外框圓角對齊 */
.table-rect--highlight::before {
  content: '';
  position: absolute;
  inset: -6px;
  /* 光暈略大一圈 */
  border-radius: 24px;
  background: radial-gradient(circle,
      rgba(232, 203, 144, 0.35) 0%,
      rgba(232, 203, 144, 0.12) 55%,
      transparent 90%);
  filter: blur(6px);
  animation: var(--animate-pulse-light);
  pointer-events: none;
}

.table-rect--highlight .seat-dot {
  box-shadow:
    0 0 0 1px rgba(197, 169, 104, 0.55),
    0 3px 6px rgba(168, 139, 77, 0.4);
}

/* 桌號文字 */
.table-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: #6b7280;
}

.table-label--highlight {
  color: #a88b4d;
  font-weight: 600;
}

/* ===== 走道 ===== */
.walkway-pill {
  min-width: 150px;
  padding: 6px 18px;
  border-radius: 9999px;
  background: #fef7ea;
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.35em;
  color: #c37d5d;
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
}

.walkway-pill--soft {
  opacity: 0.9;
}
</style>
