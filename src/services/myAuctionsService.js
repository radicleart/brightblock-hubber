import {
  getFile,
  putFile,
} from 'blockstack'
import moment from 'moment'
import store from '@/storage/store'
import _ from 'lodash'
import searchIndexService from '@/services/searchIndexService'

const myAuctionsService = {

  setAuctionsRootFile: function (rootFile) {
    const auctionsRootFileName = store.state.constants.auctionsRootFileName
    return putFile(auctionsRootFileName, JSON.stringify(rootFile), {encrypt: false})
  },

  getAuctionsRootFile: function (success, failure) {
    const auctionsRootFileName = store.state.constants.auctionsRootFileName
    getFile(auctionsRootFileName, {decrypt: false}).then(function (file) {
      if (!file) {
        var now = moment({}).valueOf()
        let newRootFile = {
          created: now,
          auctions: []
        }
        putFile(auctionsRootFileName, JSON.stringify(newRootFile), {encrypt: false}).then(function (message) {
          success(newRootFile)
        })
      } else {
        let rootFile = JSON.parse(file)
        if (rootFile.auctions) {
          rootFile.records = rootFile.auctions
          rootFile.auctions = undefined
          putFile(auctionsRootFileName, JSON.stringify(rootFile), {encrypt: false})
        } else if (!rootFile.records) {
          rootFile.records = []
          putFile(auctionsRootFileName, JSON.stringify(rootFile), {encrypt: false})
        }
        success(rootFile)
      }
    }).catch(function (e) {
      failure({ERR_CODE: 'AUCTIONS_1', message: 'Error fetching auctions root file!'})
    })
  },

  getMyAuctions: function (success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        success(rootFile.records)
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_2', message: 'Error fetching auctions root file!'})
      })
  },

  getMyAuction: function (auctionId, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.records, function (o) { return o.auctionId === auctionId })
        success(rootFile.records[index])
      },
      function () {
        failure({ERR_CODE: 'AUCTIONS_3', message: 'Error fetching auctions root file!'})
      })
  },

  updateAuction: function (auction, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.records, function (o) { return o.auctionId === auction.auctionId })
        if (index > -1) {
          rootFile.records.splice(index, 1, auction)
          myAuctionsService.setAuctionsRootFile(rootFile).then(function (message) {
            if (auction.privacy === 'private') {
              searchIndexService.removeRecord('id', auction.auctionId)
            } else {
              searchIndexService.addRecord('auction', auction)
            }
            success(auction)
          })
        } else {
          failure({ERR_CODE: 'AUCTIONS_2', message: 'Not found: ' + auction.auctionId})
        }
      },
      function (error) {
        failure(error)
      })
  },

  deleteMyAuction: function (auctionId, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        let index = _.findIndex(rootFile.records, function (o) {
          return o.auctionId === auctionId
        })
        if (index > -1) {
          rootFile.records.splice(index, 1)
          myAuctionsService.setAuctionsRootFile(rootFile).then(function (message) {
            searchIndexService.removeRecord('id', auctionId).then((message) => {
              success(auctionId)
            })
          })
        } else {
          failure({ERR_CODE: 'AUCTIONS_2', message: 'Not found: ' + auctionId})
        }
      },
      function (error) {
        failure(error)
      })
  },

  uploadAuction: function (auction, success, failure) {
    myAuctionsService.getAuctionsRootFile(
      function (rootFile) {
        rootFile.records.splice(0, 0, auction)
        myAuctionsService.setAuctionsRootFile(rootFile).then(function (message) {
          searchIndexService.addRecord('auction', auction).then((message) => {
            if (auction.privacy === 'public') {
              searchIndexService.addRecord('auction', auction)
            }
            success(auction)
          })
        })
      },
      function (error) {
        failure(error)
      })
  },

  reindex: function (success, failure) {
    myAuctionsService.getAuctionsRootFile(function (rootFile) {
      searchIndexService.indexUser().then((message) => {
        console.log(message)
        success(message)
      })
    },
    function () {
      failure({ERR_CODE: 'AUCTIONS_10', message: 'Error adding the auction to the public index!'})
    })
  },

  makePublic: function (auction, success, failure) {
    auction.privacy = 'public'
    myAuctionsService.updateAuction(auction, function (auction) {
      success('Auction is public')
    },
    function () {
      failure({ERR_CODE: 'AUCTIONS_10', message: 'Error adding the auction to the public index!'})
    })
  },

  makePrivate: function (auction, success, failure) {
    auction.privacy = 'private'
    myAuctionsService.updateAuction(auction, function (auction) {
      success('Auction is private')
    },
    function () {
      failure({ERR_CODE: 'AUCTIONS_11', message: 'Error removing the auction from the public index!'})
    })
  },
}
export default myAuctionsService
