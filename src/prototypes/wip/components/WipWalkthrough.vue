<script setup>
import { computed, ref } from 'vue'
import WipEyebrow from './WipEyebrow.vue'
import WipEditable from './WipEditable.vue'
import WipWalkthroughCard from './WipWalkthroughCard.vue'
import WipVideoLightbox from './WipVideoLightbox.vue'
import { wipWalkthroughItems, wipWalkthroughVideoId } from '../data/walkthroughItems.js'

const videoOpen = ref(false)
const videoTitle = ref('')

function openVideo(item) {
  videoTitle.value = item.title
  videoOpen.value = true
}

const headerFont = ref({
  size: 72,
  leading: 85,
  weight: 400,
  width: 100,
  slant: 0,
})

const headerStyle = computed(() => ({
  fontSize: `${headerFont.value.size}px`,
  lineHeight: headerFont.value.leading / 100,
  fontWeight: headerFont.value.weight,
  fontVariationSettings: `'wdth' ${headerFont.value.width}, 'wght' ${headerFont.value.weight}, 'slnt' ${headerFont.value.slant}`,
}))

</script>

<template>
  <section class="wip-walkthrough" aria-labelledby="wip-walkthrough-heading">
    <WipEyebrow index="01" label="Recent walkthroughs" />
    <WipEditable v-model="headerFont" name="Design walkthrough" class="wip-walkthrough__sliders" />
    <h2 id="wip-walkthrough-heading" class="wip-walkthrough__title type-display-xl" :style="headerStyle">
      A design walkthrough is someone on our team opening a favorite project and talking through the
      decisions that made it. We follow the file from the first sketch to the version we still stand behind,
      comments on and nothing treated as final.
    </h2>

    <div class="wip-walkthrough__track" role="list">
      <WipWalkthroughCard
        v-for="item in wipWalkthroughItems"
        :key="item.id"
        v-bind="item"
        @open="openVideo(item)"
      />
    </div>

    <WipVideoLightbox
      :open="videoOpen"
      :title="videoTitle"
      :video-id="wipWalkthroughVideoId"
      @close="videoOpen = false"
    />
  </section>
</template>

<style scoped>
.wip-walkthrough {
  position: relative;
  z-index: 3;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  margin-top: 80px;
}

.wip-walkthrough :deep(.wip-eyebrow) {
  grid-column: 1 / -1;
}

.wip-walkthrough__sliders {
  grid-column: 1 / -1;
  margin-top: 28px;
}

.wip-walkthrough__title {
  grid-column: 1 / -1;
  margin: 34px 0 0;
  color: var(--wip-ink);
}

.wip-walkthrough__track {
  display: flex;
  grid-column: 1 / -1;
  gap: 73px;
  align-items: flex-start;
  width: calc(100% + 2 * var(--wip-margin));
  margin-top: 108px;
  margin-inline: calc(-1 * var(--wip-margin));
  padding-inline: var(--wip-margin);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.wip-walkthrough__track::-webkit-scrollbar {
  display: none;
}
</style>
