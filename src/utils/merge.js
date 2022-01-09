const merge = require('deepmerge')

export function mergeOptions(oldOptions, newOptions) {
  return merge(oldOptions, newOptions)
}
