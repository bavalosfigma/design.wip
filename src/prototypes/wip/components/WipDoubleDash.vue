<script setup>
import WipAnimatedDash from './motion/WipAnimatedDash.vue'

defineProps({
  delay: { type: Number, default: 0 },
  flush: { type: Boolean, default: false },
})
</script>

<template>
  <div class="wip-double-dash" :class="{ 'wip-double-dash--flush': flush }" aria-hidden="true">
    <WipAnimatedDash class="wip-double-dash__line" axis="x" trigger="inView" :delay="delay" />
    <WipAnimatedDash class="wip-double-dash__line" axis="x" trigger="inView" :delay="delay + 0.1" />
  </div>
</template>

<style scoped>
.wip-double-dash {
  display: flex;
  flex-direction: column;
  grid-column: 1 / -1;
  gap: 14px;
  width: calc(100% + 2 * var(--wip-margin));
  height: 16px;
  margin-top: 80px;
  margin-inline: calc(-1 * var(--wip-margin));
  padding: 0;
}

.wip-double-dash--flush {
  margin-top: 0;
}

.wip-double-dash__line {
  flex-shrink: 0;
}
</style>
