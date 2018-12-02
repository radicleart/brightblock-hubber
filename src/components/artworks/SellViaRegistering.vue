<template>
<div id="registerModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Register Artwork</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" v-if="message">
        {{message}}
      </div>
      <div class="modal-body" v-else>
        <div class="row  m-0">
          <div class="col-xs-6 grid-item">
            <img :src="artwork.image" :alt="artwork.title">
          </div>
          <div class="col-xs-6 grid-item">
            <h4>{{artwork.title}}</h4>
            {{myArtist.name}}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" :disabled="status !== 'new'" @click="registerArtworkBitcoin()" v-if="!message">Register: Bitcoin</button>
        <button type="button" class="btn btn-primary" :disabled="status !== 'new'" @click="registerArtworkEthereum()" v-if="!message">Register: Ethereum</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import utils from '@/services/utils'
import notify from '@/services/notify'
import ethereumService from '@/services/ethereumService'
import JQuery from 'jquery'
import OpenTimestamps from 'javascript-opentimestamps'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SellViaRegistering',
  props: {
  },
  data () {
    return {
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
    JQuery('#registerModal').on('show.bs.modal', function (event) {
      var trigger = JQuery(event.relatedTarget)
      let artworkId = trigger.data('artwork')
      $self.artwork = $self.$store.getters['myArtworksStore/myArtwork'](artworkId)
    })
  },
  computed: {
    fiatRates () {
      return this.$store.getters['conversionStore/getFiatRates']
    },
    myArtist () {
      return this.$store.getters['userProfilesStore/getProfile'](this.artwork.artist)
    },
    status () {
      return this.$store.getters['myArtworksStore/bcstatus'](this.artworkId)
    },
  },
  methods: {
    closeModal () {
      JQuery('#registerModal').modal('hide')
    },
    registerArtworkBitcoin: function () {
      let regData = {
        title: this.artwork.title,
        timestamp: utils.buildArtworkHash(this.artwork.artwork[0].dataUrl),
        uploader: this.artwork.owner,
      }
      const file = Buffer.from(JSON.stringify(regData), 'hex')
      const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(new OpenTimestamps.Ops.OpSHA256(), file)
      OpenTimestamps.stamp(detached).then(() => {
        // const fileOts = detached.serializeToBytes()
        const infoResult = OpenTimestamps.info(detached)
        console.log(infoResult)
      })
    },
    registerArtworkEthereum: function () {
      this.message = 'Registering your artwork - please allow a few minutes for the transaction to complete...'
      let artwork = this.artwork
      let uploader = this.$store.getters['myAccountStore/getMyProfile'].username
      let regData = {
        title: artwork.title,
        timestamp: utils.buildArtworkHash(artwork.artwork[0].dataUrl),
        uploader: uploader,
      }
      let $self = this
      ethereumService.registerOnChain(regData, function (result) {
        notify.info({title: 'Register Artwork.', text: 'Transaction sent to the blockchain...'})
        artwork.bcitem = {
          registerTxId: result.txId,
          status: 'pending-register'
        }
        $self.$store.commit('myArtworksStore/addMyArtwork', artwork)
        $self.$store.dispatch('myArtworksStore/updateArtwork', artwork).then((artwork) => {
          notify.info({title: 'Register Artwork.', text: 'User storage has been updated...'})
          $self.closeModal()
          $self.$store.dispatch('myArtworksStore/syncBlockchainState', artwork).then((artwork) => {
            if (artwork) {
              $self.artwork = artwork
            }
          })
        })
      }, function (error) {
        console.log(error)
        $self.message = 'Please check you are logged into your Meta Mask account and on the correct network.'
        notify.error({title: 'Register Artwork.', text: 'Error registering your item - please check meta mask is running and unlocked. <br>'})
      })
    },
  }
}
</script>
