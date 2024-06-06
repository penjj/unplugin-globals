import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import globals from '../src'

const fixture = resolve(__dirname, 'fixtures')
const snapshots = resolve(__dirname, '__snapshots__')

it('rollup', async () => {
  const { generate } = await rollup({
    input: [resolve(fixture, 'foo.ts')],
    treeshake: false,
    plugins: [
      esbuild(),
      globals.rollup({
        'vue': 'Vue',
        'vue-router': 'VueRouter',
      }),
    ],
  })
  const { output } = await generate({
    dir: 'fixture',
  })
  expect(output[0].code).toMatchFileSnapshot(
    resolve(snapshots, 'rollup.result'),
  )
})
