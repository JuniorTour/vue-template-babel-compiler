import {renderCompiler} from "./renderCompiler"
import {extendTemplateCompiler} from "./templateCompiler"
import parseWithStatementToVm from "./plugins/parse-with-statement";

// vue-es2015-compiler substitution:
const transpile = renderCompiler

// enhance vue-template-compiler with babel:
extendTemplateCompiler(transpile)

// babel prepend vm plugin:
transpile.parseWithStatementToVmPlugin = parseWithStatementToVm

module.exports = transpile
