<template>
<section>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 pt-5">
        <h1 class="innerpage">Upcoming Auctions ({{auctionsSize}})</h1>
        <ul class="list-unstyled">
          <single-auction class="row" v-for="(auction, index) of auctions" :key="index" :auction="auction"/>
        </ul>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import SingleAuction from '../components/auctions/SingleAuction'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'OnlineAuctions',
  components: { SingleAuction },
  data () {
    return {
    }
  },
  created () {
    this.$store.dispatch('onlineAuctionsStore/fetchOnlineAuctions').then((auctions) => {
      // loading online auctions
    })
  },
  methods: {
  },
  computed: {
    auctionsSize () {
      return this.$store.getters['onlineAuctionsStore/onlineAuctions'].length
    },
    auctions () {
      return this.$store.getters['onlineAuctionsStore/onlineAuctions']
    },
  },
}
</script>
