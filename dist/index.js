'use strict';

var t$2 = require('@babel/types');

var vueModelName = '_vm';
var createEleName = '_h';
var renderFuncName = '_c';
var WithStatementReplaceComment = '__VUE_TEMPLATE_BABEL_COMPILER_WITH_PLACEHOLDER__';
function parseWithStatementToVm() {
  return {
    visitor: {
      WithStatement(path) {
        var withStatementReturnBody = path.node.body.body[0];
        t$2.addComment(withStatementReturnBody, "leading", WithStatementReplaceComment);
        path.replaceWithMultiple([withStatementReturnBody]);
      }

    }
  };
}

// allowed globals in Vue render functions.
// same as in src/core/instance/proxy.js
var names = 'BigInt,' + // new es syntax
'Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require,' + // for webpack
'arguments,' + // parsed as identifier but is a special keyword...
'_h,_c'; // cached to save property access (_c for ^2.1.5)

var hash = Object.create(null);
names.split(',').forEach(name => {
  hash[name] = true;
});

/*
Interpret Bubble's logic:
https://github.com/yyx990803/buble/blob/f5996c9cdb2e61cb7dddf0f6c6f25d0f3f600055/src/utils/prependVm.js
*/

var t$1 = require('@babel/types');

var RENDER_NAME = '__render__';
var STATIC_RENDER_FNS_NAME = '__staticRenderFns__';
var REST_PARAM_HELPER_FUNC_NAMES = [// TODO notFunctionDeclare
'_objectWithoutProperties', '_objectWithoutPropertiesLoose'];
var PRESERVE_NAMES = [vueModelName, renderFuncName, createEleName, ...REST_PARAM_HELPER_FUNC_NAMES, // TODO notGlobalVar
'_excluded'];

function notPreserveName(nodeName) {
  return !PRESERVE_NAMES.includes(nodeName);
}

function isRenderFunc(node) {
  var _node$id;

  if (!node) return;
  var name = (_node$id = node.id) === null || _node$id === void 0 ? void 0 : _node$id.name;
  return t$1.isVariableDeclarator(node) && (name === RENDER_NAME || name === STATIC_RENDER_FNS_NAME);
}

function withinRenderFunc(path) {
  while (path && path.node && !t$1.isProgram(path.node) && !isRenderFunc(path.node)) {
    path = path.parentPath;
  }

  return isRenderFunc(path.node);
}

function shouldPrependVmNew(path) {
  var _scope$block$params;

  var parent = path.parent;
  var node = path.node;
  var nodeName = node.name;
  var scope = path.scope;

  if (!t$1.isProgram(scope.path) && !(t$1.isVariableDeclarator(parent) && nodeName === RENDER_NAME) && notPreserveName(nodeName) && withinRenderFunc(scope.path) // not id of a Declaration:
  && !t$1.isVariableDeclarator(parent) // not a params of a function
  && !(t$1.isFunctionExpression(parent) && parent.params.indexOf(node) > -1) // not a key of Property
  && !(t$1.isObjectProperty(parent) && path.parent.key === node) // not a property of a MemberExpression
  && !(t$1.isMemberExpression(parent) && path.parent.property === node) // not in an Array destructure pattern
  && !t$1.isArrayPattern(parent) // not in an Object destructure pattern
  && !t$1.isObjectPattern(parent.parent) // skip globals + commonly used shorthands
  && !hash[nodeName] // not cur function param
  && !(scope !== null && scope !== void 0 && (_scope$block$params = scope.block.params) !== null && _scope$block$params !== void 0 && _scope$block$params.find(node => node.name === nodeName)) // not already in scope
  && !scope.bindings[nodeName]) {
    return true;
  }
}

var babel$1 = require("@babel/core");

var t = babel$1.types;
function prependVm() {
  return {
    visitor: {
      Identifier(path) {
        if (shouldPrependVmNew(path)) {
          path.replaceWith(t.memberExpression(t.identifier(vueModelName), path.node));
        }
      }

    }
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

var babel = require('@babel/core');

var matchWithRegex = new RegExp(escapeRegExp(`/*${WithStatementReplaceComment}*/`), 'g');

module.exports = function transpile(code) {
  // console.log('input code = ', code)
  // TODO opts
  var output = babel.transformSync(code, {
    filename: 'compiledTemplate',
    // not enable strict mode, in order to parse WithStatement
    sourceType: 'script',
    assumptions: {
      setSpreadProperties: true
    },
    plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-transform-block-scoping', '@babel/plugin-transform-destructuring', ['@babel/plugin-proposal-object-rest-spread', {
      useBuiltIns: true
    }], '@babel/plugin-transform-spread', '@babel/plugin-transform-arrow-functions', '@babel/plugin-transform-parameters', parseWithStatementToVm, prependVm]
  });
  output.code = output.code.replace(matchWithRegex, 'var _vm=this;\nvar _h=_vm.$createElement;\nvar _c=_vm._self._c||_h;\n'); // console.log(output.code)

  return output.code;
};
