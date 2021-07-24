const transpile = require('../lib')
const Vue = require('vue')

// TODO enable esm `import {}` for jest
function toFunction(code) {
  return new Function(code)
}

test('template compile should work', () => {
  const msg = 'Hello vue-template-babel-compiler'
  const {ast, render, staticRenderFns, tips, errors} = transpile(`<div>${msg}</div>`)

  const vm = new Vue({
    render: toFunction(render)
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(msg)
  expect(errors.length === 0).toBeTruthy()
})
