import {defineConfig} from 'vite'
import path from 'path'
import {readFileSync, writeFileSync, mkdirSync} from 'fs'

function copyCss() {
  return {
    name: 'copy-css',
    closeBundle() {
      const src = path.resolve(__dirname, 'src/styles/emotion-scroll.css')
      const dest = path.resolve(__dirname, 'dist/emotion-scroll.css')
      mkdirSync(path.dirname(dest), {recursive: true})
      writeFileSync(dest, readFileSync(src))
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@emotion-agency/emotion-scroll',
      fileName: format => `index.${format}.js`,
    },
    outDir: 'dist',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        globals: {
          // external deps you want to exclude from the bundle
          'tiny-emitter': 'TinyEmitter',
          'virtual-scroll': 'VirtualScroll',
          '@emotionagency/utils': 'EmotionUtils',
          'ssr-window': 'SsrWindow',
        },
      },
      external: ['tiny-emitter', 'virtual-scroll', '@emotionagency/utils', 'ssr-window'],
    },
    emptyOutDir: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [copyCss()],
})
