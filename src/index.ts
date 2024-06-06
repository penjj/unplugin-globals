import type { ImportDeclaration, Node } from '@babel/types'
import MagicString from 'magic-string'
import { createUnplugin } from 'unplugin'
import {
  babelParse,
  getLang,
  isTypeOf,
  resolveIdentifier,
  resolveLiteral,
  walkAST,
} from 'ast-kit'
import { name } from '../package.json'

/**
 * 全局别名配置，key 为依赖包包名，value 为全局变量别名
 */
export type Options = Record<string, string>

/**
 * 构建时将依赖外部化
 * @example
 * ```ts
 * export default {
 *   plugins: [globals({
 *      vue: 'Vue'
 *   })]
 * }
 * ```
 */
export default createUnplugin<Options>((options) => {
  const globals = Object.keys(options)
  const isGlobal = globals.includes.bind(globals)

  return {
    name,
    esbuild: {
      setup(build) {
        const filter = {
          filter: new RegExp(`^(${globals.join('|')})$`),
        }
        build.onResolve(filter, (args) => {
          return { path: args.path, namespace: name }
        })

        build.onLoad(
          { filter: /.*/, namespace: name },
          (args) => {
            return {
              contents: `module.exports = ${options[args.path]}`,
              loader: 'js',
            }
          },
        )
      },
    },
    resolveId(id) {
      if (isGlobal(id))
        return id
    },

    loadInclude(id) {
      return isGlobal(id)
    },

    load(id) {
      return `export default ${options[id]}`
    },

    transform(code, id) {
      const ms = transformGlobalImport(code, isGlobal, getLang(id))

      if (ms.hasChanged()) {
        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true, file: id }),
        }
      }
    },
  }
})

function transformGlobalImport(
  code: string,
  isGlobal: (module: string) => boolean,
  lang: string,
): MagicString {
  const ms = new MagicString(code)
  const ast = babelParse(code, lang)

  walkAST(ast as unknown as Node, {
    leave(node) {
      if (
        !isTypeOf(node, 'ImportDeclaration')
        || !isGlobal(node.source.value)
      ) {
        return this.skip()
      }

      ms.update(node.start!, node.end!, resolveImportDeclaration(node))
    },
  })

  return ms
}

let globalImportIndex = 0

function resolveImportDeclaration(node: ImportDeclaration): string {
  const moduleName = `__global_import_${globalImportIndex++}`
  let code = `import ${moduleName} from '${node.source.value}';`

  for (const spec of node.specifiers) {
    const localName = resolveIdentifier(spec.local)

    if (isTypeOf(spec, 'ImportSpecifier')) {
      code += `\nconst ${localName} = ${moduleName}`
      code += isTypeOf(spec.imported, 'StringLiteral')
        ? `[${resolveLiteral(spec.imported)}];`
        : `.${resolveIdentifier(spec.imported)};`
    }
    else {
      code += `\nconst ${localName} = ${moduleName};`
    }
  }

  return code
}
