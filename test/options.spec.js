import {mergeOptions} from "../src/utils/merge";

const parseWithStatementToVm = () => {}

// #30
test('should merge options for babel', () => {
  const oldOptions = {
    filename: 'VueTemplateBabelCompiler',
    // not enable strict mode, in order to parse WithStatement
    sourceType: 'script',
    assumptions: {
      setComputedProperties: true,
      arrayLikeIsIterable: true,
    },
    plugins: [
      '@babel/plugin-transform-computed-properties',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-transform-block-scoping',
      '@babel/plugin-transform-destructuring',
      "@babel/plugin-transform-spread",
      ["@babel/plugin-proposal-object-rest-spread", { loose: true, useBuiltIns: true }],
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-transform-parameters',
      parseWithStatementToVm,
    ],
  }

  const additionalOptions = {
    filename: 'newFilename',
    newProp: true,
    assumptions: {
      additional: 'additional'
    },
    plugins: [
      'newPlugin'
    ]
  }

  const newOptions = mergeOptions(
    oldOptions,
    additionalOptions,
  )

  expect(newOptions.assumptions.additional).toMatch(additionalOptions.assumptions.additional)
  expect(newOptions.plugins.length).toEqual(oldOptions.plugins.length+1)
  expect(newOptions.plugins[9]).toEqual(oldOptions.plugins[9])
  expect(newOptions.filename).toEqual(additionalOptions.filename)
  expect(newOptions.newProp).toEqual(additionalOptions.newProp)
})
