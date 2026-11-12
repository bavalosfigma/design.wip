<script setup>
import { computed } from 'vue'

const props = defineProps({
  font: {
    type: Object,
    required: true,
  },
})

const style = computed(() => ({
  fontSize: `${props.font.size}px`,
  lineHeight: props.font.leading / 100,
  fontWeight: props.font.weight,
  fontVariationSettings: `'wdth' ${props.font.width}, 'wght' ${props.font.weight}, 'slnt' ${props.font.slant}`,
}))
</script>

<template>
  <p class="wip-intro-copy type-display-xl" :style="style">
    Work in progress means we design in public: revise, replace, rethink. Version numbers go up, egos go
    down, the idea gets sharper. Comments stay on, strikethrough beats delete. Nothing is final, everything is
    learning.
  </p>
</template>

<style scoped>
.wip-intro-copy {
  margin: 9px 0 0;
  /* Negative leading overflows above the line box. Pad it back so the
     top of the glyphs stays put and size changes grow downward. */
  padding-top: calc((1em - 1lh) / 2);
  color: var(--wip-ink);
}
</style>
