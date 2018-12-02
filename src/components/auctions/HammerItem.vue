<template>
<div class="row">
  <set-final-bid-price :item="item" :amount="currentBid" :auctionId="auctionId" data-toggle="modal" data-target="#setFinalBidPriceModal"/>
  <div class="col-sm-12">
    <h4>{{artwork.title}}</h4>
    <p>Current Bid: {{currentBidder}} {{currencySymbol}} {{currentBid}} {{item.fiatCurrency}}</p>
    <img :src="artwork.image" :alt="artwork.title" class="img-fluid" style="max-width: 350px"/>
  </div>
  <div class="col-sm-12" v-if="inplay">
    <button
          class="btn btn-block black action-button text-uppercase" :class="bidStatusClass"
          :disabled="paused || item.paused || item.sellingStatus === 'selling'"
          style="max-width: 350px"
          @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</button>
    <button
          v-if="showSetFinalPriceButton"
          class="btn btn-block yellow-bg black action-button text-uppercase mt-3"
          style="max-width: 350px" v-bind:data-artwork="artwork.id"
          data-toggle="modal"
          data-target="#setFinalBidPriceModal">Sell ({{currentBid}})</button>
    <p v-if="selling && !admin" class="center-block text-center mt-3" v-html="sellingMessage"></p>
    <p v-if="item.sellingStatus === 'selling' && artwork.bcitem">confirming...{{artwork.bcitem.itemIndex}}, {{artwork.bcitem.status}}, {{artwork.bcitem.price}}</p>
    <button v-if="item.sellingStatus === 'selling'" class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 350px" v-on:click="openSetFinalBidPriceDialog">Confirm Price</button>
    <button class="btn btn-block yellow-bg black action-button text-uppercase" style="max-width: 350px" v-on:click="pauseBidding"><span v-if="item.paused">Unpause</span><span v-else>Pause</span> Bidding</button>
  </div>
</div>
</template>

<script>
import SetFinalBidPrice from './SetFinalBidPrice'
import peerToPeerService from '@/services/peerToPeerService'
import moneyUtils from '@/services/moneyUtils'
import biddingUtils from '@/services/biddingUtils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'HammerItem',
  components: { SetFinalBidPrice },
  props: {
    auctionId: null,
    admin: false,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      setFinalBidPriceActive: false,
      paused: false
    }
  },
  methods: {
    openSetFinalBidPriceDialog (value) {
      this.setFinalBidPriceActive = true
    },
    pauseBidding () {
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      let message = 'Pausing the auction to wait for bidders to catch up...'
      if (this.item.paused) {
        message = 'Ready to go again now...'
      }
      let messageData = {
        content: message,
        username: myProfile.username,
        auctionId: this.auctionId
      }
      this.$store.commit('myAuctionsStore/messageEvent', messageData)

      let data = {
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      }
      this.$store.commit('myAuctionsStore/pauseItemEvent', data)
    },
    closeDialog (value) {
      this.setFinalBidPriceActive = false
    },
    bid (amount) {
      let $self = this
      setTimeout(function () {
        $self.paused = false
        // $self.$forceUpdate()
      }, 2000)
      this.paused = true
      let bidSignal = biddingUtils.bidSignal(amount, this.item.itemId, this.auctionId)
      if (this.admin) {
        this.$store.commit('myAuctionsStore/sendBidEvent', bidSignal)
      } else {
        peerToPeerService.sendPeerSignal({
          type: 'wa-bid-send-adm',
          data: bidSignal
        })
      }
    },
  },
  computed: {
    artwork () {
      if (!this.item.itemId) {
        return {
          title: 'no artwork under the hammer right now',
          image: '/static/images/artwork1.jpg'
        }
      }
      return this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
    },
    bidStatusClass () {
      return biddingUtils.bidStatusClass(this.item)
    },
    showSetFinalPriceButton () {
      return this.admin && this.item.paused && this.item.sellingStatus !== 'selling'
    },
    selling () {
      return (this.item.sellingStatus === 'selling')
    },
    sellingMessage () {
      return biddingUtils.sellingMessage(this.item)
    },
    inplay () {
      return (this.item.itemId)
    },
    currencySymbol () {
      return moneyUtils.currencySymbol(this.item.fiatCurrency)
    },
    nextBid () {
      return biddingUtils.nextBid(this.item)
    },
    currentBid () {
      return biddingUtils.currentBid(this.item)
    },
    currentBidder () {
      return biddingUtils.currentBidder(this.item)
    },
  }
}
</script>
