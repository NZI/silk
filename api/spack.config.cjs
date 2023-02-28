const { config } = require('@swc/core/spack')
const pkgJson = require('./package.json')

module.exports = (entry) => config({
  target: "node",
  options: {
    sourceMaps: false,
    minify: false,
    jsc: {
      minify: {
        compress: {
          unused: false
        },
        mangle: false
      },

      parser: {
        syntax: "typescript",
        jsx: false,
        dynamicImport: false,
        privateMethod: true,
        functionBind: false,
        exportDefaultFrom: false,
        exportNamespaceFrom: false,
        decorators: true,
        decoratorsBeforeExport: false,
        topLevelAwait: false,
        importMeta: false,
        preserveAllComments: false
      },

    }
  },
  entry,
  output: {
    path: __dirname + '/dist'
  },
  module: {
  },
  externalModules: [
    ...Object.keys(pkgJson.dependencies),
    ...Object.keys(pkgJson.devDependencies),
  ]
})