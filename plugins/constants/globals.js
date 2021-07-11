// allowed globals in Vue render functions.
// TODO add option to customize
const GLOBALS_IN_TEMPLATE = [
  "BigInt",
  "Infinity",
  "undefined",
  "NaN",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Math",
  "Number",
  "Date",
  "Array",
  "Object",
  "Boolean",
  "String",
  "RegExp",
  "Map",
  "Set",
  "JSON",
  "Intl",
  "require",
  "arguments",
  "_vm",
  "_h",
  "_c"
]

const hash = Object.create(null)
GLOBALS_IN_TEMPLATE.forEach(name => {
  hash[name] = true
})

export default hash
