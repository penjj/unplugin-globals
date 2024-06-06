import { resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { expect, it } from 'vitest'
import { build } from 'esbuild'
import globals from '../src/esbuild'
import { runScript } from './util'

const fixture = resolve(__dirname, 'fixtures')

it('esbuild', async () => {
  const { outputFiles } = await build({
    entryPoints: [resolve(fixture, 'foo.js')],
    write: false,
    bundle: true,
    format: 'esm',
    plugins: [
      globals({
        'lib-a': 'LibA',
        'lib-b': 'LibB',
      }),
    ],
  })
  const [{ contents }] = outputFiles!
  expect(runScript(Buffer.from(contents.buffer).toString())).toEqual(
    'Hello World',
  )
})
