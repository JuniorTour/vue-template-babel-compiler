# API of vue-template-babel-compiler

## transpile(renderSourceCode: String, options: Object): String
- Desc:

Transpile es2015+ render function into standard es2015.

Same as [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler).

But use [Babel](https://babeljs.io/) to transpile.

- Params:
  - `renderSourceCode: String`: Source code of render function in string type.
  - `options: Object`: Available options for transpile and Babel.
    - (Work in progress, Welcome for contribution)
- Return Value:
  - String value, the `renderSourceCode: String` after transpile into standard es2015.

- Usage Demo:
```js
const transpile = require('./lib')

const renderFunctionBody = `
var __render__ = function () {
  with (this) {
    return _c(
      'div', {attrs: {"id": "app"}},
      [
        _c('h1', [_v("Hello vue-template-babel-compiler")]),
        _v(" "),
        (optional?.chaining)
          ? _c('h2', [_v("\\n      Optional Chaining enabled: " + _s(optional?.chaining) + "\\n    ")])
          : _e()
      ]
    )
  }
}
`

const afterTranspile = transpile(renderFunctionBody, {transforms: {stripWithFunctional: false}})

// afterTranspile ===
var __render__ = function () {
  var _vm$optional, _vm$optional2;

  var _vm=this;
  var _h=_vm.$createElement;
  var _c=_vm._self._c||_h;

  return _c('div', {
    attrs: {
      "id": "app"
    }
  }, [
    _c('h1', [_vm._v("Hello vue-template-babel-compiler")]),
    _vm._v(" "),
    (_vm$optional = _vm.optional) !== null && _vm$optional !== void 0 && _vm$optional.chaining
      ? _c('h2', [
        _vm._v("\n      Optional Chaining enabled: " + _vm._s((_vm$optional2 = _vm.optional) === null || _vm$optional2 === void 0
          ? void 0
          : _vm$optional2.chaining) + "\n    ")])
      : _vm._e()
    ]
  );
}

// More: /test/compileRender.spec.js
```

## transpile.compile(templateSourceCode: String, options: Object): Object
- Desc:

Compile `<template>` of [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) into renders in standard es2015.

Same as [vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler).

But use [Babel](https://babeljs.io/) to transpile.

- Params:
  - `templateSourceCode: String`: Source code of render function in string type.
  - `options: Object`: Available options for compile `<template>` and Babel.
    - (Work in progress, Welcome for contribution)
- Return Value: Object
```ts
{
  ast: ?ASTElement, // parsed template elements to AST
  render: string,   // main render function code
  staticRenderFns: Array<string>, // render code for static sub trees, if any
  errors: Array<string> // template syntax errors, if any
}
```

- Usage Demo:
```js
const Compiler = require('./lib')

const {ast, render, staticRenderFns, tips, errors} = Compiler.compile(`<div>Hello vue-template-babel-compiler</div>`)

// render ===
var _vm=this;
var _h=_vm.$createElement;
var _c=_vm._self._c||_h;

return _c('div', [_vm._v("Hello vue-template-babel-compiler")]);

// More: /test/compileTemplate.spec.js
```

## More...
