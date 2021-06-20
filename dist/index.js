'use strict';

var babel$2 = require("@babel/core");

const t$2 = babel$2.types;
const vueModelName = '_vm';
const createEleName = '_h';
const renderFuncName = '_c';
function parseWithStatementToVm() {
  return {
    visitor: {
      WithStatement(path) {
        const curNodeBody = path.node.body.body[0];
        path.replaceWithMultiple([t$2.variableDeclaration('var', [t$2.variableDeclarator(t$2.identifier(vueModelName), t$2.thisExpression())]), t$2.variableDeclaration('var', [t$2.variableDeclarator(t$2.identifier(createEleName), t$2.memberExpression(t$2.identifier(vueModelName), t$2.identifier('$createElement')))]), t$2.variableDeclaration('var', [t$2.variableDeclarator(t$2.identifier(renderFuncName), t$2.logicalExpression('||', t$2.memberExpression(t$2.memberExpression(t$2.identifier(vueModelName), t$2.identifier('_self')), t$2.identifier(renderFuncName)), t$2.identifier(createEleName)))]), curNodeBody]);
      }

    }
  };
}

// allowed globals in Vue render functions.
// same as in src/core/instance/proxy.js
const names = 'Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require,' + // for webpack
'arguments,' + // parsed as identifier but is a special keyword...
'_h,_c'; // cached to save property access (_c for ^2.1.5)

const hash = Object.create(null);
names.split(',').forEach(name => {
  hash[name] = true;
});

/*
Interpret Bubble's logic:
https://github.com/yyx990803/buble/blob/f5996c9cdb2e61cb7dddf0f6c6f25d0f3f600055/src/utils/prependVm.js
*/

const t$1 = require('@babel/types');
const RENDER_NAME = '__render__';
const REST_PARAM_HELPER_FUNC_NAMES = [// TODO notFunctionDeclare
'_objectWithoutProperties', '_objectWithoutPropertiesLoose'];
const PRESERVE_NAMES = [vueModelName, renderFuncName, createEleName, ...REST_PARAM_HELPER_FUNC_NAMES, // TODO notGlobalVar
'_excluded'];

function notPreserveName(nodeName) {
  return !PRESERVE_NAMES.includes(nodeName);
}

function isRenderFunc(node) {
  return t$1.isVariableDeclarator(node) && (node === null || node === void 0 ? void 0 : node.id.name) === RENDER_NAME;
}

function withinRenderFunc(path) {
  while (path && path.node && !t$1.isProgram(path.node) && !isRenderFunc(path.node)) {
    path = path.parentPath;
  }

  return isRenderFunc(path.node);
} // TODO support staticRenderFns = [renderFunc]


function shouldPrependVmNew(path) {
  var _scope$block$params;

  const parent = path.parent;
  const node = path.node;
  const nodeName = node.name;
  const scope = path.scope;
  const notProgramScope = !t$1.isProgram(scope.path);
  const notRenderFunc = !(t$1.isVariableDeclarator(parent) && nodeName === RENDER_NAME);
  const withinWith = notProgramScope && notPreserveName(nodeName) && withinRenderFunc(scope.path);
  /*
      // 2. not id of a Declaration:
      !(isDeclaration(identifier.parent.type) && identifier.parent.id === identifier) &&
  */

  const notIdOfDeclaration = !t$1.isVariableDeclarator(parent);
  /*
      //3. not a params of a function
      !(isFunction(identifier.parent.type) && identifier.parent.params.indexOf(identifier) > -1) &&
  */

  const notParamsOfFunction = !(t$1.isFunctionExpression(parent) && parent.params.indexOf(node) > -1);
  /*
  // 4. not a key of Property
  eg: var obj = {a: 1} 中的 a
  !(identifier.parent.type === 'Property' && identifier.parent.key === identifier && !identifier.parent.computed) &&
  */

  const notKeyOfProperty = !(t$1.isObjectProperty(parent) && path.parent.key === node);
  /*
  // 5. not a property of a MemberExpression
  !(identifier.parent.type === 'MemberExpression' && identifier.parent.property === identifier && !identifier.parent.computed) &&
  */

  const notPropertyOfMemberExpression = !(t$1.isMemberExpression(parent) && path.parent.property === node);
  /*
      // not in an Array destructure pattern
  !(identifier.parent.type === 'ArrayPattern') &&
  */

  const notInArrayDestructure = !t$1.isArrayPattern(parent);
  /*
  // not in an Object destructure pattern
  !(identifier.parent.parent.type === 'ObjectPattern') &&
  */

  const notInObjectDestructure = !t$1.isObjectPattern(parent.parent);
  /*
  // skip globals + commonly used shorthands
  !globals[identifier.name] &&
  */

  const notGlobalShorthands = !hash[nodeName];
  /*
  // not already in scope
  !identifier.findScope(false).contains(identifier.name)
  */

  const notFunctionParam = !(scope !== null && scope !== void 0 && (_scope$block$params = scope.block.params) !== null && _scope$block$params !== void 0 && _scope$block$params.find(node => node.name === nodeName));
  const notAlreadyInScope = !scope.bindings[nodeName] && notFunctionParam; // TODO return directly

  const ret = notRenderFunc && withinWith && notIdOfDeclaration && notParamsOfFunction && notPropertyOfMemberExpression && notKeyOfProperty && notInArrayDestructure && notInObjectDestructure && notGlobalShorthands && notAlreadyInScope;
  return ret;
}

var babel$1 = require("@babel/core");

const t = babel$1.types;
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

var babel = require('@babel/core'); // TODO es6 module || cjs

module.exports = function transpile(code, opts) {
  // console.log('input code = ', code)
  // TODO opts
  // if (opts) {
  //   opts = Object.assign({}, defaultOptions, opts)
  //   opts.transforms = Object.assign({}, defaultOptions.transforms, opts.transforms)
  // } else {
  //   opts = defaultOptions
  // }
  let output = babel.transformSync(code, {
    filename: 'compiledTemplate',
    // not enable strict mode for WithStatement
    sourceType: 'script',
    assumptions: {
      setSpreadProperties: true
    },
    plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-transform-block-scoping', '@babel/plugin-transform-destructuring', ['@babel/plugin-proposal-object-rest-spread', {
      useBuiltIns: true
    }], '@babel/plugin-transform-spread', '@babel/plugin-transform-arrow-functions', '@babel/plugin-transform-parameters', parseWithStatementToVm, prependVm]
  }); // console.log(output.code)

  return output.code;
};
