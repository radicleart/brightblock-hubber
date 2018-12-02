'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const abi = require('./abi/ArtMarket')
console.log(abi)

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEBUG_MODE: 'false',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  ETH_GATEWAY_URL: '"http://localhost:8191"',
  SEARCH_INDEX_URL: '"http://localhost:8193"',
  GAIA_HUB_URL: '"http://localhost:8195"',
  ETHEREUM_NETWORK: '"Ganache"',
  ETHEREUM_ABI: '\'' + JSON.stringify(abi) + '\'',
})
