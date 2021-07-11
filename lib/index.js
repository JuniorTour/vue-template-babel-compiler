'use strict';

// allowed globals in Vue render functions.
// TODO add option to customize
var GLOBALS_IN_TEMPLATE = ["BigInt", "Infinity", "undefined", "NaN", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Math", "Number", "Date", "Array", "Object", "Boolean", "String", "RegExp", "Map", "Set", "JSON", "Intl", "require", "arguments", "_vm", "_h", "_c"];
var hash = Object.create(null);
GLOBALS_IN_TEMPLATE.forEach(name => {
  hash[name] = true;
});

/*
Interpret Bubble's logic:
https://github.com/yyx990803/buble/blob/f5996c9cdb2e61cb7dddf0f6c6f25d0f3f600055/src/utils/prependVm.js
*/

var t$1 = require('@babel/types');

function shouldPrependVmNew(path) {
  var _scope$path, _scope$block$params;

  var parent = path.parent;
  var node = path.node;
  var nodeName = node.name;
  var scope = path.scope;

  if ( // not function parameter destructuring
  ((_scope$path = scope.path) === null || _scope$path === void 0 ? void 0 : _scope$path.listKey) !== 'params' // not a id of a Declaration:
  && !t$1.isVariableDeclarator(parent) // not a params of a function
  && !(t$1.isFunctionExpression(parent) && parent.params.indexOf(node) > -1) // not a property of OptionalMemberExpression
  && !(t$1.isOptionalMemberExpression(parent) && parent.property === node) // not a key of Property
  && !(t$1.isObjectProperty(parent) && parent.key === node) // not a property of a MemberExpression
  && !(t$1.isMemberExpression(parent) && parent.property === node) // not in an Array destructure pattern
  && !t$1.isArrayPattern(parent) // not in an Object destructure pattern
  && !t$1.isObjectPattern(parent.parent) // skip globals + commonly used shorthands
  && !hash[nodeName] // not cur function param
  && !(scope !== null && scope !== void 0 && (_scope$block$params = scope.block.params) !== null && _scope$block$params !== void 0 && _scope$block$params.find(node => node.name === nodeName)) // not already in scope
  && !scope.bindings[nodeName]) {
    return true;
  }
}

var vueModelName = '_vm';
var WithStatementReplaceComment = '__VUE_TEMPLATE_BABEL_COMPILER_WITH_PLACEHOLDER__';

var t = require('@babel/types');

var nestedVisitor = {
  Identifier(path) {
    if (shouldPrependVmNew(path)) {
      path.replaceWith(t.memberExpression(t.identifier(vueModelName), path.node));
    }
  }

};
function parseWithStatementToVm() {
  return {
    visitor: {
      WithStatement(path) {
        // only traverse children ast of `with(this) {...}` part,
        // just like the `identifier.program.inWith` of bubble's logic
        path.traverse(nestedVisitor);
        var withStatementReturnBody = path.node.body.body[0];
        t.addComment(withStatementReturnBody, "leading", WithStatementReplaceComment);
        path.replaceWithMultiple([withStatementReturnBody]);
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
    plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-transform-block-scoping', '@babel/plugin-transform-destructuring', '@babel/plugin-transform-spread', '@babel/plugin-transform-arrow-functions', '@babel/plugin-transform-parameters', parseWithStatementToVm]
  });
  output.code = output.code.replace(matchWithRegex, 'var _vm=this;\nvar _h=_vm.$createElement;\nvar _c=_vm._self._c||_h;\n');
  return output.code;
};
