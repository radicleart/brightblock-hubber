<template>
<div id="sellViaBuyNowModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Sell via Buy Now</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" v-if="message">
        {{message}}
      </div>
      <div class="modal-body" v-else>
        <h5 class="modal-title">{{artwork.title}}</h5>
        <p class="form-text text-muted">Note: set the value to 0 to remove from sale.</p>
        <form @submit.prevent="setPrice">
          <p>This item can be bought for the price you specify.</p>
          <p v-if="errors.length" :key="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
            </ul>
          </p>
          <div class="form-group">
            <label for="currencyHelpBlock">Select Currency</label>
            <select class="form-control" v-model="currency">
              <option v-for="(value,key) in fiatRates" :key="key">{{ key }}</option>
            </select>
            <p id="currencyHelpBlock" class="form-text text-muted">
              {{conversionMessage}}
            </p>
          </div>
          <div class="form-group">
            <label>Amount {{currencySymbol}}</label>
            <input class="form-control" type="number" step="50" placeholder="Sale value of artwork" v-model="amount"  aria-describedby="amountHelpBlock">
            <p id="amountHelpBlock" class="form-text text-muted">
              {{valueInBitcoin}} Btc / {{valueInEther}} Eth
            </p>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click.prevent="setPrice" v-if="!message">Set Price</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import notify from '@/services/notify'
import ethereumService from '@/services/ethereumService'
import moneyUtils from '@/services/moneyUtils'
import JQuery from 'jquery'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SellViaAuction',
  props: {
  },
  data () {
    return {
      errors: [],
      amount: 0,
      currency: 'EUR',
      message: null,
      artwork: {
        type: Object,
        default () {
          return {}
        }
      },
    }
  },
  mounted () {
    let $self = this
    JQuery('#sellViaBuyNowModal').on('show.bs.modal', function (event) {
      var trigger = JQuery(event.relatedTarget)
      let artworkId = trigger.data('artwork')
      $self.artwork = $self.$store.getters['myArtworksStore/myArtwork'](artworkId)
      $self.amount = $self.artwork.saleData.amount
      if ($self.artwork.saleData.auctionId && $self.artwork.saleData.soid === 2) {
        $self.message = 'This artwork is part of an auction - remove it from the auction if you want to sell it by buy now.'
      }
    })
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },

    auctions () {
      return this.$store.getters['myAuctionsStore/myAuctionsFuture']
    },

    valueInBitcoin () {
      return moneyUtils.valueInBitcoin(this.currency, this.amount)
    },

    valueInEther () {
      return moneyUtils.valueInEther(this.currency, this.amount)
    },

    conversionMessage () {
      return moneyUtils.conversionMessage(this.currency)
    },

    currencySymbol () {
      return moneyUtils.currencySymbol(this.currency)
    },
  },
  methods: {
    closeModal () {
      JQuery('#sellViaBuyNowModal').modal('hide')
    },

    validate: function (saleData) {
      this.errors = []
    },

    setPrice: function () {
      let artwork = this.artwork
      this.validate(artwork.saleData)
      if (this.errors.length > 0) {
        return
      }

      artwork.saleData.soid = 1
      artwork.saleData.amount = Number(this.amount)
      if (artwork.saleData.amount === 0) {
        artwork.saleData.soid = 0
      }
      artwork.saleData.reserve = 0
      artwork.saleData.increment = 0
      artwork.saleData.fiatCurrency = this.currency
      let fiatRates = this.$store.getters['conversionStore/getFiatRates']
      artwork.saleData.initialRateBtc = fiatRates[this.currency]['15m']
      let ethToBtc = this.$store.getters['conversionStore/getCryptoRate']('eth_btc')
      artwork.saleData.initialRateEth = ethToBtc
      artwork.saleData.amountInEther = moneyUtils.valueInEther(this.currency, artwork.saleData.amount)
      artwork.saleData.auctionId = null

      this.message = 'Setting Price: Please confirm the transaction in your wallet...'
      let priceData = {
        itemIndex: artwork.bcitem.itemIndex,
        amountInWei: moneyUtils.valueInWei(artwork.saleData.fiatCurrency, artwork.saleData.amount)
      }
      let $self = this
      ethereumService.setPriceOnChain(priceData, function (result) {
        artwork.bcitem.setPriceTxId = result.txId
        artwork.bcitem.status = 'price-set'
        $self.$store.commit('myArtworksStore/addMyArtwork', artwork)
        $self.message = 'Setting Price: Blockchain called - saving data changes...'
        $self.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
          notify.info({title: 'Register Artwork.', text: 'Your user storage has been updated.'})
          $self.closeModal()
        })
      }, function (error) {
        notify.error({title: 'Register Artwork.', text: 'Error setting price for your item. <br>' + error.message})
      })
    }
  }
}
</script>
