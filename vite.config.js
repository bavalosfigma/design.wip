import {
  copyFileSync,
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))
const templatePath = resolve(root, 'index.template.html')
const indexPath = resolve(root, 'index.html')

function sameFile(a, b) {
  if (!existsSync(a) || !existsSync(b)) return false
  return readFileSync(a).equals(readFileSync(b))
}

// Pages serves the main branch root, so the production entry has to be
// index.html at that root. The Vite entry stays in index.template.html.
function publishGithubPages() {
  return {
    name: 'publish-github-pages',
    config(_config, { command }) {
      if (command === 'build' && !sameFile(templatePath, indexPath)) {
        copyFileSync(templatePath, indexPath)
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.server == null || html.includes('/src/main.js')) return html
        return html
          .replace(/<script type="module" crossorigin src="[^"]+"><\/script>\s*/g, '')
          .replace(/<link rel="stylesheet" crossorigin href="[^"]+">\s*/g, '')
          .replace('href="/design.wip/favicon.ico"', 'href="/favicon.ico"')
          .replace(
            '</body>',
            '    <script type="module" src="/src/main.js"></script>\n  </body>',
          )
      },
    },
    closeBundle() {
      const dist = resolve(root, 'dist')
      const distIndex = resolve(dist, 'index.html')
      const distAssets = resolve(dist, 'assets')
      if (!existsSync(distIndex) || !existsSync(distAssets)) return

      const assetsDest = resolve(root, 'assets')
      rmSync(assetsDest, { recursive: true, force: true })
      cpSync(distAssets, assetsDest, { recursive: true })
      copyFileSync(distIndex, indexPath)
      copyFileSync(distIndex, resolve(root, '404.html'))

      const favicon = resolve(dist, 'favicon.ico')
      if (existsSync(favicon)) copyFileSync(favicon, resolve(root, 'favicon.ico'))

      writeFileSync(resolve(root, '.nojekyll'), '')
      rmSync(dist, { recursive: true, force: true })
    },
  }
}

export default defineConfig(({ command }) => ({
  // https://bavalosfigma.github.io/design.wip/
  base: command === 'build' ? '/design.wip/' : '/',
  plugins: [vue(), publishGithubPages()],
  assetsInclude: ['**/*.mov'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
