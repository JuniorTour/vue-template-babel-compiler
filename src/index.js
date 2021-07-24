import {compileRenderCode} from "./compileRenderCode"
import {compileTemplateCode} from "./compileTemplateCode"

module.exports = function(source, options) {
  let ret = {}
  const compileRenderMode = Boolean(options?.transforms)

  if (compileRenderMode) {
    ret = compileRenderCode(source, options)
  } else {
    ret = compileTemplateCode(source, options)
  }

  return ret
}
