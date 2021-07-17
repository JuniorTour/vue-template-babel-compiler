# vue-template-babel-compiler
Enable `Optional Chaining` and many new ES features for [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) based on [Babel](https://babeljs.io/).

<p align="center">
  <a href="https://www.npmjs.com/package/vue-template-babel-compiler">
    <img
    src="https://img.shields.io/npm/v/vue-template-babel-compiler.svg?sanitize=true"
    alt="Version">
  </a>
  <a href="https://github.com/JuniorTour/vue-template-babel-compiler">
    <img
    src="https://img.shields.io/github/last-commit/JuniorTour/vue-template-babel-compiler?sanitize=true"
    alt="last-commit">
  </a>
</p>

## Features
- All features of [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler)
- `Optional Chaining` and more new ES features
  - [x] `Bigint`
  - [x] `nullish coalescing`
  - [ ] ......

## DEMO
![DEMO](https://user-images.githubusercontent.com/14243906/122856988-5b6f6600-d34a-11eb-89d6-21203b446ce4.png)

## Usage
``` bash
# 1: Install in your Vue project directory
npm install --save-dev vue-template-babel-compiler
# or:
yarn add vue-template-babel-compiler --dev

# 2: Run a script to substitute vue-template-es2015-compiler with this repo (To be simplified)
sh ./node_modules/vue-template-babel-compiler/updateVueTemplateBabelCompiler.sh

# 3. Enjoy~
```

## TODO

- [x] Support `__staticRenderFns__`
- [ ] More new ES features in SFC <template>
- [ ] Customize options for babel and globals in SFC <template>
- [x] publish [NPM package](https://www.npmjs.com/package/vue-template-babel-compiler)
- [ ] More Usage
- [ ] PR to [vue-template-es2015-compiler official repo](https://github.com/vuejs/vue-template-es2015-compiler)
  - [ ] Then we can use this simpler without run


### Welcome for issue, PR.
