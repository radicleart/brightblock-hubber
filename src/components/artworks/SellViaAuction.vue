<template>
<div id="sellViaAuctionModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Sell via Auction</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" v-if="message">
        {{message}}
      </div>
      <div class="modal-body" v-else>
      <h5 class="modal-title">{{artwork.title}}</h5>
      <form @submit.prevent="setPrice">
        <p v-if="artwork.saleData.auctionId"><a class="button" v-on:click="removeFromAuction">remove from auction {{auctionTitle}}</a></p>
        <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
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
          <label>Reserve {{currencySymbol}}</label>
          <input class="form-control" type="number" step="50" placeholder="Reserve price" v-model="artwork.saleData.reserve"  aria-describedby="reserveHelpBlock">
          <p id="reserveHelpBlock" class="form-text text-muted">
            This item will not sell if the bidding does not meet or exceed this amount.<br/>
            {{valueInBitcoin(artwork.saleData.reserve)}} Btc / {{valueInEther(artwork.saleData.reserve)}} Eth
          </p>
        </div>
        <div class="form-group">
          <label>Increment {{currencySymbol}}</label>
          <input class="form-control" type="number" step="50" placeholder="Increment value" v-model="artwork.saleData.increment"  aria-describedby="incrementHelpBlock">
          <p id="incrementHelpBlock" class="form-text text-muted">
            {{valueInBitcoin(artwork.saleData.increment)}} Btc / {{valueInEther(artwork.saleData.increment)}} Eth
          </p>
        </div>
        <div class="form-group">
          Display in auction
          <select class="form-control" v-model="auctionId">
            <option v-for="(auction,key) in auctions" :key="key" :value="auction.auctionId">{{auction.title}}</option>
          </select>
        </div>
        </form>
      </div>
      <div class="modal-footer" v-if="!message">
        <button type="button" class="btn btn-primary" @click.prevent="addToAuction">Save</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
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
      auctionId: -1,
      currency: 'EUR',
      message: null,
      artwork: {
        saleData: {}
      },
    }
  },
  mounted () {
    let $self = this
    $self.artworkId = 1
    JQuery('#sellViaAuctionModal').on('show.bs.modal', function (event) {
      var trigger = JQuery(event.relatedTarget)
      $self.artworkId = trigger.data('artwork')
      $self.artwork = $self.$store.getters['myArtworksStore/myArtwork']($self.artworkId)
      $self.auctionId = $self.artwork.saleData.auctionId
    })
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates'] || {}
    },

    auctionTitle () {
      let auction = this.$store.getters['myAuctionsStore/myAuction'](this.artwork.saleData.auctionId)
      if (auction) {
        return auction.title
      } else {
        return 'unknown'
      }
    },

    auctions () {
      try {
        return this.$store.getters['myAuctionsStore/myAuctionsFuture']
      } catch (e) {
        return []
      }
    },

    conversionMessage () {
      return moneyUtils.conversionMessage(this.currency) || 'no message'
    },

    currencySymbol () {
      return moneyUtils.currencySymbol(this.currency) || 'no currency symbol'
    },
  },
  methods: {
    closeModal () {
      JQuery('#sellViaAuctionModal').modal('hide')
    },

    valueInBitcoin (amount) {
      return moneyUtils.valueInBitcoin(this.currency, amount)
    },

    valueInEther (amount) {
      return moneyUtils.valueInEther(this.currency, amount)
    },

    validate: function (saleData) {
      this.errors = []
      if (saleData.soid !== 2) {
        this.errors.push({ERR_CODE: 301, message: 'Selling via auction?'})
      }
      if (!saleData.reserve || saleData.reserve === 0) {
        this.errors.push({ERR_CODE: 302, message: 'Reserve required if selling by auction.'})
      }
      if (!saleData.increment || saleData.increment === 0) {
        this.errors.push({ERR_CODE: 303, message: 'Increment required if selling by auction.'})
      }
      if (!saleData.auctionId) {
        this.errors.push({ERR_CODE: 304, message: 'Please select an auction for this item.'})
      }
    },
    removeFromAuction () {
      let $self = this
      this.$store.dispatch('myArtworksStore/removeFromAuction', {auctionId: this.artwork.saleData.auctionId, itemId: this.artwork.id}).then((artwork) => {
        $self.closeModal()
      }).catch(e => {
        console.log(e.message)
        $self.closeModal()
      })
    },
    addToAuction () {
      this.artwork.saleData = moneyUtils.buildSaleDataFromUserInput(this.auctionId, this.currency, this.artwork.saleData)
      this.validate(this.artwork.saleData)
      if (this.errors.length > 0) {
        return
      }
      let $self = this
      $self.message = 'Please wait while we update the data.'
      this.$store.dispatch('myArtworksStore/addToAuction', this.artwork).then((artwork) => {
        $self.message = null
        $self.closeModal()
      }).catch(e => {
        $self.message = e.message
        console.log(e.message)
      })
    },
  }
}
</script>
