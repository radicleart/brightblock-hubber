<template>
<div class="col-md-12">
  <h3><router-link :to="onlineAuctionUrl">{{auction.title}}</router-link></h3>
  <p>{{auction.description}}</p>
  <p>{{countdown}}</p>
  <div class="row pull-right">
    <div class="col-sm-12">
      <router-link :to="manageUrl">manage auction</router-link> |
      <router-link :to="onlineAuctionUrl">online auction</router-link>
    </div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleAuction',
  components: { },
  props: {
    auction: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  methods: {
    convertDate (date) {
      return moment(date).format()
    },
  },
  computed: {

    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    countdown () {
      let serverTime = this.$store.getters['serverTime']
      return utils.dt_Offset(serverTime, this.auction.startDate)
    },
    manageUrl () {
      return `/my-auctions/manage/${this.auction.auctionId}`
    },
    onlineAuctionUrl () {
      return `/online-auction/${this.auction.administrator}/${this.auction.auctionId}`
    },
  }
}
</script>
