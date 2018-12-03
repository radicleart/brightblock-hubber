'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  DEBUG_MODE: 'false',
  GAIA_HUB_URL: '"https://gaia.brightblock.org"',
})
