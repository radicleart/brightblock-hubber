<template>
<div class="col-sm-12">
  <h5><router-link :to="auctionUrl"><small>{{auction.title}}</small></router-link></h5>
  <p><small>{{auction.description}}</small></p>
  <p><small><small>{{countdown}}</small></small></p>
</div>
</template>

<script>
import utils from '@/services/utils'
import moment from 'moment'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleAuction',
  components: { },
  props: {
    auction: {
      type: Object,
      default () {
        return {}
      }
    },
    future: false,
  },
  methods: {
    convertDate (date) {
      return moment(date).format()
    },
  },
  computed: {
    auctionUrl () {
      return `/online-auction/${this.auction.administrator}/${this.auction.auctionId}`
    },
    countdown () {
      let serverTime = this.$store.getters['serverTime']
      return utils.dt_Offset(serverTime, this.auction.startDate)
    },
  }
}
</script>
