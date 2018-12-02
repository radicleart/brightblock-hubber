'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  DEBUG_MODE: 'false',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  ETH_GATEWAY_URL: '"https://staging-api.brightblock.org"',
  SEARCH_INDEX_URL: '"https://search.brightblock.org"',
  GAIA_HUB_URL: '"https://gaia.brightblock.org"',
  ETHEREUM_NETWORK: '"Rinkby (4)"',
  ETHEREUM_ABI: '\'' + JSON.stringify(abi) + '\'',
})
