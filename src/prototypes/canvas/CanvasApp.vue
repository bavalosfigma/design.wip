<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GalleryView from './components/GalleryView.vue'

const router = useRouter()

function close() {
  router.push('/')
}

function onKey(event) {
  if (event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="gallery-app">
    <GalleryView />
    <button type="button" class="close" aria-label="Close canvas" @click="close">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.gallery-app {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #fff;
  font-family: 'Figma Mono VF', ui-monospace, monospace;
  font-variation-settings: normal;
}

.gallery-app :deep(*) {
  font-family: 'Figma Mono VF', ui-monospace, monospace;
  font-variation-settings: normal;
}

.close {
  position: absolute;
  z-index: 5;
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

.close:hover {
  background: #f4f4f4;
}
</style>
