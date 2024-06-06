import type { RollupOutput } from 'rollup'
import { expect, test } from 'vitest'
import { build } from 'vite'
import globals from '../src'
import { resolve } from 'node:path'

const fixture = resolve(__dirname, 'fixtures')
const snapshots = resolve(__dirname, '__snapshots__')

test('vite', async () => {
  const result = await build({
    logLevel: 'silent',
    build: {
      minify: false,
      lib: {
        entry: resolve(fixture, 'foo.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        treeshake: false,
      },
    },
    plugins: [
      globals.vite({
        vue: 'Vue',
        'vue-router': 'VueRouter',
      }) as any,
    ],
  })

  expect((result as RollupOutput[])[0].output[0].code).toMatchFileSnapshot(
    resolve(snapshots, 'vite.result')
  )
})
