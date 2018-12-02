import axios from 'axios'

const GRPC_SERVER_HOST = 'localhost'
const GRPC_SERVER_PORT = '8080'
const GRPC_SERVER_PROT = 'http'

/**
 *  The service is a client to the brightblock sever side grpc client.
**/
const lightningService = {
  makeCall: function (node, command, args) {
    let callInfo = {
      method: 'get',
      url: GRPC_SERVER_PROT + '://' + GRPC_SERVER_HOST + ':' + GRPC_SERVER_PORT + '/lnd/' + node + '/' + command,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    for (var key in args) {
      callInfo.url += '/' + args[key]
    }
    return new Promise(resolve => {
      axios.get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          resolve(response.data)
        })
        .catch(e => {
          console.log('Unable to fulfil request' + command, e)
          if (e.response && e.response.data) {
            resolve(e.response.data)
          } else {
            resolve(e.message)
          }
        })
    })
  },
  getNode: function (nodeName) {
    let node = { name: nodeName }
    return new Promise(function (resolve) {
      lightningService.makeCall(node.name, 'getInfo')
        .then(function (info) {
          if (node.name === 'alice') {
            node.peerAddress = 'localhost:10011'
            node.rpcAddress = 'localhost:10001'
          } else if (node.name === 'bob') {
            node.peerAddress = 'localhost:10012'
            node.rpcAddress = 'localhost:10002'
          }
          node.pubkey = info.identityPubkey_
          node.numPendingChannels = info.numPendingChannels_
          node.numActiveChannels = info.numActiveChannels_
          node.numPeers = info.numPeers_
          resolve(node)
        }).catch(function (e) {
          console.log('error get info for node: ' + node, e)
          resolve({error: 'Unable to create root file'})
        })
    })
  },
  getInfo: function () {
    return lightningService.makeCall('getInfo')
  },
  showInfo: function (nodeName, info) {
    if (info === 'listPeers') {
      return lightningService.makeCall(nodeName, 'listPeers')
    } else if (info === 'walletbalance') {
      return lightningService.makeCall(nodeName, 'walletbalance')
    } else if (info === 'pendingChannels') {
      return lightningService.makeCall(nodeName, 'pendingChannels')
    } else if (info === 'listChannels') {
      return lightningService.makeCall(nodeName, 'listChannels')
    } else if (info === 'closedChannels') {
      return lightningService.makeCall(nodeName, 'closedChannels')
    } else if (info === 'listInvoices') {
      return lightningService.makeCall(nodeName, 'listInvoices')
    }
  },
  addInvoice: function (nodeName, value, descriptionHash, memo) {
    return lightningService.makeCall(nodeName, 'addInvoice', [value, descriptionHash, memo])
  },
  describeGraph: function (nodeName) {
    return lightningService.makeCall(nodeName, 'describeGraph')
  },
  getNodeInfo: function (pubkey) {
    return lightningService.makeCall('getNodeInfo', [pubkey])
  },
  openChannel: function (name, pubkey, amt) {
    return lightningService.makeCall(name, 'openChannelSync', [pubkey, amt])
  },
  /**
   * addr Lightning address of the peer, in the format host:port
   * pubkey pub_key of the node to connect to.
  **/
  connectPeer: function (name, addr, pubkey) {
    return lightningService.makeCall(name, 'connect', [addr, pubkey])
  },
  /**
   *  pubkey pub_key of the node to connect to.
  **/
  disconnectPeer: function (name, pubKey) {
    return lightningService.makeCall(name, 'disconnect', [pubKey])
  },
}
export default lightningService
