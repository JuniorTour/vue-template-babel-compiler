import {extendTemplateCompiler} from "./templateCompiler"

// vue-es2015-compiler substitution:
const transpile = {}

// enhance vue-template-compiler with babel:
extendTemplateCompiler(transpile)

module.exports = transpile
