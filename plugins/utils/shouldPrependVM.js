/*
Interpret Bubble's logic:
https://github.com/yyx990803/buble/blob/f5996c9cdb2e61cb7dddf0f6c6f25d0f3f600055/src/utils/prependVm.js
*/
import {createEleName, renderFuncName, vueModelName} from "../parse-with-statement";

const t = require('@babel/types');
import globals from './globals'

const RENDER_NAME = '__render__'
const STATIC_RENDER_FNS_NAME = '__staticRenderFns__'

const REST_PARAM_HELPER_FUNC_NAMES = [
  // TODO notFunctionDeclare
  '_objectWithoutProperties',
  '_objectWithoutPropertiesLoose',
]

const PRESERVE_NAMES = [
  vueModelName,
  renderFuncName,
  createEleName,
  ...REST_PARAM_HELPER_FUNC_NAMES,
  // TODO notGlobalVar
  '_excluded',
]

function notPreserveName(nodeName) {
  return !PRESERVE_NAMES.includes(nodeName)
}

function isRenderFunc(node) {
  if (!node) return
  const name = node.id?.name
  return t.isVariableDeclarator(node) && (name === RENDER_NAME || name === STATIC_RENDER_FNS_NAME)
}

function withinRenderFunc(path) {
  while (path
  && path.node
  && !t.isProgram(path.node)
  && !isRenderFunc(path.node)) {
    path = path.parentPath
  }
  return isRenderFunc(path.node)
}

// TODO support staticRenderFns = [renderFunc]
export function shouldPrependVmNew(path) {
  const parent = path.parent
  const node = path.node
  const nodeName = node.name
  const scope = path.scope

  const notProgramScope = !t.isProgram(scope.path)
  const notRenderFunc = !(t.isVariableDeclarator(parent) && nodeName === RENDER_NAME)

  const withinWith = notProgramScope && notPreserveName(nodeName) && withinRenderFunc(scope.path)
  /*
      // 2. not id of a Declaration:
      !(isDeclaration(identifier.parent.type) && identifier.parent.id === identifier) &&
  */
  const notIdOfDeclaration = !t.isVariableDeclarator(parent)

  /*
      //3. not a params of a function
      !(isFunction(identifier.parent.type) && identifier.parent.params.indexOf(identifier) > -1) &&
  */
  const notParamsOfFunction = !(t.isFunctionExpression(parent) && parent.params.indexOf(node) > -1)
  /*
  // 4. not a key of Property
  eg: var obj = {a: 1} 中的 a
  !(identifier.parent.type === 'Property' && identifier.parent.key === identifier && !identifier.parent.computed) &&
  */
  const notKeyOfProperty = !(t.isObjectProperty(parent) && path.parent.key === node)
  /*
  // 5. not a property of a MemberExpression
  !(identifier.parent.type === 'MemberExpression' && identifier.parent.property === identifier && !identifier.parent.computed) &&
  */
  const notPropertyOfMemberExpression = !(t.isMemberExpression(parent) && path.parent.property === node)
  /*
      // not in an Array destructure pattern
  !(identifier.parent.type === 'ArrayPattern') &&
  */
  const notInArrayDestructure = !t.isArrayPattern(parent)
  /*
  // not in an Object destructure pattern
  !(identifier.parent.parent.type === 'ObjectPattern') &&
  */
  const notInObjectDestructure = !t.isObjectPattern(parent.parent)
  /*
  // skip globals + commonly used shorthands
  !globals[identifier.name] &&
  */
  const notGlobalShorthands = !globals[nodeName]
  /*
  // not already in scope
  !identifier.findScope(false).contains(identifier.name)
  */
  const notFunctionParam = !scope?.block.params?.find(node => node.name === nodeName)
  const notAlreadyInScope = !scope.bindings[nodeName] && notFunctionParam

  // TODO return directly
  const ret = (
    notRenderFunc
    && withinWith
    && notIdOfDeclaration
    && notParamsOfFunction
    && notPropertyOfMemberExpression
    && notKeyOfProperty
    && notInArrayDestructure
    && notInObjectDestructure
    && notGlobalShorthands
    && notAlreadyInScope
  )

  return ret
}

