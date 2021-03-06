import {shouldPrependVm} from "./utils/shouldPrependVM";
import {vueModelName, WithStatementReplaceComment} from "./constants/preservedNames";

const t = require('@babel/types');

const nestedVisitor = {
  Identifier(path) {
    if (shouldPrependVm(path)) {
      path.replaceWith(t.memberExpression(t.identifier(vueModelName), path.node))
    }
  }
};

export default function parseWithStatementToVm() {
  return {
    visitor: {
      WithStatement(path) {
        // only traverse children ast of `with(this) {...}` part,
        // just like the `identifier.program.inWith` of bubble's logic
        path.scope.addGlobal(t.identifier(vueModelName));
        path.traverse(nestedVisitor);
        const withStatementReturnBody = path.node.body.body[0]
        t.addComment(withStatementReturnBody, "leading", WithStatementReplaceComment)
        path.replaceWithMultiple([withStatementReturnBody])
      }
    },
  };
}
