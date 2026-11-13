<script setup>
import { RouterLink } from 'vue-router'
import WipTypeOn from './motion/WipTypeOn.vue'

defineProps({
  runType: { type: Boolean, default: true },
  queue: { type: Boolean, default: true },
  showViewCanvas: { type: Boolean, default: true },
})
</script>

<template>
  <nav class="wip-nav" aria-label="Site">
    <span class="brand-mark brand-mark--figma type-wordmark">
      <WipTypeOn text="Figma" trigger="mount" :queue="queue" :run="runType" :ms="32" nowrap />
    </span>
    <span class="brand-mark brand-mark--design type-wordmark">
      <WipTypeOn text="Design" trigger="mount" :queue="queue" :run="runType" :ms="32" nowrap />
    </span>

    <div class="actions">
      <slot name="tools" />
      <RouterLink v-if="showViewCanvas" class="btn btn--outline type-body-small" to="/canvas">View Canvas</RouterLink>
      <a class="btn btn--solid type-body-small" href="https://www.figma.com/careers/" target="_blank" rel="noreferrer">
        Apply now
      </a>
    </div>
  </nav>
</template>

<style scoped>
.wip-nav {
  display: contents;
}

.brand-mark {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  padding: 0 12px 0 3px;
  font-size: 24px;
  line-height: 0.85;
  letter-spacing: -0.035em;
  background: #c7f8fb;
  box-sizing: border-box;
}

.brand-mark--figma {
  grid-column: 1;
  align-self: start;
}

.brand-mark--design {
  grid-column: 2;
  align-self: start;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  grid-column: 7 / -1;
  align-self: start;
  justify-self: end;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 2px 10px;
  text-decoration: none;
  white-space: nowrap;
}

.btn--outline {
  border: 1.5px solid var(--wip-ink);
  color: var(--wip-ink);
  background: #fff;
}

.btn--solid {
  border: none;
  background: #000;
  color: #fff;
}
</style>
