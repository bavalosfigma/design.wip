<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { WIP_HERO_MARK_SCALE, WIP_MARK_SCALE, brandOutlines } from '../data/brandOutlines.js'
import { introShapes } from '../data/introShapes.js'
import {
  isWipSegmentSelected,
  nudgeWipBrandPathPoint,
  selectWipBrandSegment,
  wipHandlesForLayout,
  wipPathD,
  wipPathsForLayout,
} from '../composables/useWipBrandPathState.js'
import { clientDeltaToSvg } from '../utils/svgPath.js'

const props = defineProps({
  layoutId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  scale: {
    type: Number,
    default: WIP_MARK_SCALE,
  },
  letterPoses: {
    type: Array,
    default: null,
  },
  fill: {
    type: String,
    default: '',
  },
})

const svgRef = ref(null)
const POINT_STROKE = '#b4b4b4'
// Match the on-screen anchors on the Figma.Design wordmark, even when the
// artwork is scaled to a different size.
const ANCHOR_PX = 2 * WIP_HERO_MARK_SCALE
const HIT_PX = 10 * WIP_HERO_MARK_SCALE
const pxPerUnit = ref(props.scale)
const handleSize = computed(() => ANCHOR_PX / (pxPerUnit.value || 1))
const handleHalf = computed(() => handleSize.value / 2)
const hitSize = computed(() => HIT_PX / (pxPerUnit.value || 1))
const hitHalf = computed(() => hitSize.value / 2)

let resizeObserver

function measureScale() {
  const svg = svgRef.value
  const viewWidth = svg?.viewBox?.baseVal?.width
  const rendered = svg?.getBoundingClientRect().width
  if (!viewWidth || !rendered) return
  pxPerUnit.value = rendered / viewWidth
}

const outlines = { ...brandOutlines, ...introShapes }
const meta = computed(() => outlines[props.layoutId])
const paths = computed(() => wipPathsForLayout(props.layoutId))

const svgProps = computed(() => {
  const entry = meta.value
  if (!entry) return null
  return {
    width: entry.width * props.scale,
    height: entry.height * props.scale,
    viewBox: entry.viewBox,
  }
})

const editHandles = computed(() => wipHandlesForLayout(props.layoutId))

function handlesFor(pathIndex) {
  return editHandles.value.filter((handle) => handle.pathIndex === pathIndex)
}

function letterStyle(index) {
  const pose = props.letterPoses?.[index]
  if (!pose) return undefined
  return {
    opacity: pose.opacity,
    transform: `translateY(${pose.y}px) rotate(${pose.rotate}deg)`,
  }
}

function pathStroke() {
  return POINT_STROKE
}

function onPathPointerDown(path, event) {
  event.stopPropagation()
  selectWipBrandSegment(props.layoutId, path.segment)
}

function onHandlePointerDown(handle, event) {
  event.stopPropagation()
  event.preventDefault()

  const pointerId = event.pointerId
  const target = event.currentTarget
  let lastX = event.clientX
  let lastY = event.clientY

  target?.setPointerCapture?.(pointerId)

  function onMove(ev) {
    if (ev.pointerId !== pointerId) return
    const dxClient = ev.clientX - lastX
    const dyClient = ev.clientY - lastY
    lastX = ev.clientX
    lastY = ev.clientY
    const { dx, dy } = clientDeltaToSvg(svgRef.value, dxClient, dyClient)
    nudgeWipBrandPathPoint(props.layoutId, handle.pathIndex, handle.commandIndex, dx, dy)
  }

  function onUp(ev) {
    if (ev.pointerId !== pointerId) return
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    try {
      target?.releasePointerCapture?.(pointerId)
    } catch {
      /* already released */
    }
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}

onMounted(() => {
  measureScale()
  resizeObserver = new ResizeObserver(measureScale)
  if (svgRef.value) resizeObserver.observe(svgRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    v-if="svgProps"
    class="wip-wordmark"
    :aria-label="text || undefined"
    role="img"
  >
    <svg
      ref="svgRef"
      class="wip-wordmark__svg"
      :width="svgProps.width"
      :height="svgProps.height"
      :viewBox="svgProps.viewBox"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        v-for="(path, index) in paths"
        :key="index"
        class="wip-wordmark__letter"
        :style="letterStyle(index)"
      >
        <path
          class="wip-wordmark__path"
          :class="{
            'wip-wordmark__path--active': isWipSegmentSelected(layoutId, path.segment),
          }"
          :d="wipPathD(path)"
          :fill="fill || path.fill"
          :stroke="pathStroke(path)"
          stroke-width="1.25"
          stroke-linejoin="round"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
          @pointerdown="onPathPointerDown(path, $event)"
        />
        <g v-if="handlesFor(index).length" class="wip-wordmark__handles">
          <g
            v-for="(handle, handleIndex) in handlesFor(index)"
            :key="`${handle.pathIndex}-${handle.commandIndex}-${handleIndex}`"
            class="wip-wordmark__handle"
            @pointerdown="onHandlePointerDown(handle, $event)"
          >
            <rect
              class="wip-wordmark__handle-hit"
              :x="handle.x - hitHalf"
              :y="handle.y - hitHalf"
              :width="hitSize"
              :height="hitSize"
            />
            <rect
              class="wip-wordmark__handle-dot"
              :x="handle.x - handleHalf"
              :y="handle.y - handleHalf"
              :width="handleSize"
              :height="handleSize"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.wip-wordmark {
  position: relative;
  z-index: 2;
  line-height: 0;
  pointer-events: auto;
  touch-action: none;
}

.wip-wordmark__svg {
  display: block;
  overflow: visible;
}

.wip-wordmark__letter {
  transform-box: fill-box;
  transform-origin: center bottom;
}

.wip-wordmark__path {
  pointer-events: visiblePainted;
  cursor: pointer;
}

.wip-wordmark__handles {
  pointer-events: none;
}

.wip-wordmark__handle {
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
}

.wip-wordmark__handle:active {
  cursor: grabbing;
}

.wip-wordmark__handle-hit {
  fill: transparent;
}

.wip-wordmark__handle-dot {
  fill: #fff;
  stroke: #0d99ff;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
</style>
