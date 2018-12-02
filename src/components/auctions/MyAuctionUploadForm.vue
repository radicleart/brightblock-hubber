<template>
<div class="innerpage mt-50">

  <wait-for-it-modal/>

  <form>
    <p v-if="errors.length" :key="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
      </ul>
    </p>

    <div class="form-group">
      <p>Only auction administrators ({{username}}) are able to change information about the auction.</p>
    </div>

    <div class="form-group">
      <label>Title</label>
      <input class="form-control" placeholder="Title of your auction" v-model="auction.title">
    </div>

    <div class="form-group">
      <datetime type="datetime" v-model="startDate" input-id="startDate">
        <label for="startDate" slot="before">Auction Starts&nbsp;&nbsp;&nbsp;</label>
        <input id="startDate" class="form-control">
      </datetime>
    </div>

    <div class="form-group">
      <datetime type="datetime" v-model="endDate" input-id="endDate">
        <label for="endDate" slot="before">Auction Ends&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <input id="endDate" class="form-control">
      </datetime>
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea class="form-control" placeholder="Auction description - for marketing and discovery" v-model="auction.description"></textarea>
    </div>

    <div class="form-group">
      <label>Keywords</label>
      <textarea class="form-control" placeholder="Auction keywords - for marketing and discovery" v-model="auction.keywords"></textarea>
    </div>

    <div class="radio-inline">
      <label>
        <input type="radio" name="auction.privacy" value="private" v-model="auction.privacy">
        Private
      </label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" name="auction.privacy" value="public" v-model="auction.privacy" checked>
        Public
      </label>
    </div>

    <hr/>

    <div class="form-group">
      <button type="submit" class="btn btn-default" v-on:click.prevent="upload">Submit</button>
    </div>

  </form>
</div>
</template>

<script>
import moment from 'moment'
import { Datetime } from 'vue-datetime'
import JQuery from 'jquery'
import WaitForItModal from '@/components/common/WaitForItModal'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MyAuctionUploadForm',
  components: {datetime: Datetime, WaitForItModal},
  props: ['auctionId', 'mode'],
  data () {
    return {
      errors: [],
      startDate: null,
      endDate: null,
      auction: {
        title: 'Egyptian Artworks Auction',
        description: 'Egyptian artifacts auctioned from a private collection',
        keywords: 'Egypt,Ancient,Sculpture',
        auctioneer: '',
        privacy: 'private',
        sellingList: []
      },
    }
  },
  mounted () {
    let auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
    if (auction) {
      this.auction = auction
      this.startDate = moment(auction.startDate).format()
      this.endDate = moment(auction.endDate).format()
    } else {
      // let daysTillStart = Math.floor(Math.random() * 14) + 7
      let dd = moment({}).add(2, 'days')
      dd.hour(10)
      dd.minute(0)
      this.startDate = dd.format()
      this.endDate = dd.add(2, 'days').format()
    }
  },
  computed: {
    username () {
      let profile = this.$store.getters['myAccountStore/getMyProfile']
      return profile.username
    },
  },
  methods: {
    upload: function () {
      if (this.validate()) {
        this.openModal()
        let profile = this.$store.getters['myAccountStore/getMyProfile']
        this.auction.auctioneer = profile.username
        this.auction.administrator = profile.username
        this.auction.auctionType = 'webcast'
        this.auction.startDate = moment(this.startDate).valueOf()
        this.auction.endDate = moment(this.endDate).valueOf()
        if (!this.auction.messages) {
          this.auction.messages = []
        }
        if (this.mode === 'update') {
          this.auction.auctionId = this.auctionId
          this.$store.dispatch('myAuctionsStore/updateAuction', this.auction).then((auction) => {
            this.auction = auction
            this.closeModal()
            this.$router.push('/my-auctions')
          })
        } else {
          this.auction.auctionId = moment({}).valueOf()
          this.$store.dispatch('myAuctionsStore/uploadAuction', this.auction).then((auction) => {
            this.auction = auction
            this.closeModal()
            this.$router.push('/my-auctions')
          })
        }
      }
    },
    openModal () {
      JQuery('#waitForItModal').modal('show')
    },
    closeModal () {
      JQuery('#waitForItModal').modal('hide')
    },
    validate: function () {
      this.errors = []
      if (!this.auction.title) {
        this.errors.push('title required.')
      }
      if (moment(this.startDate).isBefore(moment({}))) {
        this.errors.push('Start date before now.')
      }
      if (moment(this.endDate).isBefore(moment({}))) {
        this.errors.push('End date before now.')
      }
      if (moment(this.endDate).isBefore(this.startDate)) {
        this.errors.push('Ends before it starts.')
      }
      if (!this.auction.description) {
        this.errors.push('description required.')
      }
      if (!this.auction.keywords) {
        this.errors.push('keywords required.')
      }
      if (this.errors.length > 0) {
        return false
      } else {
        return true
      }
    },
  }
}
</script>
<style>
</style>
