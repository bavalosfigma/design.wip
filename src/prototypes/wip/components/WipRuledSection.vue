<script setup>
import WipDoubleDash from './WipDoubleDash.vue'
</script>

<template>
  <section class="wip-ruled" aria-label="Ruled section">
    <WipDoubleDash />
    <div class="wip-ruled__body" />
    <WipDoubleDash flush :delay="0.16" />
  </section>
</template>

<style scoped>
.wip-ruled {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.wip-ruled__body {
  grid-column: 1 / -1;
  min-height: 160px;
}
</style>
