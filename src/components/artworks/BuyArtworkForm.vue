<template>
  <section id="pdp-action" class="pdp-action black pb-0" v-if="artwork.bcitem">
    <div class="container-fluid p-0">
      <div class="row  m-0">
        <div class="col-md-9 col-xs-12 product-price">
          <span class="price inline-block">{{artwork.bcitem.fiatCurrencySymbol}} {{artwork.bcitem.priceInFiat}} {{ artwork.bcitem.fiatCurrency }}</span>
          <span class="price-small inline-block grey-medium">{{ artwork.bcitem.priceInEth }} ETH</span>
          <!-- <span class="price-small inline-block grey-medium">BTC {{ artwork.bcitem.priceInBtc }}</span> -->
        </div>
        <button class="btn btn-block black action-button text-uppercase" :disabled="!purchaseState.canBuy" v-bind:class="{ 'yellow-bg': purchaseState.canBuy, 'grey-bg': !purchaseState.canBuy }"  @click="buyArtwork()">buy</button>
      </div>
    </div>
  </section>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'BuyArtworkForm',
  props: {
    purchaseState: {},
    artwork: {
      type: Object,
      default () {
        return {
          bcitem: {}
        }
      }
    }
  },
  methods: {
    buyArtwork () {
      this.$emit('buy')
    }
  }
}
</script>
