// ethStore.js
import xhrService from '@/services/xhrService'
import store from '@/storage/store'

const conversionStore = {
  namespaced: true,
  state: {
    fiatRates: {},
    cryptoRates: {}
  },
  getters: {
    getFiatRates: (state) => {
      return state.fiatRates
    },
    getFiatRate: (state, getters) => (currency) => {
      return state.fiatRates[currency]
    },
    getCryptoRate: (state, getters) => (pair) => {
      return state.cryptoRates[pair]
    },
  },
  mutations: {
    setCryptoRate (state, cryptoRate) {
      state.cryptoRates[cryptoRate.pair] = Number(cryptoRate.rate)
    },
    setFiatRates (state, fiatRates) {
      state.fiatRates = fiatRates
    }
  },
  actions: {
    fetchConversionData ({ commit, state }) {
      return new Promise((resolve, reject) => {
        store.dispatch('conversionStore/fetchFiatRates').then((fiatRates) => {
          commit('setFiatRates', fiatRates)
          store.dispatch('conversionStore/fetchShapeShiftCryptoRate', 'eth_btc').then((cryptoRate) => {
            commit('setCryptoRate', cryptoRate)
            resolve({fiatRates: state.fiatRates, 'eth_btc': cryptoRate})
          })
        })
      })
    },
    fetchFiatRates ({ commit, state }) {
      return new Promise((resolve, reject) => {
        xhrService.makeGetCall('/api/exchange/rates').then(function (data) {
          commit('setFiatRates', data.rates)
          resolve(data.rates)
        })
      })
    },
    fetchShapeShiftCryptoRate: function ({ commit, state }, pair) {
      return new Promise((resolve, reject) => {
        const url = store.state.constants.shapeShiftUrl + '/rate/' + pair
        xhrService.makeDirectCall(url).then(function (cryptoRate) {
          commit('setCryptoRate', cryptoRate)
          resolve(cryptoRate)
        })
      })
    },
  }
}
export default conversionStore
