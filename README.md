# vue-template-babel-compiler
Enable `Optional Chaining` and many new ES features for [Vue.js SFC](https://vuejs.org/v2/guide/single-file-components.html) based on [Babel](https://babeljs.io/).

## Features
- All features of [vue-template-es2015-compiler](https://github.com/vuejs/vue-template-es2015-compiler)
- `Optional Chaining` and more new ES features

## DEMO
### [TODO: DEMO Repo]()

![DEMO](https://user-images.githubusercontent.com/14243906/122681567-785f4880-d227-11eb-91e3-abc9ffc06524.png)

## Usage
``` js
# 1: In your Vue project directory
yarn add https://github.com/JuniorTour/vue-template-babel-compiler/tarball/main

# 2: Run a script to
# modify vue-template-es2015-compiler to this repo
# (If this repo got merged into the official repo, this step can be simplified.)
sh ./node_modules/vue-template-babel-compiler/updateVueTemplateBabelCompiler.sh

# Enjoy~
```

## TODO

- Support `staticRenderFns = [renderFunc]`
- More new ES features, such as: `nullish coalescing` and etc.
- publish NPM package
- PR to [vue-template-es2015-compiler official repo](https://github.com/vuejs/vue-template-es2015-compiler)
  - Then we can use this simpler without run


Welcome for issue, PR.
