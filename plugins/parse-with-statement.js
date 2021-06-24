const t = require('@babel/types');

export const vueModelName = '_vm'
export const createEleName = '_h'
export const renderFuncName = '_c'
export const WithStatementReplaceComment = '__VUE_TEMPLATE_BABEL_COMPILER_WITH_PLACEHOLDER__'

export default function parseWithStatementToVm() {
  return {
    visitor: {
      WithStatement(path) {
        const withStatementReturnBody = path.node.body.body[0]
        t.addComment(withStatementReturnBody, "leading", WithStatementReplaceComment)
        path.replaceWithMultiple([withStatementReturnBody])
      }
    },
  };
}
