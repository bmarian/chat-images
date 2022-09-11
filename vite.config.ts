import {name} from "./package.json"
import {resolve} from 'path'
import {defineConfig} from 'vite'

const everyWordToUpperCase = (sentence: string) => sentence
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/chat-images.ts'),
      name: everyWordToUpperCase(name),
      fileName: name
    },
    rollupOptions: {
      output: {
        assetFileNames(assetInfo) {
          const {name: assetName} = assetInfo
          if (assetName !== 'style.css') return assetName

          return `${name}.css`
        }
      }
    },
    watch: {}
  }
})

