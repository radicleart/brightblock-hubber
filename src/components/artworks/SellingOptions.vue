<template>
<div class="col-sm-5">
  <div v-if="sellingBuyNow">
    <h6>Selling By Buy Now</h6>
    {{sellingCurrencySymbol}} {{artwork.saleData.amount}} {{sellingCurrency}} / {{valueInEther}} Eth / {{valueInBitcoin}} Btc<br>
  </div>
  <div v-else-if="sellingAuction">
    <h6>Selling in Auction</h6>
    Reserve: {{sellingCurrencySymbol}} {{artwork.saleData.reserve}}
    <br> {{sellingCurrency}} / {{valueReserveInEther}} Eth / {{valueReserveInBitcoin}} Btc
    <br>
    <router-link :to="manageAuctionUrl" v-if="canManageAuction">manage |</router-link>
    <router-link :to="publicAuctionUrl">go to auction</router-link>
  </div>
  <div v-else>
    <h6>Not Selling</h6>
  </div>
</div>
</template>

<script>
import moneyUtils from '@/services/moneyUtils'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SellingOptions',
  props: {
    artwork: {
      saleData: {}
    },
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    sellingBuyNow () {
      return this.artwork.saleData.soid === 1
    },
    sellingAuction () {
      return this.artwork.saleData.soid === 2 && this.artwork.saleData.auctionId > 0
    },
    canManageAuction () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.artwork.saleData.auctionId)
      if (!auction) return false
      let username = this.$store.getters['myAccountStore/getMyProfile'].username
      return auction.administrator === username
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
    manageAuctionUrl () {
      return `/my-auctions/manage/${this.artwork.saleData.auctionId}`
    },
    publicAuctionUrl () {
      return `/online-auction/${this.artwork.owner}/${this.artwork.saleData.auctionId}`
    },
  },
}
</script>
