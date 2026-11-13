import { createRouter, createWebHistory } from 'vue-router'
import GalleryApp from './prototypes/canvas/CanvasApp.vue'
import WipApp from './prototypes/wip/WipApp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'wip', component: WipApp },
    { path: '/wip', redirect: '/' },
    { path: '/canvas', name: 'gallery', component: GalleryApp },
    { path: '/wip-01', redirect: '/' },
  ],
})

export default router
