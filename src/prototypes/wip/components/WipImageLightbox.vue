<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { animate } from 'motion-v'
import { useWipReducedMotion } from '../composables/useWipMotion.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: '' },
  label: { type: String, default: '' },
  origin: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const reduceMotion = useWipReducedMotion()
const visible = ref(false)
const revealed = ref(false)
const placed = ref(false)
const view = ref(null)
const imageEl = ref(null)
const closeButton = ref(null)

let runId = 0
let grewFor = 0
let controls

const grow = { type: 'spring', stiffness: 320, damping: 32, mass: 0.85 }

function close() {
  if (!visible.value) return
  emit('close')
}

function onKeydown(event) {
  if (visible.value && event.key === 'Escape') close()
}

function fitRect(naturalWidth, naturalHeight) {
  const padX = window.innerWidth <= 700 ? 40 : 96
  const maxWidth = Math.min(1200, window.innerWidth - padX)
  const maxHeight = Math.max(120, window.innerHeight - 144)
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1)
  const width = naturalWidth * scale
  const height = naturalHeight * scale
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  }
}

function place(box) {
  const el = imageEl.value
  if (!el || !box) return
  el.style.left = `${box.left}px`
  el.style.top = `${box.top}px`
  el.style.width = `${box.width}px`
  el.style.height = `${box.height}px`
  if (view.value?.origin?.objectPosition) {
    el.style.objectPosition = view.value.origin.objectPosition
  }
}

async function glide(box) {
  const el = imageEl.value
  if (!el || !box) return false
  controls?.stop()
  if (reduceMotion.value) {
    place(box)
    return true
  }
  const current = animate(
    el,
    {
      left: `${box.left}px`,
      top: `${box.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    },
    grow,
  )
  controls = current
  try {
    await current.finished
  } catch {
    return false
  }
  return controls === current
}

async function growFromOrigin(id) {
  const img = imageEl.value
  if (!img || id !== runId || grewFor === id || !img.naturalWidth) return
  grewFor = id
  await glide(fitRect(img.naturalWidth, img.naturalHeight))
}

function onLoad() {
  growFromOrigin(runId)
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      const id = ++runId
      grewFor = 0
      view.value = {
        src: props.src,
        label: props.label,
        origin: props.origin ? { ...props.origin } : null,
      }
      visible.value = true
      revealed.value = false
      placed.value = false
      await nextTick()
      if (id !== runId) return
      place(view.value.origin)
      placed.value = true
      requestAnimationFrame(() => {
        if (id === runId) revealed.value = true
      })
      closeButton.value?.focus()
      if (imageEl.value?.complete) growFromOrigin(id)
      return
    }

    if (!visible.value || !view.value) return
    const id = ++runId
    revealed.value = false
    if (reduceMotion.value || !view.value.origin) {
      visible.value = false
      view.value = null
      return
    }
    await glide(view.value.origin)
    if (id !== runId) return
    visible.value = false
    placed.value = false
    view.value = null
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  controls?.stop()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible && view" class="wip-image-lightbox" role="dialog" aria-modal="true" :aria-label="view.label">
      <div class="wip-image-lightbox__scrim" :class="{ 'is-open': revealed }" @click="close" />
      <button
        ref="closeButton"
        type="button"
        class="wip-image-lightbox__close"
        :class="{ 'is-open': revealed }"
        aria-label="Close"
        @click="close"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
      <img
        ref="imageEl"
        class="wip-image-lightbox__image"
        :class="{ 'is-placed': placed }"
        :src="view.src"
        :alt="view.label"
        @load="onLoad"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.wip-image-lightbox {
  position: fixed;
  z-index: 60;
  inset: 0;
  pointer-events: none;
}

.wip-image-lightbox__scrim {
  position: absolute;
  inset: 0;
  background: rgb(18 18 18 / 72%);
  opacity: 0;
  pointer-events: auto;
  transition: opacity 0.45s ease;
}

.wip-image-lightbox__scrim.is-open {
  opacity: 1;
}

.wip-image-lightbox__image {
  position: fixed;
  z-index: 1;
  display: block;
  margin: 0;
  object-fit: cover;
  opacity: 0;
  pointer-events: auto;
}

.wip-image-lightbox__image.is-placed {
  opacity: 1;
}

.wip-image-lightbox__close {
  position: absolute;
  z-index: 2;
  top: 20px;
  right: 20px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: #121212;
  box-shadow: 0 1px 4px rgb(18 18 18 / 16%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease 0.12s;
}

.wip-image-lightbox__close.is-open {
  opacity: 1;
  pointer-events: auto;
}

.wip-image-lightbox__close:hover {
  background: #f4f4f4;
}
</style>
