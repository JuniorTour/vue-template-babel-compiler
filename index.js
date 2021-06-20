var babel = require('@babel/core')
// TODO es6 module || cjs
import prependVm from './plugins/prepend-vm'
import parseWithStatementToVm from './plugins/parse-with-statement'

module.exports = function transpile(code, opts) {
  // console.log('input code = ', code)
  // TODO opts
  // if (opts) {
  //   opts = Object.assign({}, defaultOptions, opts)
  //   opts.transforms = Object.assign({}, defaultOptions.transforms, opts.transforms)
  // } else {
  //   opts = defaultOptions
  // }

  let output = babel.transformSync(code, {
    filename: 'compiledTemplate',
    // not enable strict mode for WithStatement
    sourceType: 'script',
    assumptions: {
      setSpreadProperties: true,
    },
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-transform-block-scoping',
      '@babel/plugin-transform-destructuring',
      ['@babel/plugin-proposal-object-rest-spread', {useBuiltIns: true}],
      '@babel/plugin-transform-spread',
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-transform-parameters',
      parseWithStatementToVm,
      prependVm,
    ],
  })
  // console.log(output.code)
  return output.code
}
