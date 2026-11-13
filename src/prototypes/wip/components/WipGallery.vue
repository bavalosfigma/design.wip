<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { RouterLink } from 'vue-router'
import { wipGalleryItems } from '../data/galleryItems.js'
import WipImageLightbox from './WipImageLightbox.vue'
import WipTypeOn from './motion/WipTypeOn.vue'
import { spring, useWipReducedMotion } from '../composables/useWipMotion.js'

const SCROLL_SPEED = 32

const reduceMotion = useWipReducedMotion()
const activeItem = ref(null)
const origin = ref(null)
const viewportEl = ref(null)
const trackEl = ref(null)
const exploreLink = ref(null)
const copyCount = ref(2)
const copies = computed(() => Array.from({ length: copyCount.value }, (_, copy) => copy))

let resizeObserver

function measure() {
  const viewport = viewportEl.value
  const track = trackEl.value
  const group = track?.querySelector('.wip-gallery__group')
  if (!viewport || !track || !group) return

  const groupWidth = group.offsetWidth
  if (!groupWidth) return

  const needed = Math.max(2, Math.ceil(viewport.offsetWidth / groupWidth) + 1)
  if (needed !== copyCount.value) {
    copyCount.value = needed
    nextTick(measure)
    return
  }

  track.style.setProperty('--wip-marquee-shift', `${groupWidth}px`)
  if (reduceMotion.value) {
    track.style.animation = 'none'
    return
  }
  track.style.animationDuration = `${groupWidth / SCROLL_SPEED}s`
}

function openItem(item, event) {
  const img = event.currentTarget.querySelector('img')
  const rect = img.getBoundingClientRect()
  origin.value = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    objectPosition: getComputedStyle(img).objectPosition,
  }
  activeItem.value = item
}

const markerBind = computed(() => {
  const reveal = { scale: 1, opacity: 1 }
  const hidden = { scale: 0, opacity: 0 }
  if (reduceMotion.value) {
    return { initial: reveal, animate: reveal }
  }
  return {
    initial: hidden,
    whileInView: reveal,
    viewport: { once: true, amount: 0.3 },
    transition: { ...spring, delay: 0.05 },
  }
})

function imgStyle(item) {
  if (!item.objectPosition) return undefined
  return { objectPosition: item.objectPosition }
}

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(measure)
  if (viewportEl.value) resizeObserver.observe(viewportEl.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

defineExpose({ exploreLink })
</script>

<template>
  <section class="wip-gallery" aria-labelledby="wip-gallery-heading">
    <header class="wip-gallery__header">
      <p id="wip-gallery-heading" class="wip-gallery__eyebrow">
        <motion.span class="wip-gallery__marker" aria-hidden="true" v-bind="markerBind" />
        <WipTypeOn
          class="type-editorial-caption"
          text="Recently Added to Canvas"
          :delay="0.08"
          :ms="22"
          nowrap
        />
      </p>
      <RouterLink ref="exploreLink" class="wip-gallery__cta type-body-small" to="/canvas">View canvas</RouterLink>
    </header>

    <div ref="viewportEl" class="wip-gallery__marquee">
      <div ref="trackEl" class="wip-gallery__track">
        <div
          v-for="copy in copies"
          :key="copy"
          class="wip-gallery__group"
          :aria-hidden="copy > 0 ? 'true' : undefined"
        >
          <figure
            v-for="item in wipGalleryItems"
            :key="`${copy}-${item.id}`"
            class="wip-gallery__item"
            :style="{ '--wip-media-height': `${item.mediaHeight}px` }"
          >
            <figcaption class="wip-gallery__caption type-editorial-caption">
              <span class="wip-gallery__caption-mark" aria-hidden="true" />
              {{ item.label }}
            </figcaption>
            <div class="wip-gallery__media">
              <button
                type="button"
                class="wip-gallery__open"
                :aria-label="`View ${item.label}`"
                :tabindex="copy === 0 ? undefined : -1"
                @click="openItem(item, $event)"
              >
                <img
                  :src="item.src"
                  alt=""
                  loading="lazy"
                  :style="imgStyle(item)"
                  :class="{
                    'wip-gallery__img--contain': item.fit === 'contain',
                  }"
                />
              </button>
            </div>
          </figure>
        </div>
      </div>
    </div>

    <WipImageLightbox
      :open="activeItem != null"
      :src="activeItem?.src ?? ''"
      :label="activeItem?.label ?? ''"
      :origin="origin"
      @close="activeItem = null"
    />
  </section>
</template>

<style scoped>
.wip-gallery {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  margin-top: 80px;
}

.wip-gallery__header {
  display: flex;
  grid-column: 1 / -1;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.wip-gallery__eyebrow {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  color: var(--wip-ink-soft);
}

.wip-gallery__marker {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  background: #c7f8fb;
}

.wip-gallery__cta {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 2px 10px;
  color: var(--wip-ink);
  text-decoration: none;
  white-space: nowrap;
  background: #fff;
  border: 1.5px solid var(--wip-ink);
}

.wip-gallery__marquee {
  grid-column: 1 / -1;
  width: calc(100% + 2 * var(--wip-margin));
  margin-top: 20px;
  margin-inline: calc(-1 * var(--wip-margin));
  padding-top: 72px;
  overflow: hidden;
}

.wip-gallery__marquee:hover .wip-gallery__track {
  animation-play-state: paused;
}

.wip-gallery__track {
  display: flex;
  width: max-content;
  animation-name: wip-gallery-marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.wip-gallery__group {
  display: flex;
  flex: none;
  gap: 18px;
  align-items: flex-end;
  padding-right: 18px;
}

.wip-gallery__item {
  position: relative;
  flex: none;
  width: calc(var(--wip-media-height) * 0.78);
  margin: 0;
}

.wip-gallery__item:hover,
.wip-gallery__item:focus-within {
  z-index: 2;
}

.wip-gallery__media {
  position: relative;
  width: 100%;
  height: var(--wip-media-height);
  overflow: hidden;
  transform-origin: bottom center;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.wip-gallery__item:hover .wip-gallery__media,
.wip-gallery__item:focus-within .wip-gallery__media {
  transform: scale(1.06);
}

.wip-gallery__open {
  display: block;
  width: 100%;
  height: 100%;
}

.wip-gallery__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wip-gallery__img--contain {
  object-fit: contain;
}

.wip-gallery__caption {
  position: absolute;
  bottom: calc(100% + 28px);
  left: 0;
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  color: var(--wip-ink);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.wip-gallery__caption-mark {
  flex: none;
  width: 5px;
  height: 5px;
  background: currentColor;
  border-radius: 50%;
}

.wip-gallery__item:hover .wip-gallery__caption,
.wip-gallery__item:focus-within .wip-gallery__caption {
  opacity: 1;
  transform: none;
}

@keyframes wip-gallery-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(-1 * var(--wip-marquee-shift, 0px)), 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wip-gallery__track {
    animation: none;
  }

  .wip-gallery__media,
  .wip-gallery__caption {
    transition: none;
  }
}
</style>
