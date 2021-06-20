#!/bin/sh
json -I -f package.json -e "this.dependencies['vue-template-es2015-compiler']=\"bar\""
json -I -f node_modules/@vue/component-compiler-utils/package.json  -e "this.dependencies['vue-template-es2015-compiler']=\"bar\""
echo 'Update to vue-template-babel-compiler Success!'