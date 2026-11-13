<script setup>
import { computed } from 'vue'
import { useDialTimeline } from 'dialkit/vue'
import { WIP_HERO_MARK_SCALE, brandOutlines } from '../data/brandOutlines.js'
import WipBrandWordmark from './WipBrandWordmark.vue'
import WipTypeOn from './motion/WipTypeOn.vue'

const props = defineProps({
  markColor: {
    type: String,
    default: '',
  },
})

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const LETTER_STAGGER = 0.05
const LETTER_DURATION = 0.56

const WORDMARKS = [
  { id: 'figma', layoutId: 'brand-figma', glyphs: ['F', 'i', 'g', 'm', 'a', 'dot'] },
  { id: 'design', layoutId: 'brand-design', glyphs: ['D', 'e', 's', 'i', 'g', 'n'] },
]

function letterClip(at) {
  return {
    at,
    duration: LETTER_DURATION,
    transition: { type: 'easing', duration: LETTER_DURATION, ease: [0.16, 1, 0.3, 1] },
    from: {
      opacity: [0, 0, 1, 0.01],
      y: [400, -200, 400, 1],
      rotate: [45, -45, 45, 0.1],
    },
    to: {
      opacity: [1, 0, 1, 0.01],
      y: [0, -200, 400, 1],
      rotate: [0, -45, 45, 0.1],
    },
  }
}

function wordmarkTimeline() {
  const clips = {}
  let index = 0
  for (const word of WORDMARKS) {
    const count = brandOutlines[word.layoutId].paths.length
    const glyphs = {}
    for (let glyphIndex = 0; glyphIndex < count; glyphIndex += 1) {
      const key = word.glyphs[glyphIndex] ?? `letter${glyphIndex}`
      glyphs[key] = letterClip(Number((index * LETTER_STAGGER).toFixed(3)))
      index += 1
    }
    clips[word.id] = glyphs
  }
  return {
    duration: Number((LETTER_STAGGER * Math.max(0, index - 1) + LETTER_DURATION).toFixed(2)),
    ...clips,
  }
}

// TODO(production): DialKit's clip.current values are the scrubbable authoring preview.
// Replace them with equivalent real Motion animations using the tuned timeline
// timings and transitions, then remove useDialTimeline and <DialTimeline />.
const timeline = useDialTimeline(
  'Figma.Design',
  wordmarkTimeline(),
  { id: 'figma-design-letters', autoplay: true },
)

const restPose = { opacity: 1, y: 0, rotate: 0 }

function posesFor(word) {
  return computed(() => {
    const count = brandOutlines[word.layoutId].paths.length
    return Array.from({ length: count }, (_, glyphIndex) => {
      if (reduceMotion) return restPose
      const key = word.glyphs[glyphIndex] ?? `letter${glyphIndex}`
      const clip = timeline.value[word.id]?.[key]
      if (!clip?.current || clip.done) return restPose
      return clip.current
    })
  })
}

const figmaPoses = posesFor(WORDMARKS[0])
const designPoses = posesFor(WORDMARKS[1])
</script>

<template>
  <div class="wip-hero">
    <div class="wip-hero__wordmarks" aria-label="Figma.Design">
      <WipBrandWordmark
        layout-id="brand-figma"
        text="Figma."
        :scale="WIP_HERO_MARK_SCALE"
        :letter-poses="figmaPoses"
        :fill="props.markColor"
      />
      <WipBrandWordmark
        layout-id="brand-design"
        text="Design"
        :scale="WIP_HERO_MARK_SCALE"
        :letter-poses="designPoses"
        :fill="props.markColor"
      />
    </div>
    <WipTypeOn
      as="p"
      class="wip-hero__note type-body-large"
      text="Come learn fast and ship thoughtfully with people who care"
      trigger="mount"
      :delay="0.4"
      :ms="28"
    />
  </div>
</template>

<style scoped>
.wip-hero {
  position: relative;
  z-index: 3;
  display: grid;
  align-content: start;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.wip-hero__wordmarks {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 0;
  line-height: 0;
}

.wip-hero__wordmarks :deep(.wip-wordmark + .wip-wordmark) {
  margin-left: 30px;
}

.wip-hero .wip-hero__note {
  display: block;
  grid-column: 7 / 9;
  width: 100%;
  margin: 28px 0 0;
  color: var(--wip-ink);
  text-align: left;
}
</style>
