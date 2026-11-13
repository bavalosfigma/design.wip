<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
  color: { type: String, default: '#121212' },
})

const canvasRef = ref(null)
const rootEl = ref(null)

const strokes = []
let drawingStroke = null
let resizeObserver

const STROKE_WIDTH = 8

function context() {
  const canvas = canvasRef.value
  if (!canvas) return null
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.globalAlpha = 1
  return ctx
}

function applyStroke(ctx, stroke) {
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
  ctx.lineWidth = STROKE_WIDTH
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function drawStroke(ctx, stroke) {
  const points = stroke.points
  if (!points.length) return
  applyStroke(ctx, stroke)
  if (points.length === 1) {
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, STROKE_WIDTH / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < points.length - 1; index++) {
    const point = points[index]
    const next = points[index + 1]
    ctx.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2)
  }
  const last = points[points.length - 1]
  ctx.lineTo(last.x, last.y)
  ctx.stroke()
}

function redraw() {
  const canvas = canvasRef.value
  const ctx = context()
  if (!canvas || !ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const stroke of strokes) drawStroke(ctx, stroke)
}

function clear() {
  drawingStroke = null
  strokes.length = 0
  redraw()
}

defineExpose({ clear })

function resize() {
  const root = rootEl.value
  const canvas = canvasRef.value
  if (!root || !canvas) return
  const width = root.clientWidth
  const height = root.scrollHeight
  const dpr = window.devicePixelRatio || 1
  const nextWidth = Math.max(1, Math.round(width * dpr))
  const nextHeight = Math.max(1, Math.round(height * dpr))
  if (canvas.width === nextWidth && canvas.height === nextHeight) return
  canvas.width = nextWidth
  canvas.height = nextHeight
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  redraw()
}

function pointFromEvent(event) {
  const root = rootEl.value
  const rect = root.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top + root.scrollTop,
  }
}

function isUiTarget(event) {
  return Boolean(event.target.closest('.wip-controls, .wip-nav, .wip-gallery__cta, .wip-fixed-nav, a'))
}

function onPointerDown(event) {
  const root = rootEl.value
  if (!props.active || !root || event.button !== 0 || event.pointerType === 'touch') return
  if (isUiTarget(event)) return
  event.preventDefault()
  const point = pointFromEvent(event)
  drawingStroke = {
    color: props.color,
    points: [point],
  }
  strokes.push(drawingStroke)
  root.setPointerCapture(event.pointerId)
  redraw()
}

function onPointerMove(event) {
  if (!drawingStroke || !event.currentTarget.hasPointerCapture(event.pointerId)) return
  const point = pointFromEvent(event)
  const previous = drawingStroke.points.at(-1)
  if (!previous) return
  const dx = point.x - previous.x
  const dy = point.y - previous.y
  if (dx * dx + dy * dy < 1) return
  drawingStroke.points.push(point)
  redraw()
}

function onPointerUp(event) {
  if (!drawingStroke) return
  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
  drawingStroke = null
}

function bindRoot(root) {
  root.addEventListener('pointerdown', onPointerDown, true)
  root.addEventListener('pointermove', onPointerMove)
  root.addEventListener('pointerup', onPointerUp)
  root.addEventListener('pointercancel', onPointerUp)
}

function unbindRoot(root) {
  root.removeEventListener('pointerdown', onPointerDown, true)
  root.removeEventListener('pointermove', onPointerMove)
  root.removeEventListener('pointerup', onPointerUp)
  root.removeEventListener('pointercancel', onPointerUp)
}

onMounted(() => {
  rootEl.value = canvasRef.value?.parentElement ?? null
  if (rootEl.value) bindRoot(rootEl.value)
  resize()
  resizeObserver = new ResizeObserver(() => resize())
  if (rootEl.value) resizeObserver.observe(rootEl.value)
  const content = rootEl.value?.querySelector('.wip-canvas')
  if (content) resizeObserver.observe(content)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (rootEl.value) unbindRoot(rootEl.value)
  document.documentElement.classList.remove('wip-drawing')
})

watch(
  () => props.active,
  (active) => {
    rootEl.value?.classList.toggle('wip-root--drawing', active)
    document.documentElement.classList.toggle('wip-drawing', active)
    if (!active) drawingStroke = null
  },
)
</script>

<template>
  <canvas ref="canvasRef" class="wip-draw" aria-hidden="true" />
</template>

<style scoped>
.wip-draw {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}
</style>

<style>
html.wip-drawing .wip-image-lightbox,
html.wip-drawing .wip-good-lightbox,
html.wip-drawing .wip-video-lightbox {
  pointer-events: none !important;
}
</style>
