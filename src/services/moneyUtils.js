import _ from 'lodash'
import store from '@/storage/store'

const moneyUtils = {

  convertPrices (artwork, blockchainItem) {
    if (!blockchainItem) {
      return
    }
    if (!artwork.bcitem) {
      artwork.bcitem = {}
    }
    let priceInWei = blockchainItem.price
    let precision = 1000000000000000000
    let priceInEth = priceInWei / precision
    let fiatCurrency = artwork.saleData.fiatCurrency
    if (!fiatCurrency) {
      fiatCurrency = 'EUR'
    }
    let fiatToBtc = 0
    let ethToBtc = 0
    let priceInBtc = 0
    let priceInFiat = 0
    let symbol = '?'

    let fiatRate = store.getters['conversionStore/getFiatRate'](fiatCurrency)
    if (fiatRate) {
      fiatToBtc = fiatRate['15m']
      ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
      priceInBtc = priceInEth * ethToBtc
      priceInFiat = priceInBtc * fiatToBtc
      symbol = fiatRate.symbol
    }

    _.merge(artwork.bcitem, blockchainItem)
    artwork.bcitem.fiatCurrency = fiatCurrency
    artwork.bcitem.fiatCurrencySymbol = symbol
    artwork.bcitem.priceInEth = Math.round(priceInEth * 100000) / 100000
    artwork.bcitem.priceInFiat = Math.round(priceInFiat * 100) / 100
    artwork.bcitem.priceInBtc = Math.round(priceInBtc * 100000) / 100000
  },

  conversionMessage (currency) {
    try {
      let fiatRate = store.getters['conversionStore/getFiatRate'](currency)
      let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
      let fiatToBtc = fiatRate['15m']
      let symbol = fiatRate['symbol']
      fiatToBtc = Math.round(fiatRate['15m'] * 100) / 100
      let fiatToEther = fiatRate['15m'] * ethToBtc
      let conversionMessage = '1 Bitcoin = ' + fiatToBtc + ' ' + symbol + ' / 1 Ether = ' + fiatToEther + ' ' + symbol
      return conversionMessage
    } catch (err) {
      console.log('Warning - data not yet initialised..')
      return ''
    }
  },

  currencySymbol (currency) {
    try {
      let fiatRate = store.getters['conversionStore/getFiatRate'](currency)
      return fiatRate['symbol']
    } catch (err) {
      // Rates not yet synced with server. Not a concern as reactive ui is notified when they arrive.
      return ''
    }
  },

  valueInEther (currency, amount) {
    try {
      let precision = 100000000
      let fiatRate = store.getters['conversionStore/getFiatRate'](currency)
      let conversion = fiatRate['15m']
      let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
      conversion = conversion * ethToBtc
      if (typeof amount === 'string') {
        amount = Number(amount)
      }
      if (typeof amount === 'number') {
        conversion = amount / conversion
      }
      return Math.round(conversion * precision) / precision
    } catch (err) {
      console.log('Warning - data not yet initialised..')
      return 0
    }
  },

  valueInEtherFromWei (wei) {
    try {
      let precision = 100000000
      let eth = wei / 1000000000000000000
      return Math.round(eth * precision) / precision
    } catch (err) {
      console.log('Warning - data not yet initialised..')
      return 0
    }
  },

  valueInBitcoinFromWei (wei) {
    try {
      let precision = 100000000
      let valueInEther = moneyUtils.valueInEtherFromWei(wei)
      let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
      return Math.round(valueInEther * ethToBtc * precision) / precision
    } catch (err) {
      console.log('Warning - data not yet initialised..')
      return 0
    }
  },

  valueInWei (currency, amount) {
    let valueInEther = moneyUtils.valueInEther(currency, amount)
    return Math.trunc(valueInEther * 1000000000000000000)
  },

  valueInBitcoin (currency, amount) {
    try {
      let fiatToBtc = 0
      let precision = 100000000
      let fiatRate = store.getters['conversionStore/getFiatRate'](currency)
      let btcToFiat = fiatRate['15m']
      if (typeof amount === 'string') {
        amount = Number(amount)
      }
      if (typeof amount === 'number') {
        fiatToBtc = amount / btcToFiat
      }
      return Math.round(fiatToBtc * precision) / precision
    } catch (err) {
      console.log('Warning - data not yet initialised..')
      return 0
    }
  },

  buildInitialSaleData () {
    return {
      soid: 0,
      amount: 0,
      reserve: 0,
      increment: 0,
      fiatCurrency: 'EUR',
      initialRateBtc: 0,
      initialRateEth: 0,
      amountInEther: 0,
      auctionId: undefined,
    }
  },

  buildSaleDataFromUserInput (auctionId, currency, userSaleData) {
    try {
      let fiatRate = store.getters['conversionStore/getFiatRate'](currency)
      let ethToBtc = store.getters['conversionStore/getCryptoRate']('eth_btc')
      let saleData = {}
      saleData.soid = (auctionId) ? 2 : 1
      saleData.amount = Number(userSaleData.amount)
      saleData.reserve = Number(userSaleData.reserve)
      saleData.increment = Number(userSaleData.increment)
      saleData.fiatCurrency = currency
      saleData.initialRateBtc = fiatRate['15m']
      saleData.initialRateEth = ethToBtc
      saleData.amountInEther = moneyUtils.valueInEther(currency, saleData.amount, 100000000)
      saleData.auctionId = auctionId
      return saleData
    } catch (err) {
      console.log('Warning - data not yet initialised..')
      return {
        soid: -1
      }
    }
  }
}

export default moneyUtils
