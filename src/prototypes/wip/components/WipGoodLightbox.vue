<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { useWipReducedMotion } from '../composables/useWipMotion.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: '' },
  index: { type: String, default: '' },
  title: { type: String, default: '' },
  by: { type: String, default: '' },
  quote: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const reduceMotion = useWipReducedMotion()
const closeButton = ref(null)
const titleId = 'wip-good-lightbox-title'
const motionTransition = computed(() =>
  reduceMotion.value ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
)

let scrollRoot = null

function close() {
  emit('close')
}

function onKeydown(event) {
  if (props.open && event.key === 'Escape') close()
}

function setScrollLock(locked) {
  scrollRoot = scrollRoot ?? document.querySelector('.wip-root')
  if (scrollRoot) scrollRoot.style.overflow = locked ? 'hidden' : ''
}

watch(
  () => props.open,
  async (isOpen) => {
    setScrollLock(isOpen)
    if (!isOpen) {
      window.removeEventListener('keydown', onKeydown)
      return
    }
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    closeButton.value?.focus()
  },
)

onUnmounted(() => {
  setScrollLock(false)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="open"
        class="wip-good-lightbox"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="motionTransition"
        @click.self="close"
      >
        <button ref="closeButton" type="button" class="wip-good-lightbox__close" aria-label="Close" @click="close">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>

        <motion.div
          class="wip-good-lightbox__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :initial="{ opacity: 0, y: 28 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: 16 }"
          :transition="motionTransition"
          @click.stop
        >
          <div class="wip-good-lightbox__media">
            <img :src="src" :alt="title" />
          </div>
          <div class="wip-good-lightbox__copy">
            <p class="wip-good-lightbox__index type-editorial-caption">({{ index }})</p>
            <h2 :id="titleId" class="wip-good-lightbox__title">{{ title }}</h2>
            <blockquote class="wip-good-lightbox__quote">
              <p>{{ quote }}</p>
            </blockquote>
            <p class="wip-good-lightbox__by">submitted by {{ by }}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<style scoped>
.wip-good-lightbox {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 48px;
  background: rgb(18 18 18 / 72%);
  font-family: 'Figma Sans VF', sans-serif;
  font-weight: 700;
  font-variation-settings: 'wdth' 87.5, 'wght' 700;
  color: #121212;
}

.wip-good-lightbox__panel {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.8fr);
  width: min(1080px, 100%);
  height: min(720px, calc(100vh - 96px));
  overflow: hidden;
  background: #fff;
}

.wip-good-lightbox__media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  padding: 28px;
  background: #f4f4f4;
}

.wip-good-lightbox__media img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.wip-good-lightbox__copy {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 18px;
  min-width: 0;
  padding: 36px 40px 44px;
}

.wip-good-lightbox__index {
  margin: 0;
  color: #6b6b6b;
}

.wip-good-lightbox__title {
  margin: 0;
  font-size: 32px;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.wip-good-lightbox__quote {
  margin: 0;
  letter-spacing: -0.035em;
}

.wip-good-lightbox__quote p {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  letter-spacing: inherit;
}

.wip-good-lightbox__quote p::before {
  content: '“';
}

.wip-good-lightbox__quote p::after {
  content: '”';
}

.wip-good-lightbox__by {
  margin: 0;
  color: #6b6b6b;
  font-size: 12px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.wip-good-lightbox__close {
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
}

.wip-good-lightbox__close:hover {
  background: #f4f4f4;
}

@media (max-width: 800px) {
  .wip-good-lightbox {
    padding: 20px;
  }

  .wip-good-lightbox__panel {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(220px, 46vh) auto;
    height: auto;
    max-height: calc(100vh - 40px);
  }

  .wip-good-lightbox__copy {
    padding: 24px 24px 28px;
  }

  .wip-good-lightbox__title {
    font-size: 26px;
  }
}
</style>
