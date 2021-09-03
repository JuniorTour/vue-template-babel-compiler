import {renderCompiler} from "./renderCompiler"

const templateCompiler = require('vue-template-compiler')

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

export function compileTemplate(source, options) {
  const isFunctional = options?.filename
    ?.includes(options?.functionalComponentFileIdentifier || '.functional')

  const {ast, render, staticRenderFns, tips, errors} = templateCompiler.compile(source, options)

  // TODO rm semicolon && \n : https://babeljs.io/docs/en/options#minified
  let code = `var render = ${toFunction(render, isFunctional)}` + ';'+ renderSeparator
  const hasStaticRenders = staticRenderFns.length
  if (hasStaticRenders) {
    code += `var staticRenderFns = [${staticRenderFns.map((render) => toFunction(render, isFunctional))}]`
  }

  const [compiledRender, compiledStaticRenders] = renderCompiler(code, {transforms: {stripWithFunctional: isFunctional}}).split(renderSeparator)

  return {
    ast,
    render: getFunctionBody(compiledRender),
    staticRenderFns: hasStaticRenders ? getArrayItems(compiledStaticRenders) : staticRenderFns,
    tips,
    errors
  }
}

export function extendTemplateCompiler(obj) {
  for (const key in templateCompiler) {
    obj[key] = templateCompiler[key]
  }
  obj.ssrCompile = compileTemplate
  obj.compile = compileTemplate
}
