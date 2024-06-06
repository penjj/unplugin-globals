import type { Compilation } from 'webpack'
import { expect, test } from 'vitest'
import { webpack } from 'webpack'
import globals from '../src'
import { resolve } from 'node:path'
import { runScript } from './util'

const fixture = resolve(__dirname, 'fixtures')

test('webpack', async () => {
  const compiler = webpack({
    entry: resolve(fixture, 'foo.js'),
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
        'lib-a': 'LibA',
        'lib-b': 'LibB',
      }) as any,
    ],
  })

  const result = await new Promise<Compilation>((resolve, reject) => {
    compiler.compile((err, res) => (err ? reject(err) : resolve(res!)))
  })

  expect(
    runScript(result.assets['main.mjs'].source().toString())
  ).toEqual('Hello World')
})
