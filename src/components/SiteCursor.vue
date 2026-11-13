<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import cursorUrl from '../prototypes/canvas/assets/cursor.svg'
import pencilUrl from '../prototypes/wip/assets/cursor-pencil.svg'

const PENCIL_HOTSPOT = { x: 19, y: 7 }
const UI_TARGET = '.wip-controls, .wip-nav, .brand-mark, .btn, .wip-gallery__cta, .wip-fixed-nav, .wip-editable, a, button, input, textarea, label'

const x = ref(-32)
const y = ref(-32)
const visible = ref(false)
const pencil = ref(false)

function onMove(event) {
  x.value = event.clientX
  y.value = event.clientY
  visible.value = true
  const target = event.target
  const drawing = target instanceof Element && target.closest('.wip-root--drawing')
  const onUi = target instanceof Element && target.closest(UI_TARGET)
  pencil.value = Boolean(drawing && !onUi)
}

function onLeave() {
  visible.value = false
}

onMounted(() => {
  document.documentElement.classList.add('site-cursor')
  window.addEventListener('pointermove', onMove)
  document.documentElement.addEventListener('mouseleave', onLeave)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('site-cursor')
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('mouseleave', onLeave)
})
</script>

<template>
  <img
    class="site-cursor"
    :class="{ 'is-hidden': !visible, 'is-pencil': pencil }"
    :src="pencil ? pencilUrl : cursorUrl"
    alt=""
    :width="pencil ? 32 : 16"
    :height="pencil ? 32 : 16"
    draggable="false"
    :style="{
      transform: pencil
        ? `translate(${x - PENCIL_HOTSPOT.x}px, ${y - PENCIL_HOTSPOT.y}px)`
        : `translate(${x}px, ${y}px)`,
    }"
  />
</template>

<style>
html.site-cursor,
html.site-cursor * {
  cursor: none !important;
}
</style>

<style scoped>
.site-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483646;
  pointer-events: none;
  user-select: none;
}

.site-cursor.is-hidden {
  opacity: 0;
}
</style>
