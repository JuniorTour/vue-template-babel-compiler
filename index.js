import prependVm from './plugins/prepend-vm'
import parseWithStatementToVm, {WithStatementReplaceComment} from './plugins/parse-with-statement'
import {escapeRegExp} from "./utils/string";
const babel = require('@babel/core')

const matchWithRegex = new RegExp(escapeRegExp(`/*${WithStatementReplaceComment}*/`), 'g')

module.exports = function transpile(code) {
  // console.log('input code = ', code)
  // TODO opts

  let output = babel.transformSync(code, {
    filename: 'compiledTemplate',
    // not enable strict mode, in order to parse WithStatement
    sourceType: 'script',
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-transform-block-scoping',
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-transform-spread',
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-transform-parameters',
      parseWithStatementToVm,
      prependVm,
    ],
  })
  output.code = output.code.replace(matchWithRegex, 'var _vm=this;\nvar _h=_vm.$createElement;\nvar _c=_vm._self._c||_h;\n')
  return output.code
}
