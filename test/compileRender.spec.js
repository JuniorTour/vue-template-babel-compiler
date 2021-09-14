const transpile = require('../lib')
const Vue = require('vue')
const {compile} = require('vue-template-compiler')

function transpileWithOption(code) {
  return transpile(code, {transforms: {stripWithFunctional: false}})
}

function addWrapperForTranspile(code) {
  return `var __render__ = function (){${code}}`
}

const toFunction = code => {
  code = transpileWithOption(addWrapperForTranspile(code))
  code = code.replace(/var __render__ = function \(\) \{/g, '').slice(0, -2)
  return new Function(code)
}

const compileAsFunctions = template => {
  const {render, staticRenderFns} = compile(template)
  return {
    render: toFunction(render),
    staticRenderFns: staticRenderFns.map(toFunction)
  }
}

test('should work', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
        <div>{{ foo }}</div>
        <div>{{ a[foo] }}</div>
        <div v-for="{ name } in items">{{ name }}</div>
        <div v-bind="{ ...a, ...b }"/>
      </div>
    `),
    data: {
      foo: 'id',
      items: [
        {name: 'foo'},
        {name: 'bar'}
      ],
      a: {id: 'foo'},
      b: {class: 'bar'}
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(
    `<div>id</div> ` +
    `<div>foo</div> ` +
    `<div>foo</div><div>bar</div> ` +
    `<div id="foo" class="bar"></div>`
  )
})

test('arg spread', () => {
  const res = compile(`
    <button @click="(...args) => { store.foo(...args) }">Go</button>
  `)
  const code = transpileWithOption(addWrapperForTranspile(res.render))
  expect(code).toMatch(`(_vm$store = _vm.store).foo.apply(_vm$store, arguments)`)
  const spreadOperator = '...'
  expect(code).not.toMatch(spreadOperator)
})

test('rest spread in scope position', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
        <foo v-slot="{ foo, ...rest }">{{ rest }}</foo><foo v-slot="{ bar, ...rest }">{{ rest }}</foo>
      </div>
    `),
    components: {
      foo: {
        render(h) {
          return h('div', this.$scopedSlots.default({
            foo: 1,
            bar: 2,
            baz: 3
          }))
        }
      }
    }
  }).$mount()

  function stringify(obj) {
    return JSON.stringify(obj, null, 2)
  }

  expect(vm.$el.innerHTML).toMatch(
    `<div>${stringify({bar: 2, baz: 3})}</div><div>${stringify({foo: 1, baz: 3})}</div>`
  )
})

test('trailing function comma', () => {
  const spy = jest.fn()
  const vm = new Vue({
    ...compileAsFunctions(`
      <button @click="spy(1,)" />
    `),
    methods: {
      spy
    }
  }).$mount()
  vm.$el.click()
  expect(spy).toHaveBeenCalled()
})

test('v-model should work', () => {
  const vModelVal = 'foo'
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
            <input v-model="text" />
      </div>
    `),
    data: {
      text: vModelVal
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(`<input>`)
  expect(vm.$el.querySelector('input').value).toMatch(vModelVal)
})

test('should work for optional chaining', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
        <h1 v-if="optional?.chaining">optional chaining worked</h1>
      </div>
    `),
    data: {
      optional: {
        chaining: true
      }
    }
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(`<h1>optional chaining worked</h1>`)
})

test('should work for __staticRenderFns__', () => {
  const transpileResult = transpileWithOption(`
var __render__ = function () {with (this) {return _m(0)}}
var __staticRenderFns__ = [
  function () {
    with (this) {
      return _c(
        'div', {attrs: {"id": "app"}},
        [
          _c('img', {attrs: {"alt": "Vue logo", "src": require("./assets/logo.png")}}),
          _c('p', [_v(" static "),
            _c('a', {attrs: {"href": "https://github.com/JuniorTour/vue-template-babel-compiler"}},
              [_v(" JuniorTour/vue-template-babel-compiler ")])
          ])
        ]
      )
    }
  }]
`)

  expect(transpileResult).toMatch(`[_vm._v(" JuniorTour/vue-template-babel-compiler ")]`)
})

test('should work for nullish coalescing', () => {
  const vm = new Vue({
    ...compileAsFunctions(`
      <div>
        {{null ?? 'nullish coalescing'}}
      </div>
    `),
  }).$mount()

  expect(vm.$el.innerHTML).toMatch(`nullish coalescing`)
})

test('variableDeclarator init should append vm', () => {
  // v-model target value should not throw 'not defined' error
  // Src: https://github.com/JuniorTour/vue-template-babel-compiler/issues/5
  const vm = new Vue({
    ...compileAsFunctions(`
    <div>
        <input type="checkbox"
               value="1"
               v-model="checkboxVal">
    </div>
    `),
    data: {
      checkboxVal: true,
    }
  }).$mount()

  expect(() => {
    const checkboxEl = vm.$el.querySelector('input')
    checkboxEl.click()
  }).not.toThrow()
})

test('not already in scoped slot should work', () => {
  // argument should not be undefined in function invoke of scoped slot
  // Src: https://github.com/JuniorTour/vue-template-babel-compiler/issues/2
  const dataMsg = 'dataMsg'
  let scopedSlotContext
  const vm = new Vue({
    ...compileAsFunctions(`
    <scopeSlot>
      <template v-slot:default="{dataMsg}">
        <span @click="greet(dataMsg)">
          v-slot:content worked
        </span>
      </template>
    </scopeSlot>
    `),
    components: {
      scopeSlot: {
        ...compileAsFunctions(`
          <div>
            <h4>
              <slot v-bind:dataMsg="dataMsg">
                  content
              </slot>
            </h4>
          </div>
          `),
        data() {
          return {
            dataMsg,
          }
        }
      },
    },
    data: {
      checkboxVal: true,
    },
    methods: {
      greet(dataMsg) {
        scopedSlotContext = dataMsg
      },
    },
  }).$mount()

  expect(() => {
    const checkboxEl = vm.$el.querySelector('span')
    checkboxEl.click()
  }).not.toThrow()
  expect(scopedSlotContext).toMatch(dataMsg)
})
