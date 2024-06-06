import type { RollupOutput } from 'rollup'
import { expect, test } from 'vitest'
import { build } from 'vite'
import globals from '../src'
import { resolve } from 'node:path'
import { runScript } from './util'

const fixture = resolve(__dirname, 'fixtures')

test('vite', async () => {
  const result = await build({
    logLevel: 'silent',
    build: {
      write: false,
      minify: false,
      lib: {
        entry: resolve(fixture, 'foo.js'),
        formats: ['es'],
      },
      rollupOptions: {
        treeshake: false,
      },
    },
    plugins: [
      globals.vite({
        'lib-a': 'LibA',
        'lib-b': 'LibB',
      }) as any,
    ],
  })

  expect(runScript((result as RollupOutput[])[0].output[0].code)).toEqual('Hello World')
})
