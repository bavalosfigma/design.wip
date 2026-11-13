<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { clearWipBrandSelection } from './composables/useWipBrandPathState.js'
import { resetWipTypeQueue } from './composables/useWipTypeQueue.js'
import WipPageFrame from './components/WipPageFrame.vue'
import WipNav from './components/WipNav.vue'
import WipFixedNav from './components/WipFixedNav.vue'
import WipControls from './components/WipControls.vue'
import WipDrawSurface from './components/WipDrawSurface.vue'
import WipHeroWordmark from './components/WipHeroWordmark.vue'
import WipGallery from './components/WipGallery.vue'
import WipEyebrow from './components/WipEyebrow.vue'
import WipEditable from './components/WipEditable.vue'
import WipIntroCopy from './components/WipIntroCopy.vue'
import WipIntroShapes from './components/WipIntroShapes.vue'
import WipDoubleDash from './components/WipDoubleDash.vue'
import WipWalkthrough from './components/WipWalkthrough.vue'
import WipGoodDesign from './components/WipGoodDesign.vue'
import { wipBackgroundById } from './data/backgrounds.js'
import './tokens/layout.css'

resetWipTypeQueue()

const showGrid = ref(false)
const drawing = ref(false)
const marker = ref('maroon')
const introType = ref({ size: 90 })
const headline = ref({
  size: 90,
  leading: 90,
  weight: 700,
  width: 87.5,
  slant: 0,
})
const markColor = '#e2e2e2'
const markerColor = computed(() => wipBackgroundById(marker.value).color)
const pageStyle = computed(() => ({
  '--wip-headline-size': `${headline.value.size}px`,
  '--wip-headline-leading': String(headline.value.leading / 100),
  '--wip-headline-weight': String(headline.value.weight),
  '--wip-headline-width': String(headline.value.width),
  '--wip-headline-slant': String(headline.value.slant),
  '--wip-headline-variation': `'wdth' ${headline.value.width}, 'wght' ${headline.value.weight}, 'slnt' ${headline.value.slant}`,
}))
const showFixedNav = ref(false)
const scrollRoot = ref(null)
const gallery = ref(null)
const drawSurface = ref(null)

function clearDrawing() {
  drawSurface.value?.clear()
}

let navObserver

function onCanvasPointerDown(event) {
  if (event.target.closest('.wip-wordmark')) return
  clearWipBrandSelection()
}

onMounted(() => {
  const explore = gallery.value?.exploreLink?.$el ?? gallery.value?.exploreLink
  if (!scrollRoot.value || !explore) return

  navObserver = new IntersectionObserver(
    ([entry]) => {
      showFixedNav.value = !entry.isIntersecting
    },
    { root: scrollRoot.value, threshold: 0 },
  )
  navObserver.observe(explore)
})

onBeforeUnmount(() => {
  navObserver?.disconnect()
})
</script>

<template>
  <div ref="scrollRoot" class="wip-root" :style="pageStyle">
    <WipDrawSurface ref="drawSurface" :active="drawing" :color="markerColor" />
    <WipFixedNav v-model:visible="showFixedNav">
      <template #tools>
        <WipControls
          v-model:show-grid="showGrid"
          v-model:drawing="drawing"
          v-model:marker="marker"
          @clear="clearDrawing"
        />
      </template>
    </WipFixedNav>
    <div class="wip-canvas" @pointerdown="onCanvasPointerDown">
      <WipPageFrame :show-grid="showGrid" />
      <main class="wip-grid">
        <section class="wip-band wip-band--hero" aria-label="Hero">
          <div class="wip-nav-block">
            <WipNav :show-view-canvas="false">
              <template #tools>
                <WipControls
                  v-model:show-grid="showGrid"
                  v-model:drawing="drawing"
                  v-model:marker="marker"
                  @clear="clearDrawing"
                />
              </template>
            </WipNav>
          </div>
          <WipHeroWordmark :mark-color="markColor" />
          <WipDoubleDash flush />
          <WipGallery ref="gallery" />
          <WipDoubleDash flush :delay="0.16" />
        </section>

        <section
          class="wip-band wip-band--intro"
          aria-label="Introduction"
          :style="{ '--wip-intro-size': `${introType.size}px` }"
        >
          <div class="wip-intro-head">
            <WipEyebrow index="01" label="Introduction" />
            <WipEditable
              class="wip-intro-size"
              v-model="introType"
              name="Font size"
              :keys="['size']"
              readout="end"
            />
          </div>
          <WipIntroCopy />
          <WipIntroShapes />
        </section>

        <section class="wip-band wip-band--walk" aria-label="Walkthroughs">
          <WipWalkthrough />
          <WipDoubleDash flush :delay="0.16" />
        </section>

        <section class="wip-band wip-band--good" aria-label="What is good design?">
          <WipGoodDesign />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.wip-root {
  position: relative;
  height: 100%;
  overflow: auto;
  background: var(--wip-bg);
  color: var(--wip-ink);
}

.wip-root--drawing :deep(*) {
  outline: 1px solid var(--wip-ink);
  outline-offset: -1px;
  pointer-events: none !important;
  color: transparent !important;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px var(--wip-ink);
}

.wip-root--drawing :deep(span),
.wip-root--drawing :deep(svg *),
.wip-root--drawing :deep(.wip-draw),
.wip-root--drawing :deep(.wip-animated-dash),
.wip-root--drawing :deep(.wip-good__rule),
.wip-root--drawing :deep(.wip-good__plus),
.wip-root--drawing :deep(.rule),
.wip-root--drawing :deep(.marker),
.wip-root--drawing :deep(.wip-controls),
.wip-root--drawing :deep(.wip-controls *) {
  outline: none;
}

.wip-root--drawing :deep(.wip-gallery__media *),
.wip-root--drawing :deep(.wip-good__frame *),
.wip-root--drawing :deep(.wip-walkthrough-card__thumb *) {
  outline: none;
}

.wip-root--drawing :deep(.wip-gallery__media),
.wip-root--drawing :deep(.wip-good__frame),
.wip-root--drawing :deep(.wip-walkthrough-card__thumb) {
  outline: 1px dotted var(--wip-ink);
  outline-offset: -1px;
  background: transparent;
}

.wip-root--drawing :deep(.wip-wordmark__handles) {
  display: none;
}

.wip-root--drawing :deep(.wip-wordmark__path) {
  fill: transparent !important;
  stroke: var(--wip-ink) !important;
}

.wip-root--drawing :deep(.wip-walkthrough-card__panel),
.wip-root--drawing :deep(.wip-walkthrough-card__with),
.wip-root--drawing :deep(.wip-eyebrow__label) {
  background: transparent !important;
}

.wip-root--drawing :deep(.wip-gallery__media img),
.wip-root--drawing :deep(.wip-good__photo),
.wip-root--drawing :deep(.wip-walkthrough-card__thumb img) {
  visibility: hidden;
}

.wip-root--drawing :deep(.wip-gallery__track) {
  animation-play-state: paused;
}

.wip-root--drawing :deep(.wip-fixed-nav),
.wip-root--drawing :deep(.wip-nav-block),
.wip-root--drawing :deep(.actions),
.wip-root--drawing :deep(.brand-mark),
.wip-root--drawing :deep(.brand-mark *),
.wip-root--drawing :deep(.btn),
.wip-root--drawing :deep(.btn *),
.wip-root--drawing :deep(.wip-gallery__cta),
.wip-root--drawing :deep(.wip-gallery__cta *) {
  outline: none;
  pointer-events: auto !important;
  -webkit-text-stroke: 0 !important;
}

.wip-root--drawing :deep(.brand-mark),
.wip-root--drawing :deep(.brand-mark *),
.wip-root--drawing :deep(.btn--outline),
.wip-root--drawing :deep(.btn--outline *),
.wip-root--drawing :deep(.wip-gallery__cta),
.wip-root--drawing :deep(.wip-gallery__cta *) {
  color: var(--wip-ink) !important;
  -webkit-text-fill-color: var(--wip-ink);
}

.wip-root--drawing :deep(.btn--solid),
.wip-root--drawing :deep(.btn--solid *) {
  color: #fff !important;
  -webkit-text-fill-color: #fff;
}

.wip-root--drawing :deep(.wip-controls),
.wip-root--drawing :deep(.wip-controls *) {
  pointer-events: auto !important;
  color: #6b6b6b !important;
  -webkit-text-fill-color: #6b6b6b;
  -webkit-text-stroke: 0;
}

.wip-root,
.wip-root :deep(*) {
  font-family: 'Figma Sans VF', sans-serif;
  font-weight: 700;
  font-variation-settings: 'wdth' 87.5, 'wght' 700;
}

.wip-root :deep(.wip-nav .brand-mark),
.wip-root :deep(.wip-nav .brand-mark *) {
  font-weight: 400;
  font-variation-settings: 'wdth' 100, 'wght' 400;
}

.wip-root :deep(.type-display-xl) {
  font-size: var(--wip-headline-size);
  line-height: var(--wip-headline-leading);
  font-weight: var(--wip-headline-weight);
  font-variation-settings: var(--wip-headline-variation);
}

.wip-canvas {
  position: relative;
  width: 100%;
  max-width: var(--wip-design-width);
  min-height: 100%;
  margin-inline: auto;
}

.wip-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(var(--wip-columns), minmax(0, 1fr));
  align-content: start;
  column-gap: var(--wip-gutter);
  row-gap: 0;
  padding-inline: var(--wip-margin);
}

.wip-band {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-content: start;
}

.wip-band--hero {
  height: auto;
  min-height: 0;
  align-content: start;
  padding-bottom: 48px;
}

.wip-band--hero .wip-nav-block {
  align-self: start;
  z-index: 4;
  padding-top: calc(var(--wip-frame-top) + 9px);
}

.wip-band--hero :deep(.wip-hero) {
  align-self: start;
  width: 100%;
  margin-top: 48px;
}

.wip-band--hero :deep(.wip-double-dash) {
  margin-top: 32px;
}

.wip-band--hero :deep(.wip-gallery) {
  margin-top: 24px;
}

.wip-band--intro {
  box-sizing: border-box;
  padding-top: 72px;
  padding-bottom: 24px;
}

.wip-intro-head {
  display: flex;
  grid-column: 1 / -1;
  gap: 28px;
  align-items: center;
}

.wip-intro-size {
  width: 240px;
  z-index: 3;
}

.wip-band--intro :deep(.wip-intro-copy) {
  grid-column: 1 / 7;
  font-size: var(--wip-intro-size);
}

.wip-band--walk {
  padding-top: 40px;
  padding-bottom: 48px;
}

.wip-band--walk :deep(.wip-double-dash) {
  margin-top: 32px;
}

.wip-band--good {
  padding-top: 72px;
  padding-bottom: 72px;
}

.wip-nav-block {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}
</style>
