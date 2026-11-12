<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Walkthrough' },
  videoId: { type: String, required: true },
})

const emit = defineEmits(['close'])

const src = computed(
  () => `https://www.youtube.com/embed/${props.videoId}?autoplay=1&rel=0`,
)

function close() {
  emit('close')
}

function onKeydown(event) {
  if (props.open && event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="open"
        class="wip-video-lightbox"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.3 }"
        @click.self="close"
      >
        <button type="button" class="wip-video-lightbox__close" aria-label="Close" @click="close">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>

        <motion.div
          class="wip-video-lightbox__player"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          :initial="{ opacity: 0, y: 60, scale: 1.04 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, y: 32, scale: 1.02 }"
          :transition="{ duration: 0.35 }"
        >
          <iframe
            class="wip-video-lightbox__frame"
            :src="src"
            :title="title"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<style scoped>
.wip-video-lightbox {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 72px 48px;
  background: #fff;
}

.wip-video-lightbox__player {
  width: min(1200px, 100%, calc((100vh - 144px) * 16 / 9));
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 24px;
  background: #bdbdbd;
}

.wip-video-lightbox__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.wip-video-lightbox__close {
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
  box-shadow: 0 1px 4px rgba(18, 18, 18, 0.16);
}

.wip-video-lightbox__close:hover {
  background: #f4f4f4;
}

@media (max-width: 700px) {
  .wip-video-lightbox {
    padding: 72px 20px;
  }

  .wip-video-lightbox__player {
    border-radius: 16px;
  }
}
</style>
