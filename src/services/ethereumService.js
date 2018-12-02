import store from '@/storage/store'
import xhrService from '@/services/xhrService'
import Web3 from 'web3'

const ethereumService = {
  getWeb3: function () {
    if (typeof window.web3 !== 'undefined') {
      ethereumService.web3 = new Web3(window.web3.currentProvider)
    } else {
      // set the  provider you want from Web3.providers
      ethereumService.web3 = new Web3(new Web3.providers.HttpProvider(ethereumService.ETHEREUM_URI))
    }
    if (ethereumService.web3.isConnected()) {
      return ethereumService.web3
    }
    console.log('No connection to ethereum!')
  },
  loggedIn: function (success, failure) {
    let web3 = ethereumService.getWeb3()
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        failure({ERR_CODE: 'ES100', message: error})
      } else if (!accounts || accounts.length === 0) {
        failure({ERR_CODE: 'ES101', message: 'No accounts - not logged in to wallet'})
      } else {
        web3.eth.defaultAccount = accounts[0]
        success({accounts: accounts})
      }
    })
  },
  connectToBlockChain: function (clientState) {
    let web3 = ethereumService.getWeb3()
    return new Promise(resolve => {
      if (ethereumService.accounts && ethereumService.artmarketContract && ethereumService.myContract) {
        resolve(ethereumService.accounts)
      }
      web3.eth.getAccounts(function (error, result) {
        if (error) {
          resolve({failed: true, message: error})
        }
        store.commit('ethStore/ethereumClientState', clientState)
        web3.eth.defaultAccount = result[0]
        ethereumService.accounts = result
        ethereumService.artmarketContract = web3.eth.contract(JSON.parse(process.env.ETHEREUM_ABI))
        ethereumService.myContract = ethereumService.artmarketContract.at(clientState.contractAddress)
        resolve({failed: false, accounts: ethereumService.accounts})
      })
    })
  },
  getNetworkType: function () {
    let networkId = this.getWeb3().version.network
    let networkName = ''
    switch (networkId) {
      case '1':
        networkName = 'Main'
        break
      case '2':
        networkName = 'Morden'
        break
      case '3':
        networkName = 'Ropsten'
        break
      case '4':
        networkName = 'Rinkeby'
        break
      case '42':
        networkName = 'Kovan'
        break
      default:
        networkName = 'Unknown'
    }
    return {
      networkId: networkId,
      networkName: networkName
    }
  },
  registerOnChain: function (regData, success, failure) {
    let web3 = ethereumService.getWeb3()
    web3.eth.getAccounts(function (error, result) {
      if (error || !result | result.length === 0) {
        failure({failed: true, message: 'Please check you are logged in to meta mask - then try again?'})
      } else {
        web3.eth.defaultAccount = result[0]
        ethereumService.myContract.addItem(regData.title, regData.timestamp, regData.uploader, function (err, txId) {
          if (err) {
            failure({failed: true, message: err})
          } else {
            success({txId: txId})
          }
        })
      }
    })
  },
  setPriceOnChain: function (priceData, success, failure) {
    let web3 = ethereumService.getWeb3()
    web3.eth.getAccounts(function (error, result) {
      if (error || !result | result.length === 0) {
        failure({failed: true, message: 'Please check you are logged in to meta mask - then try again?'})
      } else {
        web3.eth.defaultAccount = result[0]
        ethereumService.myContract.sell(priceData.itemIndex, priceData.amountInWei, function (err, txId) {
          if (err) {
            console.log(err)
            failure({failed: true, message: err})
          } else {
            success({txId: txId})
          }
        })
      }
    })
  },
  purchase: function (priceData, success, failure) {
    ethereumService.loggedIn(function (result) {
      ethereumService.myContract.buy(priceData.itemIndex, priceData.buyer, {value: priceData.price}, function (err, txId) {
        if (err) {
          console.log(err)
          failure({ERR_CODE: 'ES110', message: err})
        } else {
          success({txId: txId})
        }
      })
    }, function (error) {
      failure(error)
    })
  },
  fetchClientState: function (success, failure) {
    xhrService.makeDirectCall(store.state.constants.ethGatewayUrl + '/api/ethereum/client')
      .then(function (response) {
        let clientState = response.details
        clientState.metaMaskNetwork = ethereumService.getNetworkType()
        success(clientState)
      }).catch(function (e) {
        failure(e)
      })
  },
  loadContract: function (contractAddress, success, failure) {
    xhrService.makeDirectCall(store.state.constants.ethGatewayUrl + '/api/ethereum/load/' + contractAddress)
      .then(function (response) {
        console.log('Contract loaded')
      }).catch(function (e) {
        console.log('Error loading contract: ' + e)
      })
  },
  subscribeBlockchainEvents: function (success, failure) {
    xhrService.makeDirectCall(store.state.constants.ethGatewayUrl + '/api/ethereum' + '/subscribe/blocks')
      .then(function (response) {
        success(response.details)
      }).catch(function (e) {
        failure(e)
      })
  },
  fetchBlockchainItems: function (success, failure) {
    xhrService.makeDirectCall(store.state.constants.ethGatewayUrl + '/api/ethereum' + '/fetch')
      .then(function (response) {
        success(response.details)
      }).catch(function (e) {
        failure(e)
      })
  },
  fetchBlockchainItem: function (data, success, failure) {
    xhrService.makeDirectCall(store.state.constants.ethGatewayUrl + '/api/ethereum' + '/fetch/' + data.timestamp)
      .then(function (response) {
        success(response.details)
      })
  },
  deployContract: function (regData, success, failure) {
    xhrService.makeDirectCall(store.state.constants.ethGatewayUrl + '/api/ethereum' + '/deploy')
      .then(function (response) {
        success(response.details)
      }).catch(function (e) {
        failure(e)
      })
  },
}
export default ethereumService
