// import eventBus from '@/services/eventBus'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import xhrService from '@/services/xhrService'

const SERVER_URL = process.env.ETH_GATEWAY_URL
const SHAPE_SHIFT_URL = process.env.SHAPE_SHIFT_URL

const conversionService = {
  connectExchangeRates: function (node) {
    let socket = new SockJS(SERVER_URL + '/exchanges')
    let stompClient = Stomp.over(socket)
    let connectSuccess = function (frame) {
      stompClient.subscribe('/topic/exchanges', function (response) {
        exchangeRatesService.fiatRates = JSON.parse(response.body)
      })
    }
    let connectError = function (error) {
      if (error.headers) {
        console.log('[SysadmOnly] WebSocket Error: ' + error)
      } else {
        console.log('[SysadmOnly] WebSocket Error: ' + error)
      }
    }
    stompClient.connect({}, connectSuccess, connectError)
  },
}
export default conversionService
