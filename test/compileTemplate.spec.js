const templateCompiler = require('../lib')
const Vue = require('vue')

// TODO enable esm `import {}` for jest
function toFunction(code) {
  return new Function(code)
}

test('template compile should work', () => {
  const msg = 'Hello vue-template-babel-compiler'
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`<div>${msg}</div>`)

  const vm = new Vue({
    render: toFunction(render)
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(msg)
  expect(errors.length === 0).toBeTruthy()
})

test('should extend template compile', () => {
  const functionType = 'function'
  expect(typeof templateCompiler).toMatch(functionType)
  expect(typeof templateCompiler.compile).toMatch(functionType)
  expect(typeof templateCompiler.parseComponent).toMatch(functionType)
  expect(typeof templateCompiler.compileToFunctions).toMatch(functionType)
  expect(typeof templateCompiler.ssrCompile).toMatch(functionType)
  expect(typeof templateCompiler.ssrCompileToFunctions).toMatch(functionType)
  expect(typeof templateCompiler.generateCodeFrame).toMatch(functionType)

  // use same compiler for ssr and non-ssr, fix: https://github.com/JuniorTour/vue-template-babel-compiler/issues/7
  expect(templateCompiler.ssrCompile).toEqual(templateCompiler.compile)
})

test('should work for functional component', () => {
  const msg = 'Functional Component'

  const {render} = templateCompiler.compile(
    `<div>${msg}</div>`,
    {filename: 'foo.functional.js'})

  expect(render).toMatch('var _c=_vm._c')
})

test('should use object.assign for object rest spread', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/9
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
    <h3 v-if="{...a}">object rest spread</h3>
`)

  expect(errors.length === 0).toBeTruthy()
  expect(render).toMatch(`Object.assign({}, _vm.a) ? _c('h3', [_vm._v("object rest spread")]) : _vm._e()`)
})

test('should use simple assign for computed properties', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/13
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(
    '<div :class="{[`${foo}_bar`]: true}"></div>'
  )

  expect(errors.length === 0).toBeTruthy()
  expect(render).toMatch('class: (_class = {}, _class[`${_vm.foo}_bar`] = true, _class)')
})

test('should traverse scope to judge shouldPrependVm', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/16
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
  <div>
    <div v-for="actionKey in actionKeys">
      <input type="checkbox" v-model="enabled[actionKey]" />
    </div>
  </div>`)

  const vm = new Vue({
    render: toFunction(render),
    data() {
      return {
        actionKeys: ['1','2','3'],
        enabled: {
          1: true,
          2: true,
          3: true,
        },
      }
    }
  }).$mount()

  expect(errors.length === 0).toBeTruthy()
  expect(vm.$el.innerHTML).toMatch('<input type="checkbox"')
  expect(() => {
    const checkboxEl = vm.$el.querySelector('input')
    checkboxEl.click()
  }).not.toThrow()
  expect(vm.$data.enabled[1]).toBeFalsy()
})

test('should prepend vm to computed property', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/28
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
  <div>
    <div :class="{
        [class1]: condition1
    }"></div>
  </div>`)

  const vm = new Vue({
    render: toFunction(render),
    data() {
      return {
        class1: 'firstClass',
        condition1: true,
      }
    }
  }).$mount()

  expect(errors.length === 0).toBeTruthy()
  expect(vm.$el.innerHTML).toMatch('<div class="firstClass"')
})

test('babelOptions should work for assumptions', () => {
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(
      '<div :class="{[`${foo}_single`]: true}"></div>',
      {
        babelOptions: {
          assumptions: {
            setComputedProperties: false,
          },
        }
      }
    )

  expect(render).toMatch('class: _defineProperty({}, `${_vm.foo}_single`, true)')
})

test('should treat iterable as array', () => {
  // #31, #25
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
  <div>
    <div v-for="[one, two] in [[1,2]]">
    {{one}}+{{two}}
    </div>
  </div>`)

  expect(errors.length === 0).toBeTruthy()
  expect(render).not.toMatch('_maybeArrayLike')
  expect(render).toMatch('_vm._s(one) + "+" + _vm._s(two)')
})

test('should split staticRenderFns correct', () => {
  // #34
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
  <div>
    <div data-class="function">1</div>
  </div>`)

  expect(errors.length === 0).toBeTruthy()
  expect(staticRenderFns.length === 1).toBeTruthy()
  expect(staticRenderFns[0]).toMatch(`"data-class": "function"`)
})


test('should split multiple staticRenderFns correct', () => {
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(`
  <div>
    <h1>{{header}}</h1>
    <ul>
        <li>static1</li>
    </ul>
    <ul>
        <li>static2</li>
    </ul>
    <ul>
        <li>static3</li>
    </ul>
  </div>`)

  expect(errors.length === 0).toBeTruthy()
  expect(staticRenderFns.length === 3).toBeTruthy()
  expect(staticRenderFns[0]).toMatch(`_vm._v("static1")`)
  expect(staticRenderFns[1]).toMatch(`_vm._v("static2")`)
  expect(staticRenderFns[2]).toMatch(`_vm._v("static3")`)
})
