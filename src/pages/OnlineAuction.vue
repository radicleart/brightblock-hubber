<template>
<section>
  <div class="container">
    <div class="row">
      <div class="col-md-12 pt-5">
        <h1 class="innerpage">{{auction.title}} <span>({{artworksSize}} items)</span></h1>
        <p>{{auction.description}}</p>
        <p>{{countdown}}</p>
        <div class="row">
          <div class="col-md-6">
            <hammer-item :item="hammerItem" :auctionId="auctionId"/>
          </div>
          <div class="col-md-6">
            <div class="row" v-if="winning.length > 0">
              <div class="col-md-12">
                <h4>Won items</h4>
                <p v-for="(item, index) of winning" :key="index">
                  {{item.itemId}}
                </p>
              </div>
            </div>
            <watchers-stream :auctionId="auctionId"/>
            <video-stream :canPublish="false"/>
            <message-stream :auctionId="auctionId" :administrator="false"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="artworksSize > 0">
      <div class="col-sm-12">
        <h4>Next Items</h4>
        <ul class="list-unstyled">
          <single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId"/>
        </ul>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import WatchersStream from '@/components/rtc/WatchersStream'
import SingleAuctionItem from '@/components/auctions/SingleAuctionItem'
import HammerItem from '@/components/auctions/HammerItem'
import MessageStream from '@/components/rtc/MessageStream'
import VideoStream from '@/components/rtc/VideoStream'
import utils from '@/services/utils'
import peerToPeerService from '@/services/peerToPeerService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'OnlineAuction',
  components: { WatchersStream, SingleAuctionItem, HammerItem, VideoStream, MessageStream },
  data () {
    return {
      auctionId: null,
      username: null
    }
  },
  beforeDestroy () {
    peerToPeerService.disconnect()
  },
  created () {
    window.addEventListener('beforeunload', this.stopPublishing)
    this.auctionId = Number(this.$route.params.auctionId)
    this.$store.dispatch('myAccountStore/fetchMyAccount').then((myProfile) => {
      this.username = myProfile.username
      this.$store.dispatch('onlineAuctionsStore/fetchOnlineAuction', this.auctionId).then((auction) => {
        try {
          peerToPeerService.startSession(myProfile.username, auction.auctionId)
        } catch (e) {
          console.log(e)
        }
      })
    })
  },
  methods: {
    myUsername () {
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      if (myProfile) {
        return myProfile.username
      } else {
        return ''
      }
    },
  },
  computed: {
    auction () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      if (auction) {
        return auction
      } else {
        return {}
      }
    },
    administrator () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      if (auction) {
        return auction.administrator
      } else {
        return {}
      }
    },
    winning () {
      let winning = this.$store.getters['onlineAuctionsStore/getWinning']({auctionId: this.auctionId, username: this.username})
      return winning
    },
    sellingItems () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      if (auction && auction.items) {
        let following = auction.items.filter(item => !item.inplay)
        return following
      } else {
        return []
      }
    },
    hammerItem () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      if (auction && auction.items) {
        let hammerItems = auction.items.filter(item => item.inplay)
        if (hammerItems && hammerItems.length === 1) {
          return hammerItems[0]
        }
      }
      return {}
    },
    peers () {
      return this.$store.getters['onlineAuctionsStore/getPeers']
    },
    artworksSize () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      return (auction && auction.items) ? auction.items.length : 0
    },
    countdown () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      let serverTime = this.$store.getters['serverTime']
      return (auction) ? utils.dt_Offset(serverTime, auction.startDate) : '?'
    },
  },
}
</script>
