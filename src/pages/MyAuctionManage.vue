<template>
<section>
  <div class="container">
    <div class="row">
      <div class="col-md-12 pt-5">
        <h1 class="innerpage">{{auction.title}} <span>({{auction.items.length}} items)</span></h1>
        <p>{{auction.description}}</p>
        <p>{{countdown}}</p>
        <div class="row">
          <div class="col-md-6">
            <hammer-item :item="hammerItem" :admin="true" :auctionId="auctionId"/>
          </div>
          <div class="col-md-6">
            <div class="row" v-if="winning.length > 0">
              <div class="col-md-12">
                <ul>
                  <li><router-link :to="updateUrl">edit</router-link></li>
                  <li><router-link :to="onlineAuctionUrl">public auction</router-link></li>
                  <!-- <li><a href="#" @click="deleteAuction()">delete</a></li> -->
                  <li v-if="auction.privacy === 'private'"><span><a href="#" @click="makePublic()">make public</a></span></li>
                  <li v-else><span><a href="#" @click="makePrivate()">make private</a></span></li>
                </ul>
                <h4>Won items</h4>
                <p v-for="(item, index) of winning" :key="index">
                  {{item.itemId}}
                </p>
              </div>
            </div>
            <watchers-stream :auctionId="auctionId"/>
            <video-stream :canPublish="true"/>
            <message-stream :auctionId="auctionId" :admin="true"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h4>Selling Items ({{sellingItemsSize}})</h4>
        <ul class="list-unstyled">
          <my-single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="true"/>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h4>Available Items</h4>
        <ul class="list-unstyled">
          <my-single-auction-item class="auction-item-container" v-for="(item, index) of availableItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="false"/>
        </ul>
      </div>
    </div>

  </div>
</section>
</template>

<script>
import WatchersStream from '@/components/rtc/WatchersStream'
import MessageStream from '@/components/rtc/MessageStream'
import VideoStream from '@/components/rtc/VideoStream'
import MySingleAuction from '../components/auctions/MySingleAuction'
import MySingleAuctionItem from '../components/auctions/MySingleAuctionItem'
import utils from '@/services/utils'
import notify from '@/services/notify'
import peerToPeerService from '@/services/peerToPeerService'
import eventBus from '@/services/eventBus'
import HammerItem from '@/components/auctions/HammerItem'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctionManage',
  components: { WatchersStream, HammerItem, MySingleAuction, MySingleAuctionItem, VideoStream, MessageStream },
  data () {
    return {
      auctionId: null
    }
  },
  beforeDestroy () {
    peerToPeerService.disconnect()
    eventBus.$off('signal-in-message')
  },
  created () {
    this.auctionId = Number(this.$route.params.auctionId)
    this.$store.dispatch('myAccountStore/fetchMyAccount').then((myProfile) => {
      this.$store.dispatch('myAuctionsStore/fetchMyAuction', this.auctionId).then((auction) => {
        // this.auction = auction
        try {
          this.$store.commit('onlineAuctionsStore/onlineAuction', auction)
          peerToPeerService.startSession(myProfile.username, auction.auctionId)
        } catch (e) {
          console.log(e)
        }
      })
    })
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
    deleteAuction () {
      this.$store.dispatch('myAuctionsStore/deleteMyAuction', this.auctionId)
    },
    makePublic () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      auction.privacy = 'public'
      this.$store.dispatch('myAuctionsStore/makePublic', auction)
      notify.info({title: 'Manage Auction', text: auction.title + ' is now public and can be found by others via search results.'})
    },
    makePrivate () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      auction.privacy = 'private'
      this.$store.dispatch('myAuctionsStore/makePrivate', auction)
      notify.info({title: 'Manage Auction', text: auction.title + ' is now private and can not be found by other users.'})
    },
  },
  computed: {
    sellingItemsSize () {
      let sellingItems = this.$store.getters['myArtworksStore/auctioning'](this.auctionId)
      return sellingItems.length
    },
    winning () {
      let winning = this.$store.getters['onlineAuctionsStore/getWinning']({auctionId: this.auctionId, username: this.username})
      return winning
    },
    countdown () {
      let auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      let serverTime = this.$store.getters['serverTime']
      return (auction) ? utils.dt_Offset(serverTime, auction.startDate) : '?'
    },
    auction () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      if (!auction || !auction.auctionId) {
        auction = {
          items: []
        }
      }
      return auction
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    updateUrl () {
      return `/my-auctions/update/${this.auctionId}`
    },
    hammerItem () {
      let hammerItem = {}
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      if (auction && auction.items) {
        let hammerItems = auction.items.filter(item => item.inplay)
        if (hammerItems && hammerItems.length === 1) {
          hammerItem = hammerItems[0]
        }
      }
      return hammerItem
    },
    availableItems () {
      let available = this.$store.getters['myArtworksStore/available'](this.auctionId)
      if (available && available.length > 0) {
        let items = []
        for (let key in available) {
          items.push({
            itemId: available[key].id
          })
        }
        return items
      } else {
        return []
      }
    },
    sellingItems () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      if (auction && auction.items) {
        let following = auction.items.filter(item => !item.inplay)
        return following
      } else {
        return []
      }
    },
    onlineAuctionUrl () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      if (auction) {
        return `/online-auction/${auction.administrator}/${this.auctionId}`
      } else {
        return '/'
      }
    },
  },
}
</script>
