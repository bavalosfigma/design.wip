<script setup>
import { motion } from 'motion-v'
import WipBrandWordmark from './WipBrandWordmark.vue'
import { wipViewport } from '../composables/useWipMotion.js'

const fill = '#e3e3e3'
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const shapes = [
  { id: 'circles', layoutId: 'shape-circles', text: 'Circle cluster', delay: 0, rotate: 14 },
  { id: 'asterisk', layoutId: 'shape-asterisk', text: 'Asterisk', delay: 0.08, rotate: -12 },
  { id: 'planes', layoutId: 'shape-planes', text: 'Planes', delay: 0.14, rotate: 16 },
  { id: 'wave', layoutId: 'shape-wave', text: 'Wave', delay: 0.22, rotate: -8 },
]

const rest = { opacity: 1, y: 0, rotate: 0 }

function enter(shape) {
  if (reduceMotion) return { initial: rest, animate: rest }
  return {
    initial: { opacity: 0, y: 160, rotate: shape.rotate },
    whileInView: rest,
    viewport: wipViewport,
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1],
      delay: shape.delay,
    },
  }
}
</script>

<template>
  <div class="wip-intro-shapes" aria-label="Shapes">
    <motion.div
      v-for="shape in shapes"
      :key="shape.id"
      class="shape"
      :class="`shape--${shape.id}`"
      v-bind="enter(shape)"
    >
      <WipBrandWordmark :layout-id="shape.layoutId" :text="shape.text" :scale="1" :fill="fill" />
    </motion.div>
  </div>
</template>

<style scoped>
.wip-intro-shapes {
  position: relative;
  grid-column: 1 / -1;
  margin-top: 28px;
  aspect-ratio: 1024 / 460;
}

.shape {
  position: absolute;
  transform-origin: center center;
}

.shape :deep(.wip-wordmark) {
  width: 100%;
}

.shape :deep(.wip-wordmark__svg) {
  width: 100%;
  height: auto;
}

.shape--circles {
  z-index: 1;
  top: 6.3%;
  left: 1.3%;
  width: 40.3%;
}

.shape--asterisk {
  z-index: 3;
  top: 2.4%;
  left: 42.6%;
  width: 22.9%;
}

.shape--planes {
  z-index: 4;
  top: 3.5%;
  left: 68.1%;
  width: 26.4%;
}

.shape--wave {
  z-index: 2;
  top: 55.2%;
  left: 41.6%;
  width: 54.5%;
}
</style>
