<template>
<div class="row">
  <div id="publisher" class="col-md-12 col-xs-12"/>
  <div id="subscriber" class="col-md-12 col-xs-12"/>
  <div class="col-md-12" v-if="canPublish">
    <button v-if="publishing" class="btn btn-block yellow-bg black action-button text-uppercase" @click.prevent="unpublish()">stop publishing</button>
    <button v-else class="btn btn-block yellow-bg black action-button text-uppercase" @click.prevent="publish()">start publishing</button>
  </div>
</div>
</template>

<script>
import peerToPeerService from '@/services/peerToPeerService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'VideoStream',
  props: {
    canPublish: false
  },
  data () {
    return {
      publishing: false
    }
  },
  computed: {
  },
  methods: {
    publish () {
      peerToPeerService.startPublishing()
      this.publishing = true
    },
    unpublish () {
      peerToPeerService.stopPublishing()
      this.publishing = false
    },
  }
}
</script>
