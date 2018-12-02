<template>
<section class="page">
  <div class="events"></div>
  <div class="columns">
    <div class="column is-one-fifth">
      <lightning-actions />
    </div>
    <div class="column is-four-fifth">
      <div class="columns">
        <div class="column">
          <h1 class="title is-1">Explore Lightning</h1>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <lightning-node v-for="node in nodes"
            v-bind:key="node.name"
            v-bind:nodeName="node.name"
            v-bind:pubkey="node.pubkey"
            v-bind:nodes="nodes"
          ></lightning-node>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import lightningService from '@/services/lightning/lightningService'
import LightningActions from '@/components/lightning/LightningActions'
import LightningNode from '@/components/lightning/LightningNode'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import _ from 'lodash'

export default {
  data () {
    return {
      nodeNames: [ 'alice', 'bob' ],
      nodes: [],
      rates: {}
    }
  },
  mounted () {
    let selfie = this
    _.each(this.nodeNames, function (nodeName) {
      lightningService.getNode(nodeName).then((inflatedNode) => {
        // thisNode = inflatedNode
        selfie.nodes.push(inflatedNode)
        console.log(selfie.nodes)
      })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    })
  },
  methods: {
    setNode: function (node) {
      this.node = node
    },
    websock: function (node) {
      // var socket = new WebSocket('http://localhost:8080/ws')
      let socket = new SockJS('http://localhost:8080/exchanges')
      let stompClient = Stomp.over(socket)
      let connectSuccess = function (frame) {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/exchanges', function (response) {
          let rates = {rates: JSON.parse(response.body)}
          console.log(rates)
        })
      }
      let connectError = function (error) {
        if (error.headers) {
          console.log('[SysadmOnly] WebSocket Error: ' + error)
        } else {
          console.log('[SysadmOnly] WebSocket Error: ' + error)
        }
      }
      stompClient.connect({}, connectSuccess, connectError)
    },
  },
  components: {
    LightningActions, LightningNode
  }
}
</script>
