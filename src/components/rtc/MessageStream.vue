<template>
<div class="row">
  <div class="col-md-12 col-xs-12">
    <h4>Messaging</h4>
    <div class="form-group">
      <textarea class="form-control" rows="3" v-model="message" v-on:keyup.13.prevent="sendMessage"></textarea>
    </div>
  </div>
  <div class="col-md-12 col-xs-12" style="max-height: 150px; overflow: scroll;">
    <div v-for="(message, index) of messages" :key="index">
      {{message.username}}: {{message.content}} <br/>
    </div>
  </div>
</div>
</template>

<script>
import peerToPeerService from '@/services/peerToPeerService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MessageStream',
  props: {
    auctionId: null,
    admin: false
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {
    messages () {
      let auction = {}
      if (this.admin) {
        auction = this.$store.getters['myAuctionsStore/myAuction'](this.auctionId)
      } else {
        auction = this.$store.getters['onlineAuctionsStore/onlineAuction'](this.auctionId)
      }
      if (!auction) {
        auction = {}
      }
      return auction.messages
    },
  },
  methods: {
    sendMessage () {
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      let data = {
        content: this.message,
        username: myProfile.username,
        auctionId: this.auctionId
      }

      if (this.admin) {
        this.$store.commit('myAuctionsStore/messageEvent', data)
      } else {
        peerToPeerService.sendPeerSignal({
          type: 'wa-message-send-adm',
          data: data
        })
      }
    },
  }
}
</script>
