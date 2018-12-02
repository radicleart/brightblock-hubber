<template>
<section class="pb-3 white-bg pt-60 pb-60">
  <div class="container wide">
    <div class="row">
      <h1>Upload an Auction</h1>
      <my-auction-upload-form :mode="'upload'"/>
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
  },
  computed: {
  },
  methods: {
  }
}
</script>
