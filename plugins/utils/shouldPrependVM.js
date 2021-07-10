/*
Interpret Bubble's logic:
https://github.com/yyx990803/buble/blob/f5996c9cdb2e61cb7dddf0f6c6f25d0f3f600055/src/utils/prependVm.js
*/
import {createEleName, renderFuncName, vueModelName} from "../parse-with-statement";
import globals from './globals'
const t = require('@babel/types');

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
  // TODO FIXME var _excluded = ["a"], _excluded2 = ["x", "y"];
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

export function shouldPrependVmNew(path) {
  const parent = path.parent
  const node = path.node
  const nodeName = node.name
  const scope = path.scope

  if (!t.isProgram(scope.path)
    && !(t.isVariableDeclarator(parent) && nodeName === RENDER_NAME)
    && notPreserveName(nodeName) && withinRenderFunc(scope.path)
    // not id of a Declaration:
    && !t.isVariableDeclarator(parent)
    // not a params of a function
    && !(t.isFunctionExpression(parent) && parent.params.indexOf(node) > -1)
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

