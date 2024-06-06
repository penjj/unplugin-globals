# unplugin-globals

[![NPM version](https://img.shields.io/npm/v/unplugin-globals?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-globals)

Transform external imports into global variables for `vite`、`rollup`、`esbuild`、`webpack` and other bundlers.

## Install
```bash
pnpm i unplugin-globals -D
yarn add unplugin-globals -D
npm i unplugin-globals -D
```

## Usage with webpack
```ts
// webpack.config.js
import Globals from 'unplugin-globals/webpack'

export default {
  plugins: [
    Globals({
      vue: 'Vue'
    })
  ]
}
```

## Usage with rollup
```ts
import { rollup } from 'rollup'
import Globals from 'unplugin-globals/rollup'

rollup({
  plugins: [
    globals({
      vue: 'Vue'
    })
  ]
})
```

## Usage with vite
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Globals from 'unplugin-globals/vite'

export default defineConfig({
  plugins: [
    Globals({
      vue: 'Vue'
    })
  ]
})
```

## Usage with esbuild
```ts
import { build } from 'esbuild'
import Globals from 'unplugin-globals/esbuild'

build({
  plugins: [
    Globals({
      vue: 'Vue'
    })
  ]
})
