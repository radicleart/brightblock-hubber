<template>
<div class="row">
  <div class="col-md-12">
    <h4>Watchers</h4>
    <h5>Administrator: {{administrator.username}}</h5>
    <p v-for="(peer, index) of peers" :key="index" v-if="administrator.username !== peer.username">
      {{peer.username}}
    </p>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MessageStream',
  props: {
    auctionId: null,
  },
  data () {
    return {
    }
  },
  computed: {
    administrator () {
      return this.$store.getters['onlineAuctionsStore/getAdministrator'](this.auctionId)
    },
    peers () {
      return this.$store.getters['onlineAuctionsStore/getPeers']
    },
  },
  methods: {
    myUsername () {
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      if (myProfile) {
        return myProfile.username
      } else {
        return ''
      }
    },
  }
}
</script>
