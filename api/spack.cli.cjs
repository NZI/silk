
const spackConfig = require('./spack.config.cjs')

module.exports = spackConfig({
  cli: __dirname + '/src/cli.ts'
})