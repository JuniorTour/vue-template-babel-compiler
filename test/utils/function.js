export function toFunction(code) {
  code = transpile(addWrapperForTranspile(code))
  code = code.replace(/var __render__ = function \(\) \{/g, '').slice(0, -2)
  return new Function(code)
}
