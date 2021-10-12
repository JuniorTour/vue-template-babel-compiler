# Usage

##### Table of Contents
- [Usage Detail](#Usage-Detail)
  - [vue-jest Usage](#1-vue-jest)
  - [Webpack Usage](#2-Webpack)
- [Caveats](#Caveats)
  - [Functional Component Usage](#1-Functional-Component-Usage)
  - [Only Substitute `vue-template-es2015-compiler`](#2-Only-Substitute-vue-templat-es2015-compiler)

## Usage Detail

#### 1. [vue-jest](https://github.com/JuniorTour/vue-template-babel-compiler/issues/8)
[DEMO project for vue-jest && Nuxt.js](https://github.com/JuniorTour/vue-template-babel-compiler-nuxt-project/commit/633ac52a7787fb416e4b35a8074a8d9c6a71b43c)

> Only work for `vue-jest >= 4.0.0` && `jest <= 26.6.3`

``` js
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  globals: {
    'vue-jest': {
      templateCompiler: {
        compiler: require('vue-template-babel-compiler')
      }
    }
  }
}
```

#### 2. [Webpack](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)
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


## Caveats

### 1. Functional Component Usage

We have to rename `functional component .vue file` to contain `.functional` mark.

[Example Functional Component .vue file link](https://github.com/JuniorTour/vue-template-babel-compiler-vue-cli-project/blob/main/src/components/FunctionalComponent.functional.vue)

You can customize the mark by `functionalComponentFileIdentifier` option :
``` js
  // where you config to use vue-template-babel-compiler, eg: vue.config.js
  .tap(options => {
  options.functionalComponentFileIdentifier = 'whateverYouWantToMarkFunctionalComponentFile'
  options.compiler = require('vue-template-babel-compiler')
    return options
  })
```

See [issue#10](https://github.com/JuniorTour/vue-template-babel-compiler/issues/10) for detail and feedback.


### 2. Only Substitute `vue-template-es2015-compiler`

This lib can be used to replace [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler) only.

Please refer to: [API Doc: transpile(renderSourceCode: String, options: Object): String](https://github.com/JuniorTour/vue-template-babel-compiler/blob/main/doc/API.md#transpilerendersourcecode-string-options-object-string)

eg:
```shell script
#!/bin/sh
mv node_modules/vue-template-es2015-compiler node_modules/vue-template-es2015-compiler-deprecated
mv node_modules/vue-template-babel-compiler node_modules/vue-template-es2015-compiler
echo 'Use vue-template-babel-compiler Success!'
```
