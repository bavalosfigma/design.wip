<script setup>
import { useId } from 'vue'
import { wipBackgrounds } from '../data/backgrounds.js'

const showGrid = defineModel('showGrid', { type: Boolean, default: true })
const drawing = defineModel('drawing', { type: Boolean, default: false })
const marker = defineModel('marker', { type: String, default: 'maroon' })

const emit = defineEmits(['clear'])

const menuId = useId()
</script>

<template>
  <div class="wip-controls" aria-label="Editor controls">
    <button type="button" class="tool" :aria-pressed="drawing" :aria-controls="menuId" @click="drawing = !drawing">
      <span class="tool-label type-editorial-caption">Draw</span>
      <span class="tool-mark" :class="{ 'tool-mark--on': drawing }" aria-hidden="true" />
    </button>
    <div class="wip-marker-menu" :class="{ 'wip-marker-menu--open': drawing }">
      <div :id="menuId" class="wip-marker-menu__clip" :inert="!drawing" :aria-hidden="!drawing">
        <div class="wip-marker-menu__tools">
          <div class="tool tool--swatches" role="radiogroup" aria-label="Marker color">
            <button
              v-for="swatch in wipBackgrounds"
              :key="swatch.id"
              type="button"
              class="swatch"
              role="radio"
              :aria-checked="marker === swatch.id"
              :aria-label="swatch.label"
              :class="{ 'swatch--active': marker === swatch.id }"
              :style="{ backgroundColor: swatch.color }"
              @click="marker = swatch.id"
            />
          </div>
          <button type="button" class="tool" @click="emit('clear')">
            <span class="tool-label type-editorial-caption">Clear</span>
          </button>
        </div>
      </div>
    </div>
    <button type="button" class="tool" :aria-pressed="showGrid" @click="showGrid = !showGrid">
      <span class="tool-label type-editorial-caption">Grid</span>
      <span class="tool-mark" :class="{ 'tool-mark--on': showGrid }" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.wip-controls {
  display: flex;
  flex-shrink: 0;
  align-items: stretch;
  --wip-ink: #121212;
}

.tool {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #dfdfdf;
  margin-left: -1px;
  background: #fff;
  color: #6b6b6b;
  cursor: pointer;
}

.tool:first-child {
  margin-left: 0;
}

.tool-label {
  color: #6b6b6b;
  white-space: nowrap;
}

.wip-marker-menu {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 0fr;
  min-width: 0;
  transition:
    grid-template-columns 0.22s ease,
    margin-left 0.22s ease;
}

.wip-marker-menu--open {
  grid-template-columns: max-content;
  margin-left: -1px;
}

.wip-marker-menu__clip {
  overflow: hidden;
  min-width: 0;
}

.wip-marker-menu__tools {
  display: flex;
  width: max-content;
}

.tool--swatches {
  gap: 0;
  padding-inline: 10px;
}

.swatch {
  width: 17px;
  height: 17px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.16);
  flex-shrink: 0;
  cursor: pointer;
}

.swatch--active {
  border-color: #0d99ff;
}

.tool-mark {
  width: 16px;
  height: 16px;
  border: 1px solid #000;
  background: #fff;
}

.tool-mark--on {
  background: #000;
}
</style>
