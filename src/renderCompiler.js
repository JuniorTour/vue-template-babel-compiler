import parseWithStatementToVm from './plugins/parse-with-statement'
import {WithStatementReplaceComment} from "./plugins/constants/preservedNames"
import {escapeRegExp} from "./utils/string"
import {mergeOptions} from "./utils/merge";

const babel = require('@babel/core')

const matchWithRegex = new RegExp(escapeRegExp(`/*${WithStatementReplaceComment}*/`), 'g')
const withReplacement = 'var _vm=this;\n  var _h=_vm.$createElement;\n  var _c=_vm._self._c||_h;\n'
const functionalWithReplacement = 'var _c=_vm._c;\n'

export function renderCompiler(code, options) {
  // TODO add customize individual options
  const isFunctional = options?.transforms?.stripWithFunctional

  const output = babel.transformSync(code, mergeOptions({
    filename: 'VueTemplateBabelCompiler',
    // not enable strict mode, in order to parse WithStatement
    sourceType: 'script',
    assumptions: {
      setComputedProperties: true,
      iterableIsArray: true,
    },
    plugins: [
      require.resolve('@babel/plugin-transform-computed-properties'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-transform-block-scoping'),
      require.resolve('@babel/plugin-transform-destructuring'),
      require.resolve("@babel/plugin-transform-spread"),
      [require.resolve("@babel/plugin-proposal-object-rest-spread"), { loose: true, useBuiltIns: true }],
      require.resolve('@babel/plugin-transform-arrow-functions'),
      require.resolve('@babel/plugin-transform-parameters'),
      parseWithStatementToVm,
    ],
  },
  options?.babelOptions || {})
  )

  return output.code.replace(matchWithRegex, isFunctional ? functionalWithReplacement : withReplacement)
}
