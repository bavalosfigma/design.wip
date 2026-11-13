<template>
  <p class="wip-intro-copy type-display-xl">
    Work in progress means we design in public: revise, replace, rethink. Version numbers go up, egos go
    down, the idea gets sharper. Nothing is final, everything is learning.
  </p>
</template>

<style scoped>
.wip-intro-copy {
  margin: 28px 0 0;
  /* Negative leading overflows above the line box. Pad it back so the
     top of the glyphs stays put and size changes grow downward. */
  padding-top: calc((1em - 1lh) / 2);
  color: var(--wip-ink);
}
</style>
