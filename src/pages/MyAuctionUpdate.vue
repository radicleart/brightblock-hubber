<template>
<section id="pdp-slider" class="pb-3 white-bg pt-60 pb-60">
  <div class="container">
    <div class="row">
      <h1>Update Auction</h1>
      <my-auction-upload-form :auctionId="auctionId" :mode="'update'"/>
    </div>
  </div>
</section>
</template>

<script>
import MyAuctionUploadForm from '../components/auctions/MyAuctionUploadForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctionUpload',
  components: {
    MyAuctionUploadForm
  },
  data () {
    return {
    }
  },
  created () {
    this.auctionId = Number(this.$route.params.auctionId)
  },
  computed: {
  },
  methods: {
  }
}
</script>
