'use strict'
const abi = require('./abi/ArtMarket')
console.log(abi)

module.exports = {
  NODE_ENV: '"production"',
  DEBUG_MODE: 'false',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  ETH_GATEWAY_URL: '"https://api.brightblock.org"',
  SEARCH_INDEX_URL: '"https://search.brightblock.org"',
  GAIA_HUB_URL: '"https://gaia.brightblock.org"',
  ETHEREUM_NETWORK: '"Ropsten (3)"',
  ETHEREUM_ABI: '\'' + JSON.stringify(abi) + '\'',
}
