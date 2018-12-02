<template>
<li class="media mb-3">
  <img :src="artwork.image" :alt="artwork.title" class="mr-3 img-fluid" style="max-width: 250px;">
  <div class="media-body row">
    <div class="col-sm-7">
      <h5 class="mt-0 mb-1">{{artwork.title}}</h5>
      <p class="artwork-caption">Artist: {{artistProfile.name}}</p>
      <p class="artwork-caption">{{artwork.description}}</p>

      <a class="artwork-action" v-if="canRegister" v-bind:data-artwork="artwork.id" data-toggle="modal" data-target="#registerModal">Register {{status}}</a>
      <a class="artwork-action" v-if="canSell" v-bind:data-artwork="artwork.id" data-toggle="modal" data-target="#sellViaBuyNowModal">Buy</a>
      <a class="artwork-action" v-if="canSell" v-bind:data-artwork="artwork.id" data-toggle="modal" data-target="#sellViaAuctionModal">Bid</a>
      <router-link :to="editUrl" class="artwork-action" v-if="editable">Edit</router-link>

      <a class="artwork-action" @click="deleteArtwork(artwork.id)" v-if="debugMode">Delete</a>

    </div>
    <selling-options :artwork="artwork"/>
  </div>
</li>
</template>

<script>
import moneyUtils from '@/services/moneyUtils'
import SellingOptions from './SellingOptions'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MySingleArtwork',
  components: { SellingOptions },
  props: {
    sold: true,
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    deleteArtwork (id) {
      this.$store.dispatch('myArtworksStore/deleteMyArtwork', id)
    },
  },
  computed: {
    editable (id) {
      return this.$store.getters['myArtworksStore/editable'](this.artwork.id)
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
    canRegister () {
      return !this.sold
    },
    canSell () {
      let bcitem = this.artwork.bcitem
      return (bcitem && bcitem.itemIndex > -1 && !this.sold)
    },
    sellingBuyNow () {
      return this.artwork.saleData.soid === 1
    },
    sellingAuction () {
      return this.artwork.saleData.soid === 2 && this.artwork.saleData.auctionId > 0
    },
    valueInEther () {
      return moneyUtils.valueInEtherFromWei(this.artwork.bcitem.price)
    },
    valueReserveInEther () {
      return moneyUtils.valueInEther(this.artwork.saleData.fiatCurrency, this.artwork.saleData.reserve)
    },
    valueReserveInBitcoin () {
      return moneyUtils.valueInBitcoin(this.artwork.saleData.fiatCurrency, this.artwork.saleData.reserve)
    },
    valueInBitcoin () {
      return moneyUtils.valueInBitcoinFromWei(this.artwork.bcitem.price)
    },
    sellingCurrency () {
      return this.artwork.saleData.fiatCurrency
    },
    sellingCurrencySymbol () {
      return moneyUtils.currencySymbol(this.artwork.saleData.fiatCurrency)
    },
    status () {
      return this.$store.getters['myArtworksStore/bcstatus'](this.artwork.id)
    },
    artistProfile () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.artist)
    },
    ownerProfile () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.owner)
    },
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    manageAuctionUrl () {
      return `/my-auctions/manage/${this.artwork.saleData.auctionId}`
    },
    publicAuctionUrl () {
      return `/online-auction/${this.artwork.owner}/${this.artwork.saleData.auctionId}`
    },
    editUrl () {
      return `/my-artwork/update/${this.artwork.id}`
    },
    url () {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`
    }
  }
}
</script>
