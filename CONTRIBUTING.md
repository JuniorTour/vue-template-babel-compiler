> Feel free to ask maintainers anything by [issue](https://github.com/JuniorTour/vue-template-babel-compiler/issues/new/choose)

- [Example: Fix issue #13 and Make a Pull Request](#example-fix-issue13-and-make-a-pull-request)
  * [1. Find or create an issue](#1-find-or-create-an-issue)
  * [2. Reproduce the issue](#2-reproduce-the-issue)
  * [3. Locate error](#3-locate-error)
    + [A. Chrome DevTool will start to listening](#a-chrome-devtool-will-start-to-listening)
    + [B. Open Chrome DevTool for Node.js form any chrome tab](#b-open-chrome-devtool-for-nodejs-form-any-chrome-tab)
    + [C. Use Chrome DevTool to debug this lib as usual](#c-use-chrome-devtool-to-debug-this-lib-as-usual)
  * [4. Find a solution](#4-find-a-solution)
  * [5. Fork this Repo and setup](#5-fork-this-repo-and-setup)
  * [6. Add test case and run `yarn test`](#6-add-test-case-and-run-yarn-test)
    + [Write test case is Easy!](#write-test-case-is-easy)
      - [A. find a `*.spec.js` file to write](#a-find-a-specjs-file-to-write)
      - [B. Copy the reproduce code snippet above with `jest API`](#b-copy-the-reproduce-code-snippet-above-with-jest-api)
      - [C. Run `yarn test`](#c-run-yarn-test)
  * [7. Git commit and Push](#7-git-commit-and-push)


# Example: Fix [issue#13](https://github.com/JuniorTour/vue-template-babel-compiler/commit/b5e8bd13e603bfb1b9dd87f1222b831fd2a68c49) and Make a Pull Request

## 1. Find or create an issue
For example, we want to fix [issue #13](https://github.com/JuniorTour/vue-template-babel-compiler/issues/13),

Reporter said there will be an error:

`[Vue warn]: Error in render: "ReferenceError: _defineProperty is not defined"`

when write:
``` js
<template>
    <div :class="{[`${componentCls}__single`]: true}">
    </div>
</template>
```

The first thing we need to do is identify and reproduce the issue.

## 2. Reproduce the issue
We can setup the Example Projects to reproduce the issue:
- [Example Project for Vue-CLI](https://github.com/JuniorTour/vue-template-babel-compiler-vue-cli-project)
- [Example Project for nuxt.js](https://github.com/JuniorTour/vue-template-babel-compiler-nuxt-project)

Follow its README to setup, usually we need:
``` shell script
git clone https://github.com/JuniorTour/vue-template-babel-compiler-vue-cli-project.git

cd ./vue-template-babel-compiler-vue-cli-project

yarn install

yarn server // or yarn dev
```

Then we can write the same code snippet in example project `.vue` files to reproduce error:
``` html
<template>
    <div :class="{[`${componentCls}__single`]: true}">
    </div>
</template>

<script>
  export default {
    name: 'Tutorial',
    data() {
      return {
        componentCls: 'willThrowError'
      }
    }
  }
</script>
```

If we can't reproduce, talk with the reporter and maintainer in the issue page.


## 3. Locate error
This lib is used in Node.js environment.

So when we reproduce the error, we can use `node --inspect-brk file.js --runInBand` to debug the whole process of code execution.

There are also [built-in npm script in the Example Projects](https://github.com/JuniorTour/vue-template-babel-compiler-vue-cli-project/blob/main/package.json#L9):
```shell script
yarn inspect
```

After execute `node --inspect-brk`,

### A. Chrome DevTool will start to listening
![image](https://user-images.githubusercontent.com/14243906/144751411-cc1a122c-91fe-46ad-a3f1-263d12c197d4.png)

### B. Open Chrome DevTool for Node.js form any chrome tab

![image](https://user-images.githubusercontent.com/14243906/144751826-4ed1b48d-2c92-4db3-ad64-1b65be406bc3.png)


### C. Use Chrome DevTool to debug this lib as usual
![image](https://user-images.githubusercontent.com/14243906/144751318-7f4149ba-c74a-42d1-97e2-d9b8deabfbeb.png)

This npm package usually located in:
`vue-template-babel-compiler-nuxt-project\node_modules\vue-template-babel-compiler\lib\index.js`

> Hotkey: (ctrl || command) + P can be used to search file in DevTool:

![image](https://user-images.githubusercontent.com/14243906/144751635-ac73ff2c-2717-49ce-80f8-3606c768d2f9.png)


## 4. Find a solution
After debug, I found the error above was caused by `computed property` in SFC `<template>` compiled with a helper functions (`_defineProperty()`) by `babel`

And I checked the [Doc of babel-plugin-transform-computed-properties](https://babeljs.io/docs/en/babel-plugin-transform-computed-properties), found this is by designed.

![image](https://user-images.githubusercontent.com/14243906/144752181-99d9621b-c77e-43ed-bfc7-94375629633c.png)

But we don't need this helper function, with this function we will get `Error in render: "ReferenceError: _defineProperty is not defined"`.

So we should remove `defineProperty` from compiled result.

> Why we get this error:
>
> Because we only keep the code inner render function, and strip other part of babel compile result by [getFunctionBody()](https://github.com/JuniorTour/vue-template-babel-compiler/blob/c68a991be1fb91f26397ee5e61ef307a15f05d3c/src/templateCompiler.js#L18)

After search through [Google](https://google.com/), [stackoverflow.com/](https://stackoverflow.com/)

Then I found there is an option for babel to remove this helper function: [assumptions.setComputedProperties](https://babeljs.io/docs/en/babel-plugin-transform-computed-properties#loose)

After add this option to `vue-template-babel-compiler-nuxt-project\node_modules\vue-template-babel-compiler\lib\index.js ` during debug.

I found the error will NOT throw, and everything works fine.

So I think this is the solution, After merge my changes to `main branch`, the issue#13 will be fixed.

## 5. Fork this Repo and setup

``` shell script
git clone https://github.com/JuniorTour/vue-template-babel-compiler.git

cd vue-template-babel-compiler

yarn install

yarn test // ensure your setup is right
```


## 6. Add test case and run `yarn test`
Before we make a Pull Request, We need to ensure this change doesn't break other logic of this lib.

That is the reason why we need `Unit Test` based on [jest](https://jestjs.io/) .

When we add new code, it will be better to add some test case to ensure our new code never break by others later added.

### Write test case is Easy!
#### A. find a `*.spec.js` file to write

#### B. Copy the reproduce code snippet above with `jest API`

> If you are not familiar with [jest](https://jestjs.io/), its Doc and [Google](https://google.com/) will help you.
> You can also refer to the [existing cases of this project](https://github.com/JuniorTour/vue-template-babel-compiler/tree/main/test)

``` js
test('should use simple assign for computed properties', () => {
  // https://github.com/JuniorTour/vue-template-babel-compiler/issues/13
  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(
    '<div :class="{[`${foo}_bar`]: true}"></div>'
  )

  expect(errors.length === 0).toBeTruthy()
  expect(render).toMatch('class: (_class = {}, _class[`${_vm.foo}_bar`] = true, _class)')
})
```

#### C. Run `yarn test`
Make sure you see:
```shell script
// ...
Test Suites: M passed, M total
Tests:       N passed, N total
Snapshots:   0 total
Time:        5.054s
Ran all test suites.
Done in 11.64s.
```

This means your code doesn't break anything :)

## 7. Git commit and Push

Finally, commit your changes like [fix: use simple assign for computed properties (fix #13)](https://github.com/JuniorTour/vue-template-babel-compiler/commit/b5e8bd13e603bfb1b9dd87f1222b831fd2a68c49#) and `git push`.

> Don't forget Follow the [commit convention](https://www.conventionalcommits.org/en/v1.0.0/): `#{fix || chore || feat: xxx (fix #13)}`

> yarn.lock, package.json changes should be kept.

Create a new `Pull Request` fellow the tips from terminal and GitHub.

Then wait a moment, the maintainer will reply ASAP!



