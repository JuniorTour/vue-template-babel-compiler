# vue-template-babel-compiler &middot; [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/JuniorTour/vue-template-babel-compiler) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/CONTRIBUTING.md)

Enable `Optional Chaining(?.)`, `Nullish Coalescing(??)` and many new ES syntax for [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) based on [Babel](https://babeljs.io/).

<p align="center">
  <a href="https://www.npmjs.com/package/vue-template-babel-compiler" target="_blank">
    <img
    src="https://img.shields.io/npm/dt/vue-template-babel-compiler"
    alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/vue-template-babel-compiler" target="_blank">
    <img
    src="https://img.shields.io/github/size/JuniorTour/vue-template-babel-compiler/lib/index.js"
    alt="Size">
  </a>
  <a href="https://www.npmjs.com/package/vue-template-babel-compiler" target="_blank">
    <img
    src="https://img.shields.io/npm/v/vue-template-babel-compiler.svg?sanitize=true"
    alt="Version">
  </a>
  <a href="https://github.com/JuniorTour/vue-template-babel-compiler" target="_blank">
    <img
    src="https://img.shields.io/github/last-commit/JuniorTour/vue-template-babel-compiler?sanitize=true"
    alt="LastCommit">
  </a>
  <a href="https://github.com/JuniorTour/vue-template-babel-compiler/actions/workflows/main.yml" target="_blank">
    <img
    src="https://github.com/JuniorTour/vue-template-babel-compiler/actions/workflows/main.yml/badge.svg"
    alt="CIStatus">
  </a>
</p>

## DEMO
<a href="https://stackblitz.com/edit/github-vue-template-babel-compiler-cnvbcs?file=components%2FTutorial.vue&terminal=dev" target="_blank">
Visit Online Playground →
</a>

![DEMO](https://user-images.githubusercontent.com/14243906/127761300-076db45a-cdce-4fda-bd02-1f4fa96de6d8.png)

## Features
- All features of [vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme) && [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler)
- New ES syntax: `Optional Chaining`, `Bigint`, `Nullish Coalescing` and more
- Use babel to transpile vue render function, customization syntax, babel options customization

## Usage
### 1. Install
``` bash
npm install vue-template-babel-compiler --save-dev
```

### 2. Config
#### 1. [Vue-CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)

<a href="https://stackblitz.com/edit/vue-template-babel-compiler-vue-cli-project?file=src%2FApp.vue&terminal=serve" target="_blank">
Vue-CLI Online Example Project
</a>

``` js
// vue.config.js
module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compiler = require('vue-template-babel-compiler')
                return options
            })
    }
}
```

#### 2. [Nuxt.js](https://nuxtjs.org/docs/2.x/features/configuration#extend-webpack-to-load-audio-files)

<a href="https://stackblitz.com/edit/github-vue-template-babel-compiler-cnvbcs?file=components%2FTutorial.vue&terminal=dev" target="_blank">
Nuxt.js Online Example Project
</a>

``` js
// nuxt.config.js
export default {
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      vue: {
        compiler: require('vue-template-babel-compiler')
      }
    },
  },
  // ...
}
```

## [Doc](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/Usage.md)
- [vue-jest Usage](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/Usage.md#1-vue-jest)
- [Webpack Usage](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/Usage.md#2-webpack)
- [VueUse && `<script setup>` Usage](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/Usage.md#3-vueuse--script-setup)
- [babel options customization](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/Usage.md#1-babel-options-customization)
- [Functional Component Usage](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/Usage.md#1-functional-component-usage)

## [API Doc](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/API.md)


### Welcome for Issues && PR, see [CONTRIBUTING.md](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/CONTRIBUTING.md) for detail.
