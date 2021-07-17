/*
Interpret Bubble's logic:
https://github.com/yyx990803/buble/blob/f5996c9cdb2e61cb7dddf0f6c6f25d0f3f600055/src/utils/prependVm.js
*/
import globals from '../constants/globals'
const t = require('@babel/types');

export function shouldPrependVmNew(path) {
  const parent = path.parent
  const node = path.node
  const nodeName = node.name
  const scope = path.scope

  if (
    // not function parameter destructuring
    scope.path?.listKey !== 'params'
    // not a id of a Declaration:
    && !t.isVariableDeclarator(parent)
    // not a params of a function
    && !(t.isFunctionExpression(parent) && parent.params.indexOf(node) > -1)
    // not a property of OptionalMemberExpression
    && !(t.isOptionalMemberExpression(parent) && parent.property === node)
    // not a key of Property
    && !(t.isObjectProperty(parent) && parent.key === node)
    // not a property of a MemberExpression
    && !(t.isMemberExpression(parent) && parent.property === node)
    // not in an Array destructure pattern
    && !t.isArrayPattern(parent)
    // not in an Object destructure pattern
    && !t.isObjectPattern(parent.parent)
    // skip globals + commonly used shorthands
    && !globals[nodeName]
    // not cur function param
    && !scope?.block.params?.find(node => node.name === nodeName)
    // not already in scope
    && !scope.bindings[nodeName]
  ) {
    return true
  }
}

