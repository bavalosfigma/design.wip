<script setup>
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import cornerBracket from '../assets/walkthrough/corner-tl.svg'
import WipAnimatedDash from './motion/WipAnimatedDash.vue'
import WipTypeOn from './motion/WipTypeOn.vue'

const props = defineProps({
  title: { type: String, required: true },
  thumb: { type: String, required: true },
  presenter: { type: String, default: 'Gustavo Delgado' },
  thumbTop: { type: Number, default: null },
  hoverRotate: { type: Number, default: -4 },
})

const emit = defineEmits(['open'])
const creditDelay = 0.12
const hoverCapable = ref(true)
const hovered = ref(false)

const thumbSpring = { type: 'spring', stiffness: 391, damping: 50 }

const thumbPose = computed(() => {
  if (!hoverCapable.value || hovered.value) {
    return {
      opacity: 1,
      scale: 1.39,
      rotate: props.hoverRotate,
    }
  }

  return {
    opacity: 0,
    scale: 0.6,
    rotate: props.hoverRotate * 2.42,
  }
})

onMounted(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  hoverCapable.value = canHover && !reduceMotion
})
</script>

<template>
  <article class="wip-walkthrough-card">
    <button
      type="button"
      class="wip-walkthrough-card__link"
      :aria-label="`Play ${title}`"
      @click="emit('open')"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
      @focusin="hovered = true"
      @focusout="hovered = false"
    >
      <div class="wip-walkthrough-card__frame">
        <img class="wip-walkthrough-card__corner wip-walkthrough-card__corner--tl" :src="cornerBracket" alt="" />
        <img
          class="wip-walkthrough-card__corner wip-walkthrough-card__corner--tr"
          :src="cornerBracket"
          alt=""
        />
        <img
          class="wip-walkthrough-card__corner wip-walkthrough-card__corner--br"
          :src="cornerBracket"
          alt=""
        />
        <img
          class="wip-walkthrough-card__corner wip-walkthrough-card__corner--bl"
          :src="cornerBracket"
          alt=""
        />

        <div class="wip-walkthrough-card__shell">
          <WipAnimatedDash class="wip-walkthrough-card__dash wip-walkthrough-card__dash--top" axis="x" trigger="inView" />
          <WipAnimatedDash
            class="wip-walkthrough-card__dash wip-walkthrough-card__dash--right"
            axis="y"
            trigger="inView"
            :delay="0.06"
          />
          <WipAnimatedDash
            class="wip-walkthrough-card__dash wip-walkthrough-card__dash--bottom"
            axis="x"
            trigger="inView"
            :delay="0.12"
          />
          <WipAnimatedDash
            class="wip-walkthrough-card__dash wip-walkthrough-card__dash--left"
            axis="y"
            trigger="inView"
            :delay="0.18"
          />

          <div class="wip-walkthrough-card__panel">
            <h3 class="wip-walkthrough-card__title type-title-medium">{{ title }}</h3>
            <div
              class="wip-walkthrough-card__thumb"
              :class="{ 'wip-walkthrough-card__thumb--fixed': thumbTop != null }"
              :style="thumbTop != null ? { top: `${thumbTop}px` } : undefined"
            >
              <motion.div
                class="wip-walkthrough-card__thumb-motion"
                :initial="false"
                :animate="thumbPose"
                :transition="thumbSpring"
              >
                <img :src="thumb" alt="" loading="lazy" />
              </motion.div>
            </div>
            <p class="wip-walkthrough-card__credit">
              <span class="wip-walkthrough-card__with">
                <WipTypeOn class="type-editorial-caption" text="w/" :delay="creditDelay" :ms="28" nowrap />
              </span>
              <WipTypeOn
                class="wip-walkthrough-card__name type-editorial-caption"
                :text="presenter"
                :delay="creditDelay + 0.12"
                :ms="22"
                nowrap
              />
            </p>
          </div>
        </div>
      </div>
    </button>
  </article>
</template>

<style scoped>
.wip-walkthrough-card {
  flex: 0 0 auto;
  width: 439px;
}

.wip-walkthrough-card__link {
  display: block;
  width: 100%;
  color: inherit;
  text-align: left;
}

.wip-walkthrough-card__frame {
  position: relative;
  width: 439px;
  padding: 24px 31px 24px 30px;
}

.wip-walkthrough-card__corner {
  --wip-print-mark: calc(24px * 8 / 14);
  --wip-print-mark-inset: calc(24px - var(--wip-print-mark));
  position: absolute;
  z-index: 2;
  width: var(--wip-print-mark);
  height: var(--wip-print-mark);
  pointer-events: none;
}

.wip-walkthrough-card__corner--tl {
  top: var(--wip-print-mark-inset);
  left: var(--wip-print-mark-inset);
}

.wip-walkthrough-card__corner--tr {
  top: var(--wip-print-mark-inset);
  right: var(--wip-print-mark-inset);
  transform: scaleX(-1);
}

.wip-walkthrough-card__corner--br {
  right: var(--wip-print-mark-inset);
  bottom: var(--wip-print-mark-inset);
  transform: rotate(180deg);
}

.wip-walkthrough-card__corner--bl {
  bottom: var(--wip-print-mark-inset);
  left: var(--wip-print-mark-inset);
  transform: scaleY(-1);
}

.wip-walkthrough-card__shell {
  position: relative;
  width: 100%;
}

.wip-walkthrough-card__dash {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.wip-walkthrough-card__dash--top,
.wip-walkthrough-card__dash--bottom {
  right: -1px;
  left: -1px;
  width: auto;
}

.wip-walkthrough-card__dash--top {
  top: -1px;
}

.wip-walkthrough-card__dash--bottom {
  bottom: -1px;
}

.wip-walkthrough-card__dash--left,
.wip-walkthrough-card__dash--right {
  top: -1px;
  bottom: -1px;
  height: auto;
}

.wip-walkthrough-card__dash--left {
  left: -1px;
}

.wip-walkthrough-card__dash--right {
  right: -1px;
}

.wip-walkthrough-card__link:hover .wip-walkthrough-card__corner,
.wip-walkthrough-card__link:focus-visible .wip-walkthrough-card__corner,
.wip-walkthrough-card__link:hover .wip-walkthrough-card__dash,
.wip-walkthrough-card__link:focus-visible .wip-walkthrough-card__dash {
  animation: wip-print-flash 0.5s linear;
}

@keyframes wip-print-flash {
  0%,
  100% {
    opacity: 1;
    filter: none;
  }

  16%,
  48% {
    opacity: 0;
  }

  32% {
    opacity: 1;
    filter: contrast(8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wip-walkthrough-card__link:hover .wip-walkthrough-card__corner,
  .wip-walkthrough-card__link:focus-visible .wip-walkthrough-card__corner,
  .wip-walkthrough-card__link:hover .wip-walkthrough-card__dash,
  .wip-walkthrough-card__link:focus-visible .wip-walkthrough-card__dash {
    animation: none;
  }
}

.wip-walkthrough-card__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #e2e2e2;
}

.wip-walkthrough-card__link:hover .wip-walkthrough-card__panel,
.wip-walkthrough-card__link:focus-visible .wip-walkthrough-card__panel {
  background: #c7f8fb;
}

.wip-walkthrough-card__title {
  flex-shrink: 0;
  max-width: 351px;
  margin: 21px 18px 0;
  color: #000;
}

.wip-walkthrough-card__thumb {
  position: relative;
  flex: 0 0 auto;
  align-self: center;
  width: 160px;
  height: 97px;
  margin-block: auto;
}

.wip-walkthrough-card__thumb--fixed {
  position: absolute;
  top: auto;
  left: 50%;
  margin: 0;
  transform: translateX(-50%);
}

.wip-walkthrough-card__thumb-motion {
  width: 100%;
  height: 100%;
  transform-origin: center center;
}

.wip-walkthrough-card__thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
  transition: filter 0.2s ease;
}

.wip-walkthrough-card__link:hover .wip-walkthrough-card__thumb img,
.wip-walkthrough-card__link:focus-visible .wip-walkthrough-card__thumb img {
  filter: none;
}

.wip-walkthrough-card__credit {
  display: flex;
  gap: 4px;
  align-items: center;
  margin: 0 18px 14px;
}

.wip-walkthrough-card__with {
  padding: 2px 4px;
  color: #6b6b6b;
  background: #e4ff97;
}

.wip-walkthrough-card__name {
  color: #000;
  white-space: nowrap;
}
</style>
