<script setup>
import { computed, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import WipEyebrow from './WipEyebrow.vue'
import WipAnimatedDash from './motion/WipAnimatedDash.vue'
import WipGoodLightbox from './WipGoodLightbox.vue'
import { useWipReducedMotion } from '../composables/useWipMotion.js'
import object01 from '../assets/good-design/01.jpg'
import object02 from '../assets/good-design/02.jpg'
import object03 from '../assets/good-design/03.png'
import object04 from '../assets/good-design/04.jpg'
import object05 from '../assets/good-design/05.jpg'
import object06 from '../assets/good-design/06.png'
import object07 from '../assets/good-design/07.png'
import object08 from '../assets/good-design/08.jpg'
import object09 from '../assets/good-design/09.png'
import object10 from '../assets/good-design/10.png'
import object11 from '../assets/good-design/11.jpg'
import object12 from '../assets/good-design/12.jpg'

const objects = [
  {
    src: object01,
    alt: 'Wood headboard with a gridded panel',
    title: 'Gridded headboard',
    by: 'Mira Chen',
    quote: 'The lines are strict, but the grain never agrees to stop. That argument is why I keep looking at it.',
  },
  {
    src: object02,
    alt: 'Dieter Rams lounge chair',
    title: '620 lounge chair',
    by: 'Jonah Ellison',
    quote: 'The shell is a simple box and the leather does all the living. Nothing here is trying to be more than a chair.',
  },
  {
    src: object03,
    alt: 'La Marzocco espresso machine in a wavy steel frame',
    title: 'Wavy La Marzocco',
    by: 'Adele Voss',
    quote: 'The machine is all precision, and then the steel around it decides to ripple. I love that the frame got the last word.',
  },
  {
    src: object04,
    alt: 'Brushed steel ashtray',
    title: 'Steel ashtray',
    by: 'Chris Navarro',
    quote: 'One cut in the rim, and the cigarette has a place to rest. The whole object is that single decision.',
  },
  {
    src: object05,
    alt: 'Brushed steel cabinet',
    title: 'Brushed steel cabinet',
    by: 'Priya Shah',
    quote: 'The door is a sheet of metal and a black dot. I like how little it needs to feel finished.',
  },
  {
    src: object06,
    alt: 'Side table made from a car taillight',
    title: 'Taillight side table',
    by: 'Evan Cho',
    quote: 'It used to tell you to stop. Now it holds a book. I like an object that can change jobs without hiding what it was.',
  },
  {
    src: object07,
    alt: 'Smoked acrylic rolling cart',
    title: 'Smoked acrylic cart',
    by: 'Lila Moreau',
    quote: 'You can see through it and still not quite see it. The shelves seem to float, and the wheels mean it never has to stay.',
  },
  {
    src: object08,
    alt: 'Suspended pale rubber form',
    title: 'Suspended rubber form',
    by: 'Samir Haddad',
    quote: 'It only holds its shape because something is pulling. I like a form that admits it would collapse without the wires.',
  },
  {
    src: object09,
    alt: 'Plywood wall shelf with books',
    title: 'Plywood shelf',
    by: 'Nora Blake',
    quote: 'The edge of the plywood is the whole ornament. The books sit there like they were always part of the drawing.',
  },
  {
    src: object10,
    alt: 'Oak table and chair',
    title: 'Oak table and chair',
    by: 'Theo Park',
    quote: 'Bolts, a metal strap, oak that still looks like a plank. I trust it because I can see exactly how it stands up.',
  },
  {
    src: object11,
    alt: 'Solid wood chair',
    title: 'Plank chair',
    by: 'June Okonkwo',
    quote: 'Four pieces of wood, and every joint is in plain sight. It feels honest in a way a carved chair never does.',
  },
  {
    src: object12,
    alt: 'Canvas pendant lamp',
    title: 'Canvas pendant',
    by: 'Rafael Silva',
    quote: 'Cloth pulled over a square, and the wrinkles are the shade. I like that the light has to pass through something soft.',
  },
]

const fonts = [
  {
    id: 'figma-sans',
    label: 'Figma Sans',
    family: '"Figma Sans VF", sans-serif',
    tracking: '-0.035em',
    variable: true,
  },
  {
    id: 'instrument-sans',
    label: 'Instrument Sans',
    family: '"Instrument Sans", sans-serif',
    tracking: '-0.03em',
  },
  {
    id: 'newsreader',
    label: 'Newsreader',
    family: '"Newsreader", serif',
    tracking: '-0.02em',
  },
  {
    id: 'fraunces',
    label: 'Fraunces',
    family: '"Fraunces", serif',
    tracking: '-0.025em',
  },
  {
    id: 'ibm-plex-mono',
    label: 'IBM Plex Mono',
    family: '"IBM Plex Mono", ui-monospace, monospace',
    tracking: '-0.02em',
  },
]

const fontHref =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Instrument+Sans:wght@400..700&family=Newsreader:opsz,wght@6..72,200..800&display=swap'

function loadGoodFonts() {
  if (document.getElementById('wip-good-fonts')) return
  for (const href of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = href
    if (href.includes('gstatic')) preconnect.crossOrigin = 'anonymous'
    document.head.appendChild(preconnect)
  }
  const link = document.createElement('link')
  link.id = 'wip-good-fonts'
  link.rel = 'stylesheet'
  link.href = fontHref
  document.head.appendChild(link)
}

loadGoodFonts()

const fontId = ref(fonts[0].id)
const activeFont = computed(() => fonts.find((face) => face.id === fontId.value) ?? fonts[0])
const reduceMotion = useWipReducedMotion()
const copyStyle = computed(() => {
  const face = activeFont.value
  const style = {
    fontFamily: face.family,
    letterSpacing: face.tracking,
  }
  if (!face.variable) style.fontVariationSettings = 'normal'
  return style
})
const copyEnter = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.55em' }))
const copyExit = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: '-0.4em' }))
const copyTransition = computed(() =>
  reduceMotion.value ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
)

const active = ref(null)
const opener = ref(null)

function openObject(object, index, event) {
  opener.value = event.currentTarget
  active.value = {
    ...object,
    index: String(index + 1).padStart(2, '0'),
  }
}

function closeObject() {
  active.value = null
  opener.value?.focus()
}

const verticals = [
  { id: 'v1', column: '1', justify: 'start', shift: '-50%' },
  { id: 'v2', column: '2', justify: 'end', shift: 'calc(50% + var(--wip-gutter) / 2)' },
  { id: 'v3', column: '4', justify: 'end', shift: 'calc(50% + var(--wip-gutter) / 2)' },
  { id: 'v4', column: '6', justify: 'end', shift: 'calc(50% + var(--wip-gutter) / 2)' },
  { id: 'v5', column: '8', justify: 'end', shift: '50%' },
]

const horizontals = [
  { id: 'h1', row: '1', align: 'start', shift: '-50%' },
  { id: 'h2', row: '1', align: 'end', shift: '50%' },
  { id: 'h3', row: '2', align: 'end', shift: '50%' },
  { id: 'h4', row: '3', align: 'end', shift: '50%' },
]

const innerVerticals = verticals.filter((line) => line.id !== 'v1' && line.id !== 'v5')

const pluses = verticals.flatMap((vertical) =>
  horizontals.map((horizontal) => ({
    id: `${vertical.id}-${horizontal.id}`,
    column: vertical.column,
    justify: vertical.justify,
    row: horizontal.row,
    align: horizontal.align,
    transform: `translate(${vertical.shift}, ${horizontal.shift})`,
  })),
)
</script>

<template>
  <div class="wip-good">
    <div class="wip-good__head">
      <WipEyebrow index="03" label="What is good design?" />
      <label class="wip-good__font">
        <select v-model="fontId" class="wip-good__select type-editorial-caption" aria-label="Typeface">
          <option v-for="face in fonts" :key="face.id" :value="face.id">
            {{ face.label }}
          </option>
        </select>
        <span class="wip-good__chev" aria-hidden="true" />
      </label>
    </div>
    <div class="wip-good__copy-clip">
      <AnimatePresence mode="wait" :initial="false">
        <motion.p
          :key="activeFont.id"
          class="wip-good__copy type-display-xl"
          :style="copyStyle"
          :initial="copyEnter"
          :animate="{ opacity: 1, y: 0 }"
          :exit="copyExit"
          :transition="copyTransition"
        >
          Good design makes the next decision easier to see. It stays clear while the work is still changing, and
          it leaves a trace the next person can pick up.
        </motion.p>
      </AnimatePresence>
    </div>

    <div class="wip-good__grid">
      <button
        v-for="(object, index) in objects"
        :key="object.src"
        type="button"
        class="wip-good__cell"
        :aria-label="`View ${object.title}`"
        :style="{
          gridColumn: `${(index % 4) * 2 + 1} / span 2`,
          gridRow: Math.floor(index / 4) + 1,
        }"
        @click="openObject(object, index, $event)"
      >
        <p class="wip-good__index type-editorial-caption">({{ String(index + 1).padStart(2, '0') }})</p>
        <div class="wip-good__frame">
          <div class="wip-good__clip">
            <img class="wip-good__photo" :src="object.src" :alt="object.alt" />
          </div>
        </div>
      </button>

      <WipAnimatedDash
        v-for="(line, index) in innerVerticals"
        :key="line.id"
        class="wip-good__rule wip-good__rule--y"
        axis="y"
        :delay="0.05 * index"
        :style="{
          gridColumn: line.column,
          justifySelf: line.justify,
          transform: `translateX(${line.shift})`,
        }"
      />
      <WipAnimatedDash
        v-for="(line, index) in horizontals"
        :key="line.id"
        class="wip-good__rule wip-good__rule--x"
        axis="x"
        :delay="0.05 * index"
        :style="{
          gridRow: line.row,
          alignSelf: line.align,
          transform: `translateY(${line.shift})`,
        }"
      />

      <span
        v-for="plus in pluses"
        :key="plus.id"
        class="wip-good__plus"
        :style="{
          gridColumn: plus.column,
          justifySelf: plus.justify,
          gridRow: plus.row,
          alignSelf: plus.align,
          transform: plus.transform,
        }"
      />
    </div>

    <WipGoodLightbox
      :open="active != null"
      :src="active?.src ?? ''"
      :index="active?.index ?? ''"
      :title="active?.title ?? ''"
      :by="active?.by ?? ''"
      :quote="active?.quote ?? ''"
      @close="closeObject"
    />
  </div>
</template>

<style scoped>
.wip-good {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-content: start;
  row-gap: 28px;
}

.wip-good__head {
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  gap: 12px;
}

.wip-good__font {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--wip-ink) 16%, transparent);
  background: var(--wip-bg);
  color: var(--wip-ink-soft);
  cursor: pointer;
}

.wip-good__font:focus-within {
  border-color: var(--wip-ink);
}

.wip-good__select {
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
  appearance: none;
}

.wip-good__select:focus {
  outline: none;
}

.wip-good__chev {
  width: 10px;
  height: 5px;
  background: linear-gradient(to bottom, currentColor 0 40%, transparent 40% 60%, currentColor 60% 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  opacity: 0.55;
  flex-shrink: 0;
}

.wip-good__copy-clip {
  grid-column: 1 / 7;
  overflow: hidden;
  margin-bottom: calc(var(--wip-headline-size) * -0.22);
  padding-bottom: calc(var(--wip-headline-size) * 0.22);
}

.wip-good__copy {
  margin: 0;
  padding-top: calc((1em - 1lh) / 2);
  color: var(--wip-ink);
}

.wip-good__grid {
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  grid-template-rows: repeat(3, minmax(0, auto));
  margin-top: 20px;
}

.wip-good__cell {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
}

.wip-good__cell:focus-visible {
  outline: 1.5px solid var(--wip-ink);
  outline-offset: -1.5px;
}

.wip-good__index {
  position: absolute;
  z-index: 1;
  top: 14px;
  left: 16px;
  margin: 0;
  color: var(--wip-ink-soft);
}

.wip-good__frame {
  display: grid;
  width: 52%;
  height: 58%;
  justify-self: center;
  align-self: center;
  min-width: 0;
  min-height: 0;
}

.wip-good__clip {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.wip-good__photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.wip-good__cell:hover .wip-good__photo {
  transform: scale(1.25);
}

@media (prefers-reduced-motion: reduce) {
  .wip-good__photo {
    transition: none;
  }
}

.wip-good__rule {
  z-index: 2;
  pointer-events: none;
}

.wip-good__grid > .wip-good__rule--y {
  grid-row: 1 / -1;
  align-self: stretch;
  width: 1px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    var(--wip-rule-dash) 0 var(--wip-dash-on),
    transparent var(--wip-dash-on) calc(var(--wip-dash-on) + var(--wip-dash-gap))
  );
  background-size: 1px calc(var(--wip-dash-on) + var(--wip-dash-gap));
}

.wip-good__grid > .wip-good__rule--x {
  grid-column: 1 / -1;
  width: auto;
  height: 1px;
}

.wip-good__plus {
  z-index: 3;
  width: 9px;
  height: 9px;
  pointer-events: none;
}

.wip-good__plus::before,
.wip-good__plus::after {
  content: '';
  position: absolute;
  background: var(--wip-rule-dash);
}

.wip-good__plus::before {
  top: 50%;
  right: 0;
  left: 0;
  height: 1px;
  transform: translateY(-50%);
}

.wip-good__plus::after {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
}
</style>
