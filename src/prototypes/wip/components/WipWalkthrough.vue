<script setup>
import { ref } from 'vue'
import WipEyebrow from './WipEyebrow.vue'
import WipWalkthroughCard from './WipWalkthroughCard.vue'
import WipVideoLightbox from './WipVideoLightbox.vue'
import { wipWalkthroughItems, wipWalkthroughVideoId } from '../data/walkthroughItems.js'

const videoOpen = ref(false)
const videoTitle = ref('')

function openVideo(item) {
  videoTitle.value = item.title
  videoOpen.value = true
}
</script>

<template>
  <section class="wip-walkthrough" aria-label="Recent walkthroughs">
    <WipEyebrow index="02" label="Recent walkthroughs" />
    <p class="wip-walkthrough__blurb type-body-small">
      Designer walkthroughs of their favorite projects. They open the file and talk through what stayed, what
      got cut, and the version that finally felt right.
    </p>

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
  margin-top: 0;
  row-gap: 40px;
}

.wip-walkthrough :deep(.wip-eyebrow) {
  grid-column: 1 / 7;
  align-self: start;
}

.wip-walkthrough__blurb {
  grid-column: 7 / -1;
  align-self: start;
  margin: 0;
  color: var(--wip-ink);
}

.wip-walkthrough__track {
  display: flex;
  grid-column: 1 / -1;
  gap: 73px;
  align-items: flex-start;
  width: calc(100% + 2 * var(--wip-margin));
  margin-top: 0;
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
