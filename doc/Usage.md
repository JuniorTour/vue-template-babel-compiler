# Usage

##### Table of Contents
- [Usage Detail](#Usage-Detail)
  - [vue-jest Usage](#1-vue-jest)
  - [Webpack Usage](#2-Webpack)
  - [VueUse && `<script setup>`](#3-vueuse--script-setup)
- [Options](#Options)
  - [babel options customization](#1-babel-options-customization)
- [Caveats](#Caveats)
  - [Functional Component Usage](#1-Functional-Component-Usage)
  - [Only Substitute `vue-template-es2015-compiler`](#2-only-substitute-vue-template-es2015-compiler)
  - [Prevent been compiled by other babel config](#3-Prevent-been-compiled-by-other-babel-config)

## Usage Detail

#### 1. [vue-jest](https://github.com/JuniorTour/vue-template-babel-compiler/issues/8)
- [vue-jest@26 DEMO commit](https://github.com/JuniorTour/vue-template-babel-compiler-nuxt-project/commit/633ac52a7787fb416e4b35a8074a8d9c6a71b43c)
- [vue-jest@28 DEMO commit](https://github.com/JuniorTour/vue-template-babel-compiler-nuxt-project/commit/4c475274cc5eedf4aa918cca53e29bd346af197a)


``` js
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^vue$": "vue/dist/vue.common.js"
  },
  moduleFileExtensions: ["js", "vue", "json"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "@vue/vue2-jest"
  },
  globals: {
    'vue-jest': {
      templateCompiler: {
        compiler: require('vue-template-babel-compiler')
      }
    }
  }
};
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


#### 3. [VueUse && `<script setup>`](https://github.com/JuniorTour/vue-template-babel-compiler-VueUse-Example)

Example Project: https://github.com/JuniorTour/vue-template-babel-compiler-VueUse-Example

```js
// vue.config.js
module.exports = {
    parallel: false,  // disable thread-loader, which is not compactible with this plugin
    chainWebpack: config => {
        // disable type check and let `vue-tsc` handles it
        config.plugins.delete('fork-ts-checker')
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compiler = require('vue-template-babel-compiler')
                return options
            })
    },
    configureWebpack: {
        plugins: [
            require('unplugin-vue2-script-setup/webpack')({ /* options */ }),
        ],
    },
}
```


#### 4. Vite usage

##### 1. With `vite-plugin-vue2` plugin (https://github.com/vitejs/vite-plugin-vue2)

``` js
// vite.config.js
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
  plugins: [
    createVuePlugin({
      jsx: true,
      vueTemplateOptions: {
        compiler: require('vue-template-babel-compiler'),
      },
    }),
  ],
});
```

##### 2. With `vite-plugin-vue2` plugin (https://www.npmjs.com/package/vite-plugin-vue2)

This plugin contains `vue-template-babel-compiler@1.2.0` out of box: https://github.com/underfin/vite-plugin-vue2/blob/master/package.json#L71

Just add `vite-plugin-vue2` plugin, new syntax including `optional chaining` will work.

If you need new version, just `npm install vue-template-babel-compiler@latest`.


## Options

### 1. babel options customization

We can customize babel options for this compiler by `babelOptions` property:
```js
// vue.config.js
module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compilerOptions.babelOptions = {
                    filename: 'newFilename',
                    newProp: true,
                    assumptions: {
                      additional: 'additional'
                    },
                    plugins: [
                      'newPlugin'
                    ]
                }
                options.compiler = require('vue-template-babel-compiler')
                return options
            })
    }
}

// nuxt.config.js
export default {
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      vue: {
        compilerOptions: {
          babelOptions: {
            /* ... */
          },
        },
        compiler: require('vue-template-babel-compiler')
      }
    },
  },
  // ...
}
```

This `babelOptions` property will merge with [default options](https://github.com/JuniorTour/vue-template-babel-compiler/blob/b49006bbf3913230bc604203452404b011a443f0/src/renderCompiler.js#L15-L35)


## Caveats

### 1. Functional Component Usage

We have to rename `functional component .vue file` to contain `.functional` mark.

> [Example Functional Component .vue file link](https://github.com/JuniorTour/vue-template-babel-compiler-vue-cli-project/blob/main/src/components/FunctionalComponent.functional.vue)

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

### 3. Prevent been compiled by other babel config

Sometimes, we want the Vue `<template>` only compiled by this compiler's config, not babel config from others.

For example: [Issue #13: call typeof error](https://github.com/JuniorTour/vue-template-babel-compiler/issues/23).

In this scenario, we need prevent this compiler uses [babel config chain](https://github.com/babel/babel/blob/b2d9156cc62d37f4c522c9505a00f50b99a1eb74/packages/babel-core/src/config/partial.ts#L139), and don't compile `typeof` keyword by `@babel/plugin-transform-typeof-symbol` from `@vue/cli-plugin-babel/preset`.

So we can `exclude` vue template from babel config:
``` js
// babel.config.js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  exclude: 'VueTemplateBabelCompiler'
}
```

After this config, this compiler will not use `@vue/cli-plugin-babel/preset` to compile Vue `<template>`, then the `typeof` keyword will not run into error.
