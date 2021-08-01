# vue-template-babel-compiler
使用 [Babel](https://babeljs.io/) 为 [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) 启用 `Optional Chaining(?.)`, `Nullish Coalescing(??)` 等诸多 ES 新语法。

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

## DEMO
![DEMO](https://user-images.githubusercontent.com/14243906/127761300-076db45a-cdce-4fda-bd02-1f4fa96de6d8.png)

## Features
- [vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme) && [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler) 的所有功能
- 新语法: `Optional Chaining`, `Bigint`, `nullish coalescing` and more
- 自定义语法、babel 插件等等...

## 用法
### 1. 安装
``` bash
npm install --save-dev vue-template-babel-compiler
```

### 2. 配置
#### 1. [vue-cli](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)
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

#### 2. [nuxt.js](https://nuxtjs.org/docs/2.x/features/configuration#extend-webpack-to-load-audio-files)
``` js
// nuxt.config.js
```

#### 3. [webpack](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)
``` js
// your webpack.config.js which config vue-loader
```


### 欢迎 Issues && PR.
