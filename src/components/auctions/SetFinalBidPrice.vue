<template>
<div id="setFinalBidPriceModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sell via Buy Now</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" v-if="message">
        {{message}}
      </div>
      <div class="modal-body" v-else>
          <div class="form-group">
            <label>Amount {{currencySymbol}} {{amount}} {{item.fiatCurrency}}</label>
            <p id="amountHelpBlock" class="form-text text-muted">
              {{valueInBitcoin(amount)}} Btc / {{valueInEther(amount)}} Eth
            </p>
            <p id="currencyHelpBlock" class="form-text text-muted">
              {{conversionMessage}}
            </p>
          </div>
      </div>
      <div class="modal-body" v-if="message">
        {{message}}
      </div>
      <div class="modal-body" v-else>
          <div class="form-group">
            <label>Amount {{currencySymbol}} {{amount}} {{item.fiatCurrency}}</label>
            <p id="amountHelpBlock" class="form-text text-muted">
              {{valueInBitcoin(amount)}} Btc / {{valueInEther(amount)}} Eth
            </p>
            <p id="currencyHelpBlock" class="form-text text-muted">
              {{conversionMessage}}
            </p>
          </div>
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
let $ = JQuery

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SetFinalBidPrice',
  props: {
    isModalActive: false,
    amount: null,
    auctionId: null,
    item: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      errors: [],
      currency: 'EUR',
      message: null,
    }
  },
  mounted () {
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },

    artwork () {
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
      if (artwork) {
        return artwork
      } else {
        return {
          image: '/static/images/artwork1.jpg'
        }
      }
    },

    auctions () {
      return this.$store.getters['myAuctionsStore/myAuctionsFuture']
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
      $('#setFinalBidPriceModal').modal('hide')
    },

    valueInBitcoin (amount) {
      return moneyUtils.valueInBitcoin(this.currency, amount)
    },

    valueInEther (amount) {
      return moneyUtils.valueInEther(this.currency, amount)
    },

    setPrice: function () {
      this.$store.commit('myAuctionsStore/sellItemEvent', {auctionId: this.auctionId, itemId: this.item.itemId})
      let artwork = this.$store.getters['artworkSearchStore/getArtwork'](this.item.itemId)
      this.message = 'Setting Price: Please confirm the transaction in your wallet...'
      let priceData = {
        itemIndex: artwork.bcitem.itemIndex,
        amountInWei: moneyUtils.valueInWei(this.currency, this.amount)
      }
      let $self = this
      ethereumService.setPriceOnChain(priceData, function (result) {
        artwork.bcitem.setPriceTxId = result.txId
        artwork.bcitem.status = 'price-set'
        $self.$store.dispatch('myArtworksStore/syncBlockchainState', artwork).then((artwork) => {
          if (artwork) {
            $self.artwork = artwork
          }
        })
        // $self.$store.commit('myAuctionsStore/sellItemEvent', {auctionId: $self.auctionId, itemId: $self.item.itemId})
        notify.info({title: 'Set Price.', text: 'The final bid amount has been saved on chain - ready for payment.'})
        $self.closeModal()
      }, function (error) {
        console.log(error)
        notify.error({title: 'Set Price.', text: 'Error setting price for your item.'})
      })
    }
  }
}
</script>
