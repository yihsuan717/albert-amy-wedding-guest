<template>
  <div ref="wrapperRef" class="w-full flex justify-center">
    <!-- 寬度靠 CSS 控，canvas 只吃比例 -->
    <canvas ref="canvasRef" class="block w-full max-w-[360px]" style="height: auto" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  /** 要高亮的桌次，例如 "3-8" */
  highlightGroup?: string
}>()

const highlightId = computed(() => props.highlightGroup ?? '')

const wrapperRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

/** 設計稿座位圖尺寸（固定比例） */
const BASE_WIDTH = 360
const BASE_HEIGHT = 520

// 和原本 DOM 版的配置一致
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

// ====== 動畫狀態 ======
let animationFrameId: number | null = null
let startTime: number | null = null

function startAnimation() {
  cancelAnimation()
  startTime = null
  const loop = (timestamp: number) => {
    if (startTime == null) startTime = timestamp
    const t = timestamp - startTime

    const fadeProgress = Math.min(1, t / 700)      // 整張圖淡入
    const pulsePhase = (t % 1600) / 1600          // 0~1 週期呼吸

    drawAll(fadeProgress, pulsePhase)
    animationFrameId = window.requestAnimationFrame(loop)
  }
  animationFrameId = window.requestAnimationFrame(loop)
}

function cancelAnimation() {
  if (animationFrameId != null) {
    window.cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// ====== 主繪圖入口 ======
function drawAll(fadeProgress = 1, pulsePhase = 0) {
  const canvas = canvasRef.value
  if (!canvas) return

  // ★ 用 canvas 實際顯示寬度算比例（會吃 max-w）
  const rect = canvas.getBoundingClientRect()
  if (!rect.width) return

  const dpr = window.devicePixelRatio || 1
  const scale = rect.width / BASE_WIDTH
  const drawWidth = BASE_WIDTH * scale
  const drawHeight = BASE_HEIGHT * scale

  canvas.width = drawWidth * dpr
  canvas.height = drawHeight * dpr

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0)

  // 背景
  ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT)
  ctx.fillStyle = '#f9f7f3'
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT)

  // ------- 上方舞台 + 主桌 -------
  const stageTop = 24
  const stageBarWidth = 260
  const stageBarHeight = 22

  drawStage(ctx, (BASE_WIDTH - stageBarWidth) / 2, stageTop, stageBarWidth, stageBarHeight, fadeProgress)
  drawMainTablePill(ctx, BASE_WIDTH / 2, stageTop + stageBarHeight + 18, fadeProgress)

  // ------- 桌子區塊 -------
  const mapTop = stageTop + stageBarHeight + 18 + 52
  const mapLeft = 28
  const mapRight = BASE_WIDTH - 28
  const mapWidth = mapRight - mapLeft
  const tableHeight = 118
  const verticalGap = 18

  // 前半最高列數 → 算高度
  const frontRows = frontBlocks.reduce((max, col) => Math.max(max, col.length), 0)
  const frontHeight = frontRows * tableHeight + (frontRows - 1) * verticalGap

  // 前半區
  drawBlockArea(ctx, mapLeft, mapTop, mapWidth, frontBlocks, fadeProgress, pulsePhase)

  // 走道位置依前半高度推下去
  const walkwayCenterY = mapTop + frontHeight + 20
  drawWalkway(ctx, BASE_WIDTH / 2, walkwayCenterY, fadeProgress)

  // 後半區起點再往下留一段距離
  const backTop = walkwayCenterY + 30 + 26
  drawBlockArea(ctx, mapLeft, backTop, mapWidth, backBlocks, fadeProgress, pulsePhase)
}

/* ========= 各種小畫家 ========= */

function drawStage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fade: number,
) {
  const r = h / 2
  ctx.save()
  const path = new Path2D()
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.arcTo(x + w, y, x + w, y + r, r)
  path.arcTo(x + w, y + h, x + w - r, y + h, r)
  path.lineTo(x + r, y + h)
  path.arcTo(x, y + h, x, y + r, r)
  path.arcTo(x, y, x + r, y, r)

  const grad = ctx.createLinearGradient(x, y, x + w, y + h)
  grad.addColorStop(0, 'rgba(244,223,221,0.98)')
  grad.addColorStop(1, 'rgba(250,237,226,0.98)')

  ctx.globalAlpha = fade
  ctx.fillStyle = grad
  ctx.shadowColor = 'rgba(0,0,0,0.06)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 8
  ctx.fill(path)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = fade
  ctx.fillStyle = '#8c703d'
  ctx.font = '12px "Noto Sans TC", system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('舞 台', x + w / 2, y + h / 2 + 1)
  ctx.restore()
}

function drawMainTablePill(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  fade: number,
) {
  const w = 96
  const h = 30
  const x = centerX - w / 2
  const y = centerY - h / 2
  const r = h / 2

  ctx.save()
  ctx.globalAlpha = fade
  const path = new Path2D()
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.arcTo(x + w, y, x + w, y + r, r)
  path.arcTo(x + w, y + h, x + w - r, y + h, r)
  path.lineTo(x + r, y + h)
  path.arcTo(x, y + h, x, y + r, r)
  path.arcTo(x, y, x + r, y, r)

  ctx.fillStyle = '#f2e3c4'
  ctx.shadowColor = 'rgba(168,139,77,0.22)'
  ctx.shadowBlur = 16
  ctx.shadowOffsetY = 6
  ctx.fill(path)

  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 1
  ctx.stroke(path)

  ctx.fillStyle = '#5c4826'
  ctx.font = '12px "Noto Sans TC", system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('主桌', centerX, centerY + 1)

  ctx.restore()
}

function drawBlockArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  blocks: string[][],
  fade: number,
  pulsePhase: number,
) {
  const cols = blocks.length
  const colGap = 14
  const colWidth = (width - colGap * (cols - 1)) / cols
  const tableHeight = 118
  const tableWidth = 56
  const verticalGap = 18

  for (let colIdx = 0; colIdx < cols; colIdx++) {
    const col = blocks[colIdx]
    const colX = x + colIdx * (colWidth + colGap)

    for (let rowIdx = 0; rowIdx < col.length; rowIdx++) {
      const tableId = col[rowIdx]
      const tableX = colX + (colWidth - tableWidth) / 2
      const tableY = y + rowIdx * (tableHeight + verticalGap)

      const isHighlight = tableId === highlightId.value

      drawTable(ctx, tableX, tableY, tableWidth, tableHeight, isHighlight, fade, pulsePhase)
      drawTableLabel(ctx, tableX + tableWidth / 2, tableY + tableHeight + 16, tableId, isHighlight, fade)
    }
  }
}

function drawTable(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  highlight: boolean,
  fade: number,
  pulsePhase: number,
) {
  ctx.save()
  const r = 20
  const path = new Path2D()
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.arcTo(x + w, y, x + w, y + r, r)
  path.arcTo(x + w, y + h, x + w - r, y + h, r)
  path.lineTo(x + r, y + h)
  path.arcTo(x, y + h, x, y + r, r)
  path.arcTo(x, y, x + r, y, r)

  const baseGrad = ctx.createLinearGradient(x, y, x, y + h)
  baseGrad.addColorStop(0, '#fbf4e5')
  baseGrad.addColorStop(1, '#f3e1c5')

  // highlight 呼吸放大一點點
  const breatheScale = highlight ? 1 + 0.02 * Math.sin(pulsePhase * Math.PI * 2) : 1
  const centerX = x + w / 2
  const centerY = y + h / 2

  ctx.translate(centerX, centerY)
  ctx.scale(breatheScale, breatheScale)
  ctx.translate(-centerX, -centerY)

  ctx.globalAlpha = fade
  ctx.fillStyle = baseGrad
  ctx.shadowColor = 'rgba(161,140,96,0.14)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 10
  ctx.fill(path)

  ctx.strokeStyle = 'rgba(255,255,255,0.95)'
  ctx.lineWidth = 1
  ctx.stroke(path)

  if (highlight) {
    ctx.save()
    ctx.globalAlpha = fade
    ctx.shadowColor = 'rgba(232,203,144,0.8)'
    ctx.shadowBlur = 26
    ctx.strokeStyle = 'rgba(199,164,96,0.98)'
    ctx.lineWidth = 2
    ctx.stroke(path)
    ctx.restore()
  }

  drawSeatDots(ctx, x, y, w, h, highlight, fade, pulsePhase)

  ctx.restore()
}

function drawSeatDots(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  highlight: boolean,
  fade: number,
  pulsePhase: number,
) {
  const positions: [number, number][] = [
    [0.22, 0.12], [0.78, 0.12],
    [0.22, 0.50], [0.78, 0.50],
    [0.22, 0.88], [0.78, 0.88],
  ]

  const pulse = highlight ? 0.85 + 0.25 * Math.sin(pulsePhase * Math.PI * 2) : 1

  for (const [px, py] of positions) {
    const cx = x + w * px
    const cy = y + h * py

    const dotGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 8)
    dotGrad.addColorStop(0, highlight ? '#ffe7b3' : '#f7e7c3')
    dotGrad.addColorStop(1, highlight ? '#d7b05f' : '#d8c398')

    ctx.beginPath()
    ctx.globalAlpha = fade * pulse
    ctx.arc(cx, cy, 6.2, 0, Math.PI * 2)
    ctx.fillStyle = dotGrad
    ctx.fill()

    ctx.lineWidth = highlight ? 1.4 : 1
    ctx.strokeStyle = highlight
      ? 'rgba(197,169,104,0.85)'
      : 'rgba(255,255,255,0.95)'
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawTableLabel(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  tableId: string,
  highlight: boolean,
  fade: number,
) {
  ctx.save()
  ctx.globalAlpha = fade
  ctx.font = '12px "Noto Sans TC", system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = highlight ? '#a88b4d' : '#6b7280'
  ctx.fillText(tableId, centerX, y)
  ctx.restore()
}

function drawWalkway(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  fade: number,
) {
  const w = 160
  const h = 30
  const x = centerX - w / 2
  const y = centerY - h / 2
  const r = h / 2

  ctx.save()
  ctx.globalAlpha = fade
  const path = new Path2D()
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.arcTo(x + w, y, x + w, y + r, r)
  path.arcTo(x + w, y + h, x + w - r, y + h, r)
  path.lineTo(x + r, y + h)
  path.arcTo(x, y + h, x, y + r, r)
  path.arcTo(x, y, x + r, y, r)

  ctx.fillStyle = '#fef7ea'
  ctx.shadowColor = 'rgba(0,0,0,0.06)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 8
  ctx.fill(path)

  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 1
  ctx.stroke(path)

  ctx.fillStyle = '#c37d5d'
  ctx.font = '13px "Noto Sans TC", system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('走道', centerX, centerY + 1)

  ctx.restore()
}

/* ========= lifecycle ========= */

function handleResize() {
  drawAll(1, 0)
}

onMounted(() => {
  startAnimation()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  cancelAnimation()
  window.removeEventListener('resize', handleResize)
})

watch(highlightId, () => {
  startAnimation()
})
</script>
