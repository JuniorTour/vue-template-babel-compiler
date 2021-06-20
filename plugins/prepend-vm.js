import {shouldPrependVmNew} from "./utils/shouldPrependVM";
import {vueModelName} from "./parse-with-statement";
var babel = require("@babel/core");
const t = babel.types

export default function prependVm() {
    return {
        visitor: {
            Identifier(path) {
                if (shouldPrependVmNew(path)) {
                    path.replaceWith(t.memberExpression(t.identifier(vueModelName), path.node))
                }
            },
        },
    };
}
