#!/bin/sh
mv node_modules/vue-template-es2015-compiler node_modules/vue-template-es2015-compiler-deprecated
mv node_modules/vue-template-babel-compiler node_modules/vue-template-es2015-compiler
echo 'Use vue-template-babel-compiler Success!'
