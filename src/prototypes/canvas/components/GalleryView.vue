<script setup>
import { motion } from 'motion-v'
import PanStage from './PanStage.vue'
import { galleryItems } from '../data/galleryItems.js'
import { softSpring } from '../motion/tokens.js'

function place(item) {
  return {
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.w}px`,
  }
}
</script>

<template>
  <PanStage>
    <motion.figure
      v-for="item in galleryItems"
      :key="item.id"
      class="shot group"
      :style="place(item)"
      :while-hover="{ scale: 1.02 }"
      :transition="softSpring"
    >
      <div class="media" :style="{ height: `${item.h}px` }">
        <img
          v-if="item.image"
          class="photo"
          :src="item.image"
          alt=""
          draggable="false"
          :style="item.imageStyle"
        />
      </div>
      <figcaption class="type-label-xsmall">
        {{ item.label }}
      </figcaption>
    </motion.figure>
  </PanStage>
</template>

<style scoped>
.shot {
  position: absolute;
  margin: 0;
  pointer-events: auto;
  transform-origin: center center;
}

.media {
  position: relative;
  overflow: hidden;
  background: #d4d4d4;
}

.photo {
  position: absolute;
  max-width: none;
  pointer-events: none;
}

figcaption {
  margin-top: 8px;
  color: #6b6b6b;
}

@media (prefers-reduced-motion: reduce) {
  .shot {
    transform: none !important;
  }
}
</style>
