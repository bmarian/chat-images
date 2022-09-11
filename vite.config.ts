import {name as moduleName} from "./package.json"
import {resolve} from "path"
import {normalizePath, defineConfig} from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

const everyWordToUpperCase = (sentence: string) => sentence
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")

export default defineConfig({
  build: {
    watch: {},
    sourcemap: "inline",
    lib: {
      entry: normalizePath(resolve(__dirname, "src/chat-images.ts")),
      name: everyWordToUpperCase(moduleName),
      fileName: moduleName,
      formats: ["es"],
    },
    rollupOptions: {
      // @ts-ignore
      output: {
        assetFileNames(assetInfo) {
          return assetInfo.name === "style.css" ? `${moduleName}.css` : assetInfo.name
        }
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/templates/*",
          dest: "templates",
        },
        {
          src: "src/languages/*",
          dest: "languages",
        },
        {
          src: "module.json",
          dest: "",
        }
      ]
    })
  ]
})

