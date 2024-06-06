import { resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { expect, it } from 'vitest'
import { build } from 'esbuild'
import globals from '../src/esbuild'

const fixture = resolve(__dirname, 'fixtures')
const snapshots = resolve(__dirname, '__snapshots__')

it('esbuild', async () => {
  const { outputFiles } = await build({
    entryPoints: [resolve(fixture, 'foo.ts')],
    write: false,
    bundle: true,
    format: 'esm',
    plugins: [
      globals({
        'vue': 'Vue',
        'vue-router': 'VueRouter',
      }),
    ],
  })
  const [{ contents }] = outputFiles!
  expect(Buffer.from(contents.buffer).toString()).toMatchFileSnapshot(
    resolve(snapshots, 'esbuild.result'),
  )
})
