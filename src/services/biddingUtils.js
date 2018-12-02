import utils from '@/services/utils'
import store from '@/storage/store'
import _ from 'lodash'

const biddingUtils = {

  bidSignal (amount, itemId, auctionId) {
    let serverTime = store.getters['serverTime']
    let myProfile = store.getters['myAccountStore/getMyProfile']
    let bid = {
      amount: amount,
      bidder: myProfile.username,
      ts: serverTime,
    }
    bid.signedBid = utils.signBitcoin(myProfile.privateKey, JSON.stringify(bid))

    let bidSignal = {
      bid: bid,
      username: myProfile.username,
      auctionId: auctionId,
      itemId: itemId
    }

    return bidSignal
  },

  bidStatusClass (item) {
    let statusClass = 'yellow-bg'
    try {
      let currentHighestBid = item.bids[item.bids.length - 1]
      if (currentHighestBid) {
        let myProfile = store.getters['myAccountStore/getMyProfile']
        if (currentHighestBid.bidder === myProfile.username) {
          statusClass = 'btn-success white'
        }
      }
      if (item.sellingStatus === 'selling') {
        // statusClass = 'grey-bg'
      }
    } catch (err) {
      statusClass = 'yellow-bg'
    }
    return statusClass
  },

  sellingMessage (item) {
    let sellingMessage = 'Item has been sold to the highest bidder.'
    try {
      if (item.bids && item.bids.length > 0) {
        let currentHighestBid = item.bids[item.bids.length - 1]
        let myProfile = store.getters['myAccountStore/getMyProfile']
        let userBids = item.bids.filter(bid => bid.bidder === myProfile.username)
        if (currentHighestBid.bidder === myProfile.username) {
          sellingMessage = 'Congratulations <br> you have won this item <br> please follow the instructions which will appear shortly.'
        } else if (userBids.length > 0) {
          sellingMessage = 'Your bid was not high enough <br> the next item will be open for bidding in a few moments.'
        }
      }
    } catch (err) {
      // no bids
    }
    return sellingMessage
  },

  usersBids (item, username) {
    if (item.bids && item.bids.length > 0) {
      let current = item.bids[item.bids.length - 1]
      return current.amount + item.increment
    } else {
      return item.increment
    }
  },

  nextBid (item) {
    if (item.bids && item.bids.length > 0) {
      let current = item.bids[item.bids.length - 1]
      return current.amount + item.increment
    } else {
      return item.increment
    }
  },

  currentBid (item) {
    if (item.bids && item.bids.length > 0) {
      let current = item.bids[item.bids.length - 1]
      return current.amount
    } else {
      return item.increment
    }
  },

  currentBidder (item) {
    if (item.bids && item.bids.length > 0) {
      let current = item.bids[item.bids.length - 1]
      return current.bidder
    } else {
      return ''
    }
  },

  // actions invoked directly by the administrator and broadcast out to watchers..\

  makeItemActive (auction, itemId) {
    try {
      for (let key in auction.items) {
        if (auction.items[key].itemId === itemId) {
          auction.items[key].inplay = true
        } else {
          auction.items[key].inplay = false
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  addBid (auction, itemId, bid) {
    let index = _.findIndex(auction.items, function (o) { return o.itemId === itemId })
    let bidIndex = _.findIndex(auction.items[index].bids, function (o) { return o.amount === bid.amount })
    if (bidIndex > -1) {
      console.log('Duplicate bid detected. Allow this for now but make sure bids are sorted by amount and timestamp!')
      bid.duplicate = true
      auction.items[index].bids.push(bid)
    }
    auction.items[index].bids.push(bid)
  },

  pauseBidding (auction, itemId) {
    let index = _.findIndex(auction.items, function (o) { return o.itemId === itemId })
    if (auction.items[index].paused) {
      auction.items[index].paused = false
    } else {
      auction.items[index].paused = true
    }
  },

}

export default biddingUtils
