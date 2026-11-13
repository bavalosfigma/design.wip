<script setup>
import { ref, watch } from 'vue'
import WipNav from './WipNav.vue'
import WipAnimatedDash from './motion/WipAnimatedDash.vue'

const visible = defineModel('visible', { type: Boolean, default: false })

const dashDrawKey = ref(0)

watch(visible, (isVisible) => {
  if (isVisible) dashDrawKey.value += 1
})
</script>

<template>
  <header
    class="wip-fixed-nav"
    :class="{ 'wip-fixed-nav--visible': visible }"
    :aria-hidden="!visible"
  >
    <div class="wip-fixed-nav__inner">
      <WipNav :run-type="visible" :queue="false">
        <template #tools><slot name="tools" /></template>
      </WipNav>
    </div>
    <WipAnimatedDash
      v-if="visible"
      :key="dashDrawKey"
      class="wip-fixed-nav__dash"
      axis="x"
      trigger="mount"
      :delay="0.05"
    />
  </header>
</template>

<style scoped>
.wip-fixed-nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 20;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-100%);
  transition:
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear 0.55s;
}

.wip-fixed-nav--visible {
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
  transition:
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear 0s;
}

.wip-fixed-nav__dash {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}

.wip-fixed-nav__inner {
  display: grid;
  grid-template-columns: repeat(var(--wip-columns), minmax(0, 1fr));
  column-gap: var(--wip-gutter);
  max-width: var(--wip-design-width);
  padding: 9px var(--wip-margin) 11px;
  margin-inline: auto;
}
</style>
