import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import globals from '../src'
import { runScript } from './util'

const fixture = resolve(__dirname, 'fixtures')

it('rollup', async () => {
  const { generate } = await rollup({
    input: [resolve(fixture, 'foo.js')],
    treeshake: false,
    plugins: [
      esbuild(),
      globals.rollup({
        'lib-a': 'LibA',
        'lib-b': 'LibB',
      }),
    ],
  })
  const { output } = await generate({
    dir: 'fixture',
  })
  expect(runScript(output[0].code)).toEqual('Hello World')
})
