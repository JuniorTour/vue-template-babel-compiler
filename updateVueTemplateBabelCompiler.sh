#!/bin/sh
mv node_modules/vue-template-es2015-compiler node_modules/deprecated-vue-template-es2015-compiler
mv node_modules/vue-template-babel-compiler node_modules/vue-template-es2015-compiler
echo 'Update to vue-template-babel-compiler Success!'
