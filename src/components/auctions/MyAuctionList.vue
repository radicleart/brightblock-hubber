<template>
<div class="col-sm-12 pt-5">
  <h1 class="innerpage">My Auctions <span>({{myAuctionsFutureCount}})</span></h1>
  <ul class="list-unstyled">
    <my-single-auction v-for="(auction, index) of myAuctionsFuture" :key="index" :auction="auction"/>
  </ul>
  <h1 class="innerpage"></h1>
  <h1 class="innerpage">Past Auctions <span>({{myAuctionsPastCount}})</span></h1>
  <ul class="list-unstyled">
    <my-single-auction v-for="(auction, index) of myAuctionsPast" :key="index" :auction="auction"/>
  </ul>
</div>
</template>

<script>
import utils from '@/services/utils'
import MySingleAuction from './MySingleAuction'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'AuctionList',
  components: { MySingleAuction },
  props: {
  },
  methods: {
    startsIn (date) {
      return utils.dt_Offset(date)
    },
  },
  computed: {
    myAuctionsFuture () {
      return this.$store.getters['myAuctionsStore/myAuctionsFuture']
    },
    myAuctionsPast () {
      return this.$store.getters['myAuctionsStore/myAuctionsPast']
    },
    myAuctionsFutureCount () {
      return this.$store.getters['myAuctionsStore/myAuctionsFutureCount']
    },
    myAuctionsPastCount () {
      return this.$store.getters['myAuctionsStore/myAuctionsPastCount']
    },
  }
}
</script>
