'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEBUG_MODE: 'false',
  GAIA_HUB_URL: '"https://gaia.brightblock.org"',
})
