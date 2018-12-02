<template>
<section>
  <div class="columns">
    <div class="column">
      <div class="content" v-for="node in nodes" :key="node.name">
        <h2 class="is-title2">{{ node.name }}</h2>
        <p>Pubkey: <span>{{ node.pubkey }}</span></p>
        <p>Balance: <span>{{ node.balance }}</span></p>
        <p><span>Channels: <a @click="listChannels(node.name)">list</a> <a @click="pendingChannels(node.name)">pending</a> <a @click="closedChannels(node.name)">closed</a></span>
        </p>
        <p>{{ channelInfo }}</p>
        <div v-if="node.numPeers === 0">
          <div v-for="node1 in nodes" :key="node1.name">
            <span v-if="node.name !== node1.name"><a href="#" @click="connect(node.name, node1.name)">connect {{ node.name }} to {{ node1.name }}</a></span>
          </div>
        </div>
        <div v-else>
          <div v-for="peer in node.peers" :key="peer">
            <a href="#" @click="disconnect(node.name, peer.pubKey_)">disconnect {{ node.name }} from {{ peer.pubKey_ }}</a>
          </div>
        </div>
        <div v-if="node.numActiveChannels === 0 && node.numPendingChannels === 0">
          <div v-for="node1 in nodes" :key="node1.name">
            <span v-if="node.name !== node1.name"><a href="#" @click="openChannel(node.name, node1.name)">open channel from {{ node.name }} to {{ node1.name }}</a></span>
          </div>
        </div>
        <div v-else>
          <div v-for="node1 in nodes" :key="node1.name">
            <span v-if="node.name !== node1.name"><a href="#" @click="closeChannel(node.name, node1.name)">close channel from {{ node.name }} from {{ node1.name }}</a></span>
          </div>
        </div>
        <br>
        Pending/active channels: {{ node.numPendingChannels }} / {{ node.numActiveChannels }}
      </div>
    </div>
  </div>
</section>
</template>

<script>
import lightningService from '@/services/lightning/lightningService'
import _ from 'lodash'

export default {
  data () {
    return {
      nodes: [],
      // node: (this.$route && this.$route.params.node) ? this.$route.params.node : 'alice',
      action: (this.$route && this.$route.params.action) ? this.$route.params.action : 'getinfo',
      nodeNames: ['alice', 'bob'],
      graph: null,
      channelInfo: null,
    }
  },
  mounted () {
    if (this.action === 'describeGraph') {
      lightningService.describeGraph('bob').then((graph) => {
        this.graph = graph
      })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
      return
    }
    for (var i = 0; i < this.nodeNames.length; i++) {
      let myname = this.nodeNames[i]
      lightningService.node(myname).then((mynode) => {
        this.nodes.push(mynode)
      })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    }
  },
  methods: {
    pendingChannels: function (node1Name) {
      lightningService.pendingChannels(node1Name)
        .then((output) => {
          this.channelInfo = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    listChannels: function (node1Name) {
      lightningService.listChannels(node1Name)
        .then((output) => {
          this.channelInfo = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    closedChannels: function (node1Name) {
      lightningService.closedChannels(node1Name)
        .then((output) => {
          this.channelInfo = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    openChannel: function (node1Name, nodeName2) {
      let node2 = _.find(this.nodes, {name: nodeName2})
      lightningService.openChannel(node1Name, node2.pubkey, 250000)
        .then((output) => {
          this.output = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    connect: function (node1Name, nodeName2) {
      let node2 = _.find(this.nodes, {name: nodeName2})
      lightningService.connectPeer(node1Name, node2.peerAddress, node2.pubkey)
        .then((output) => {
          this.output = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    disconnect: function (node1Name, pubkey) {
      lightningService.disconnectPeer(node1Name, pubkey)
        .then((output) => {
          this.output = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
  },
  components: {
  }
}
</script>
