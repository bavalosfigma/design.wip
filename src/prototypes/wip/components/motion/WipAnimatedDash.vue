<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { useWipReducedMotion, wipViewport } from '../../composables/useWipMotion.js'

const props = defineProps({
  axis: {
    type: String,
    default: 'x',
    validator: (value) => value === 'x' || value === 'y',
  },
  delay: { type: Number, default: 0 },
  /** mount = on load; inView = when scrolled into view */
  trigger: {
    type: String,
    default: 'inView',
    validator: (value) => value === 'mount' || value === 'inView',
  },
})

const reduceMotion = useWipReducedMotion()

const drawFrom = computed(() =>
  props.axis === 'x'
    ? { clipPath: 'inset(0 100% 0 0)' }
    : { clipPath: 'inset(0 0 100% 0)' },
)
const drawTo = { clipPath: 'inset(0 0 0 0)' }

const transition = computed(() => ({
  duration: 1.2,
  ease: [0.65, 0, 0.35, 1],
  delay: props.delay,
}))

const bind = computed(() => {
  if (reduceMotion.value) {
    return { initial: drawTo, animate: drawTo }
  }

  if (props.trigger === 'mount') {
    return {
      initial: drawFrom.value,
      animate: drawTo,
      transition: transition.value,
    }
  }

  return {
    initial: drawFrom.value,
    whileInView: drawTo,
    viewport: wipViewport,
    transition: transition.value,
  }
})
</script>

<template>
  <motion.span
    class="wip-animated-dash"
    :class="`wip-animated-dash--${axis}`"
    v-bind="bind"
    aria-hidden="true"
  />
</template>

<style scoped>
.wip-animated-dash {
  display: block;
}

.wip-animated-dash--x {
  width: 100%;
  height: 1px;
  clip-path: inset(0 100% 0 0);
  background: repeating-linear-gradient(
    to right,
    var(--wip-rule-dash) 0 var(--wip-dash-on),
    transparent var(--wip-dash-on) calc(var(--wip-dash-on) + var(--wip-dash-gap))
  );
  background-size: calc(var(--wip-dash-on) + var(--wip-dash-gap)) 1px;
}

.wip-animated-dash--y {
  width: 1px;
  height: 100%;
  clip-path: inset(0 0 100% 0);
  background: repeating-linear-gradient(
    to bottom,
    var(--wip-rule-dash) 0 var(--wip-dash-on),
    transparent var(--wip-dash-on) calc(var(--wip-dash-on) + var(--wip-dash-gap))
  );
  background-size: 1px calc(var(--wip-dash-on) + var(--wip-dash-gap));
}
</style>
