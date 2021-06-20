var babel = require("@babel/core");
const t = babel.types

export const vueModelName = '_vm'
export const createEleName = '_h'
export const renderFuncName = '_c'

export default function parseWithStatementToVm() {
  return {
    visitor: {
      WithStatement(path) {
        const curNodeBody = path.node.body.body[0]
        path.replaceWithMultiple([
          t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier(vueModelName),
              t.thisExpression()
            ),
          ]),
          t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier(createEleName),
              t.memberExpression(t.identifier(vueModelName), t.identifier('$createElement'))
            ),
          ]),
          t.variableDeclaration('var', [
            t.variableDeclarator(t.identifier(renderFuncName),
              t.logicalExpression(
                '||',
                t.memberExpression(
                  t.memberExpression(t.identifier(vueModelName), t.identifier('_self')),
                  t.identifier(renderFuncName)
                ),
                t.identifier(createEleName)
              ),
            ),
          ]),
          curNodeBody,
        ])
      }
    },
  };
}
