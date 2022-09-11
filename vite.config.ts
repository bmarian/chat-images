import {name as moduleName} from "./package.json"
import {resolve} from "path"
import {normalizePath, defineConfig} from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

const everyWordToUpperCase = (sentence: string) => sentence
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

export default defineConfig({
  build: {
    watch: {},
    lib: {
      entry: normalizePath(resolve(__dirname, 'src/chat-images.ts')),
      name: everyWordToUpperCase(moduleName),
      fileName: moduleName
    },
    rollupOptions: {
      // @ts-ignore
      output: {
        assetFileNames(assetInfo) {
          return assetInfo.name === 'style.css' ? `${moduleName}.css` : assetInfo.name
        }
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'templates/*',
          dest: 'templates',
        },
        {
          src: 'module.json',
          dest: '',
        }
      ]
    })
  ]
})

