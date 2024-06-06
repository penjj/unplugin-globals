import type { Compilation } from 'webpack'
import { expect, test } from 'vitest'
import { webpack } from 'webpack'
import globals from '../src'
import { resolve } from 'node:path'

const fixture = resolve(__dirname, 'fixtures')
const snapshots = resolve(__dirname, '__snapshots__')

test('webpack', async () => {
  const compiler = webpack({
    entry: resolve(fixture, 'foo.ts'),
    mode: 'production',
    stats: 'none',
    optimization: {
      minimize: false,
    },
    experiments: {
      outputModule: true,
    },
    plugins: [
      globals.webpack({
        vue: 'Vue',
        'vue-router': 'VueRouter',
      }) as any,
    ],
  })

  const result = await new Promise<Compilation>((resolve, reject) => {
    compiler.compile((err, res) => (err ? reject(err) : resolve(res!)))
  })

  expect(result.assets['main.mjs'].source().toString()).toMatchFileSnapshot(
    resolve(snapshots, 'webpack.result')
  )
})
