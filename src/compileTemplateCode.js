import {compileRenderCode} from "./compileRenderCode"

const compiler = require('vue-template-compiler')

function toFunction(code, isFunctional) {
  return `function (${isFunctional ? `_h,_vm` : ``}) {${code}}`
}
function getMarkRange(code, startMark, endMark) {
  if (!code || !code.indexOf) {
    // TODO handle edge error
    return false
  }
  return {
    start: code.indexOf(startMark) + 1,
    end: code.lastIndexOf(endMark)
  }
}
function getFunctionBody(code) {
  const range = getMarkRange(code, '{', '}')
  return code.substring(range.start, range.end)
}
function getArrayItems(code) {
  const range = getMarkRange(code, '[', ']')
  return code.substring(range.start, range.end)
    .split('function')
    .filter((functionBodyStr) => Boolean(functionBodyStr))
    .map(getFunctionBody)
}

const renderSeparator = '/* renderSeparator */'

export function compileTemplateCode(source, options) {
  const isFunctional = options?.transforms?.stripWithFunctional

  const {ast, render, staticRenderFns, tips, errors} = compiler.compile(source, options)

  // TODO rm semicolon && \n : https://babeljs.io/docs/en/options#minified
  let code = `var render = ${toFunction(render, isFunctional)}` + ';'+ renderSeparator
  const hasStaticRenders = staticRenderFns.length
  if (hasStaticRenders) {
    code += `var staticRenderFns = [${staticRenderFns.map((render) => toFunction(render, isFunctional))}]`
  }

  const [compiledRender, compiledStaticRenders] = compileRenderCode(code).split(renderSeparator)

  return {
    ast,
    render: getFunctionBody(compiledRender),
    staticRenderFns: hasStaticRenders ? getArrayItems(compiledStaticRenders) : staticRenderFns,
    tips,
    errors
  }
}
