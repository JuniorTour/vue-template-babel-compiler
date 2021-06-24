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
} // TODO support staticRenderFns = [renderFunc]


function shouldPrependVmNew(path) {
  var _scope$block$params;

  var parent = path.parent;
  var node = path.node;
  var nodeName = node.name;
  var scope = path.scope;
  var notProgramScope = !t$1.isProgram(scope.path);
  var notRenderFunc = !(t$1.isVariableDeclarator(parent) && nodeName === RENDER_NAME);
  var withinWith = notProgramScope && notPreserveName(nodeName) && withinRenderFunc(scope.path);
  /*
      // 2. not id of a Declaration:
      !(isDeclaration(identifier.parent.type) && identifier.parent.id === identifier) &&
  */

  var notIdOfDeclaration = !t$1.isVariableDeclarator(parent);
  /*
      //3. not a params of a function
      !(isFunction(identifier.parent.type) && identifier.parent.params.indexOf(identifier) > -1) &&
  */

  var notParamsOfFunction = !(t$1.isFunctionExpression(parent) && parent.params.indexOf(node) > -1);
  /*
  // 4. not a key of Property
  eg: var obj = {a: 1} 中的 a
  !(identifier.parent.type === 'Property' && identifier.parent.key === identifier && !identifier.parent.computed) &&
  */

  var notKeyOfProperty = !(t$1.isObjectProperty(parent) && path.parent.key === node);
  /*
  // 5. not a property of a MemberExpression
  !(identifier.parent.type === 'MemberExpression' && identifier.parent.property === identifier && !identifier.parent.computed) &&
  */

  var notPropertyOfMemberExpression = !(t$1.isMemberExpression(parent) && path.parent.property === node);
  /*
      // not in an Array destructure pattern
  !(identifier.parent.type === 'ArrayPattern') &&
  */

  var notInArrayDestructure = !t$1.isArrayPattern(parent);
  /*
  // not in an Object destructure pattern
  !(identifier.parent.parent.type === 'ObjectPattern') &&
  */

  var notInObjectDestructure = !t$1.isObjectPattern(parent.parent);
  /*
  // skip globals + commonly used shorthands
  !globals[identifier.name] &&
  */

  var notGlobalShorthands = !hash[nodeName];
  /*
  // not already in scope
  !identifier.findScope(false).contains(identifier.name)
  */

  var notFunctionParam = !(scope !== null && scope !== void 0 && (_scope$block$params = scope.block.params) !== null && _scope$block$params !== void 0 && _scope$block$params.find(node => node.name === nodeName));
  var notAlreadyInScope = !scope.bindings[nodeName] && notFunctionParam; // TODO return directly

  var ret = notRenderFunc && withinWith && notIdOfDeclaration && notParamsOfFunction && notPropertyOfMemberExpression && notKeyOfProperty && notInArrayDestructure && notInObjectDestructure && notGlobalShorthands && notAlreadyInScope;
  return ret;
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

module.exports = function transpile(code, opts) {
  // console.log('input code = ', code)
  // TODO opts
  // if (opts) {
  //   opts = Object.assign({}, defaultOptions, opts)
  //   opts.transforms = Object.assign({}, defaultOptions.transforms, opts.transforms)
  // } else {
  //   opts = defaultOptions
  // }
  var output = babel.transformSync(code, {
    filename: 'compiledTemplate',
    // not enable strict mode for WithStatement
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
