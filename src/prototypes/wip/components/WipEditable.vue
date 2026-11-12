<script setup>
const font = defineModel({ type: Object, required: true })

defineProps({
  name: { type: String, default: 'Font' },
})

const axes = [
  { key: 'size', label: 'Size', min: 32, max: 160, step: 1, format: (value) => `${value} px` },
  { key: 'leading', label: 'Leading', min: 70, max: 140, step: 1, format: (value) => `${value}%` },
  { key: 'weight', label: 'Weight', min: 300, max: 900, step: 1, format: (value) => `${value}` },
  { key: 'width', label: 'Width', min: 75, max: 100, step: 1, format: (value) => `${value}` },
  { key: 'slant', label: 'Slant', min: -6, max: 0, step: 0.1, format: (value) => `${Number(value.toFixed(1))}` },
]

function fraction(axis) {
  return (font.value[axis.key] - axis.min) / (axis.max - axis.min)
}

function setAxis(key, value) {
  font.value = { ...font.value, [key]: value }
}

function valueFromPointer(axis, slot, clientX) {
  const bounds = slot.getBoundingClientRect()
  const t = bounds.width ? (clientX - bounds.left) / bounds.width : 0
  const clamped = Math.min(1, Math.max(0, t))
  const raw = axis.min + clamped * (axis.max - axis.min)
  const steps = Math.round((raw - axis.min) / axis.step)
  const next = axis.min + steps * axis.step
  return Math.min(axis.max, Math.max(axis.min, Number(next.toFixed(1))))
}

function onPointerDown(event, axis) {
  const slot = event.currentTarget.parentElement
  const thumb = event.currentTarget
  thumb.setPointerCapture(event.pointerId)

  const update = (pointer) => setAxis(axis.key, valueFromPointer(axis, slot, pointer.clientX))
  const stop = () => {
    thumb.removeEventListener('pointermove', update)
    thumb.removeEventListener('pointerup', stop)
    thumb.removeEventListener('pointercancel', stop)
  }

  thumb.addEventListener('pointermove', update)
  thumb.addEventListener('pointerup', stop)
  thumb.addEventListener('pointercancel', stop)
  update(event)
}

function onKeydown(event, axis) {
  const direction = event.key === 'ArrowRight' || event.key === 'ArrowUp'
    ? 1
    : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
      ? -1
      : 0
  if (!direction) return
  event.preventDefault()
  const delta = axis.step * direction * (event.shiftKey ? 10 : 1)
  const next = font.value[axis.key] + delta
  setAxis(axis.key, Math.min(axis.max, Math.max(axis.min, Number(next.toFixed(1)))))
}
</script>

<template>
  <div class="wip-editable" :aria-label="name">
    <div v-for="axis in axes" :key="axis.key" class="wip-editable__slot">
      <span
        class="wip-editable__label type-editorial-caption"
        :style="{
          left: `${fraction(axis) * 100}%`,
          transform: `translateX(${-fraction(axis) * 100}%)`,
        }"
      >
        {{ axis.label }} - {{ axis.format(font[axis.key]) }}
      </span>
      <button
        type="button"
        class="wip-editable__thumb"
        role="slider"
        :aria-label="`${name} ${axis.label}`"
        :aria-valuemin="axis.min"
        :aria-valuemax="axis.max"
        :aria-valuenow="font[axis.key]"
        :aria-valuetext="`${axis.label} - ${axis.format(font[axis.key])}`"
        :style="{ left: `${fraction(axis) * 100}%` }"
        @pointerdown.stop="onPointerDown($event, axis)"
        @keydown="onKeydown($event, axis)"
      />
    </div>
  </div>
</template>

<style scoped>
.wip-editable {
  display: flex;
  gap: 32px;
  height: 36px;
  user-select: none;
  touch-action: none;
}

.wip-editable__slot {
  position: relative;
  flex: 1;
  height: 36px;
}

.wip-editable__slot::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 4px;
  left: 0;
  height: 1px;
  background: var(--wip-ink);
}

.wip-editable__thumb {
  position: absolute;
  bottom: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
  cursor: ew-resize;
}

.wip-editable__thumb::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 8px;
  height: 8px;
  background: var(--wip-ink);
  border-radius: 50%;
  transform: translateX(-50%);
}

.wip-editable__thumb:focus-visible {
  outline: 1px solid var(--wip-ink);
  outline-offset: 2px;
}

.wip-editable__label {
  position: absolute;
  bottom: 14px;
  color: var(--wip-ink);
  white-space: nowrap;
  pointer-events: none;
}
</style>
