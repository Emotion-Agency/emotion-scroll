import {defineConfig} from 'vite'
import path from 'path'

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
        },
      },
      external: ['tiny-emitter', 'virtual-scroll', '@emotionagency/utils'],
    },
    emptyOutDir: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
})
