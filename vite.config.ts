import {name as moduleName, production as isModuleInProductionMode, version as moduleVersion} from './package.json'
import {resolve} from 'path'
import {normalizePath, defineConfig} from 'vite'
import {viteStaticCopy} from 'vite-plugin-static-copy'

const everyWordToUpperCase = (sentence: string) => sentence
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export default defineConfig({
  build: {
    outDir: isModuleInProductionMode? `${moduleName}-${moduleVersion}` : 'dist',
    watch: isModuleInProductionMode ? null : {},
    sourcemap: isModuleInProductionMode ? false : 'inline',
    lib: {
      entry: normalizePath(resolve(__dirname, `src/${moduleName}.ts`)),
      name: everyWordToUpperCase(moduleName),
      fileName: moduleName,
      formats: ['es'],
    },
    rollupOptions: {
      // @ts-ignore
      output: {
        assetFileNames(assetInfo) {
          return assetInfo.name === 'style.css' ? `${moduleName}.css` : assetInfo.name
        },
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/templates/*',
          dest: 'templates',
        },
        {
          src: 'src/languages/*',
          dest: 'languages',
        },
        {
          src: 'module.json',
          dest: '',
        },
      ],
    }),
  ],
})

