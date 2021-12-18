import parseWithStatementToVm from './plugins/parse-with-statement'
import {WithStatementReplaceComment} from "./plugins/constants/preservedNames"
import {escapeRegExp} from "./utils/string"

const babel = require('@babel/core')

const matchWithRegex = new RegExp(escapeRegExp(`/*${WithStatementReplaceComment}*/`), 'g')
const withReplacement = 'var _vm=this;\n  var _h=_vm.$createElement;\n  var _c=_vm._self._c||_h;\n'
const functionalWithReplacement = 'var _c=_vm._c;\n'

export function renderCompiler(code, options) {
  // TODO add customize individual options
  const isFunctional = options?.transforms?.stripWithFunctional

  const output = babel.transformSync(code, {
    filename: 'VueTemplateBabelCompiler',
    // not enable strict mode, in order to parse WithStatement
    sourceType: 'script',
    assumptions: {
      setComputedProperties: true,
      arrayLikeIsIterable: true,
    },
    plugins: [
      '@babel/plugin-transform-computed-properties',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-transform-block-scoping',
      '@babel/plugin-transform-destructuring',
      "@babel/plugin-transform-spread",
      ["@babel/plugin-proposal-object-rest-spread", { loose: true, useBuiltIns: true }],
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-transform-parameters',
      parseWithStatementToVm,
    ],
  })

  return output.code.replace(matchWithRegex, isFunctional ? functionalWithReplacement : withReplacement)
}
