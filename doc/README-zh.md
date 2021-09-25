# vue-template-babel-compiler
使用 [Babel](https://babeljs.io/) 为 [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) 启用 `可选链(?.)`, `空值合并(??)` 等诸多 ES 新语法。

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

## 示例
![DEMO](https://user-images.githubusercontent.com/14243906/127761300-076db45a-cdce-4fda-bd02-1f4fa96de6d8.png)

## 特性
- [vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme) && [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler) 的所有功能
- 新语法: `Optional Chaining`, `Bigint`, `nullish coalescing` and more
- 自定义语法、babel 插件等等...

## 用法
### 1. 安装
``` bash
npm install vue-template-babel-compiler --save-dev
```

### 2. 配置
#### 1. [Vue-CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)
[Vue-CLI 配置演示项目](https://github.com/JuniorTour/vue-template-babel-compiler-vue-cli-project)
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
[Nuxt.js 配置演示项目](https://github.com/JuniorTour/vue-template-babel-compiler-nuxt-project)
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

#### 3. [Webpack](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)
``` js
// your webpack.config.js where config vue-loader
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            compiler: require('vue-template-babel-compiler')
        }
      }
    ]
  }
}
```

### 欢迎 Issues && PR.
