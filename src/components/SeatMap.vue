<!-- src/components/SeatMap.vue -->
<template>
  <div ref="mapRoot" class="seatmap-root mx-auto rounded-2xl px-5 pt-5 pb-4">
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

const props = defineProps<{ highlightGroup?: string }>()

const mapRoot = ref<HTMLDivElement | null>(null)
const highlightId = computed(() => props.highlightGroup ?? '')
const isHighlight = (tableId: string) => tableId === highlightId.value

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

const scrollToHighlight = () => {
  if (!mapRoot.value || !highlightId.value) return
  const el = mapRoot.value.querySelector<HTMLElement>(`[data-table-id="${highlightId.value}"]`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

onMounted(() => {
  if (highlightId.value) nextTick(scrollToHighlight)
})

watch(
  () => highlightId.value,
  () => nextTick(scrollToHighlight),
)
</script>

<style scoped>
/* =========================
   SeatMap iOS26 Paper Card
   ========================= */

.seatmap-root {
  position: relative;
  width: 100%;
  max-width: 100%;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(214, 182, 120, 0.18);
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.65) inset;
}

.seatmap-root::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background:
    radial-gradient(680px 240px at 50% 0%, rgba(246, 232, 203, 0.46), transparent 62%),
    radial-gradient(520px 320px at 90% 110%, rgba(214, 182, 120, 0.10), transparent 70%),
    repeating-linear-gradient(0deg,
      rgba(255, 255, 255, 0.06) 0px,
      rgba(255, 255, 255, 0.06) 1px,
      rgba(255, 255, 255, 0.00) 3px,
      rgba(255, 255, 255, 0.00) 6px);
  opacity: 0.18;
}

/* ===== 舞台 / 主桌 ===== */
.stage-bar {
  width: 100%;
  max-width: 260px;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(250, 241, 233, 1), rgba(252, 246, 238, 1));
  border: 1px solid rgba(214, 182, 120, 0.16);
  text-align: center;
  padding: 5px 0;
  font-size: 12px;
  letter-spacing: 0.28em;
  color: rgba(120, 90, 40, 0.78);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
}

.main-table-pill {
  padding: 6px 18px;
  border-radius: 9999px;
  background: rgba(246, 232, 203, 0.92);
  border: 1px solid rgba(214, 182, 120, 0.22);
  color: rgba(120, 90, 40, 0.82);
  font-size: 12px;
  letter-spacing: 0.22em;
  box-shadow:
    0 8px 18px rgba(168, 139, 77, 0.14),
    0 0 0 1px rgba(255, 255, 255, 0.70) inset;
}

/* ===== layout ===== */
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

/* ===== 桌子 ===== */
.table-rect {
  width: 56px;
  height: 118px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 252, 246, 1), rgba(251, 244, 230, 1));
  border: 1px solid rgba(214, 182, 120, 0.18);
  box-shadow:
    0 10px 18px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.78) inset;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-rect::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(120px 70px at 50% 10%, rgba(255, 255, 255, 0.88), transparent 60%);
  opacity: 0.7;
}

/* seats */
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
  background: rgba(255, 255, 255, 0.92);
  border: 1.6px solid rgba(214, 182, 120, 0.42);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.10),
    0 0 0 1px rgba(255, 255, 255, 0.65) inset;
  transform: translate(-50%, -50%);
}

.seat-dot:nth-child(1),
.seat-dot:nth-child(2) {
  top: 10%;
}

.seat-dot:nth-child(3),
.seat-dot:nth-child(4) {
  top: 50%;
}

.seat-dot:nth-child(5),
.seat-dot:nth-child(6) {
  top: 90%;
}

.seat-dot:nth-child(1),
.seat-dot:nth-child(3),
.seat-dot:nth-child(5) {
  left: 20%;
}

.seat-dot:nth-child(2),
.seat-dot:nth-child(4),
.seat-dot:nth-child(6) {
  left: 80%;
}

.table-label {
  font-size: 12px;
  letter-spacing: 0.14em;
  color: rgba(40, 36, 28, 0.78);
}

/* ===== highlight：高級呼吸 pulse（柔、穩、像 iOS） ===== */
.table-rect--highlight {
  background: linear-gradient(180deg, rgba(255, 253, 248, 1), rgba(252, 244, 228, 1));
  border: 1.5px solid rgba(214, 182, 120, 0.78);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.82) inset,
    0 16px 28px rgba(168, 139, 77, 0.18);
}

/* 外光暈（會呼吸） */
.table-rect--highlight::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 26px;
  pointer-events: none;
  background: radial-gradient(circle,
      rgba(232, 203, 144, 0.28) 0%,
      rgba(232, 203, 144, 0.14) 55%,
      transparent 82%);
  filter: blur(9px);
  animation: seatHaloPulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes seatHaloPulse {

  0%,
  100% {
    transform: scale(0.98);
    opacity: 0.72;
  }

  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

.table-rect--highlight .seat-dot {
  background: rgba(246, 232, 203, 0.90);
  border-color: rgba(214, 182, 120, 0.72);
  box-shadow:
    0 2px 4px rgba(168, 139, 77, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.68) inset;
}

.table-label--highlight {
  color: rgba(168, 139, 77, 0.92);
  font-weight: 600;
}

/* ===== 走道 ===== */
.walkway-pill {
  min-width: 150px;
  padding: 6px 18px;
  border-radius: 9999px;
  background: rgba(255, 250, 242, 1);
  border: 1px dashed rgba(214, 182, 120, 0.22);
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.30em;
  color: rgba(120, 90, 40, 0.72);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.05);
}

@media (prefers-reduced-motion: reduce) {
  .table-rect--highlight::after {
    animation: none;
  }
}
</style>
