<template>
<section>
  <div class="content">
    <h2 class="is-title2">{{ nodeName }}</h2>
    <p v-if="error">{{ error }}</p>
    <p>Pubkey: <span>{{ pubkey }}</span></p>
    <h2 class="is-title2"><a @click="showInfo('listPeers')">Peer to Peer Network</a></h2>
    <p v-if="peers[0].pubKey_" v-for="peer in peers" :key="peer.pubKey_">
      Pub Key: {{ peer.pubKey_ }}
      Address: {{ peer.address_ }}
      <a @click="disconnect(peer.pubKey_)">disconnect</a>
    </p>
    <p v-for="aNode in nodes" :key="aNode.name">
      <span v-if="aNode.name !== nodeName"><a href="#" @click="connect(nodeName, aNode.name)">connect to {{ aNode.name }}</a></span>
    </p>
    <h2 class="is-title4"><a @click="showInfo('walletbalance')">Wallet Balance</a></h2>
    <p v-if="walletInfo.confirmedBalance_">
      Confirmed: {{ walletInfo.confirmedBalance_ }}
      Unconfirmed: {{ walletInfo.unconfirmedBalance_ }}
    </p>
    <h2 class="is-title2"><a @click="showInfo('listInvoices')">Invoices</a></h2>
    <div class="columns">
      <div class="column">
        <input class="input is-primary" type="text" placeholder="Invoice value" v-model="invoice.value">
        <textarea class="textarea is-primary" placeholder="Description of payment" v-model="invoice.memo"></textarea>
        <input class="input is-primary" type="text" readonly="true" placeholder="hash of memo" :value="hashMe()">
        <button @click="addInvoice">send invoice</button>
      </div>
    </div>
    <div class="content" v-if="invoices" v-for="invoice in invoices" :key="invoice.channelPoint_">
      <div class="columns">
        <div class="column is-one-fifth">
          Pending invoices
        </div>
        <div class="column is-four-fifth">
          {{ invoice.pending_ }}
        </div>
      </div>
    </div>
    <h2 class="is-title2"><a @click="showInfo('listChannels')">Connected Channels</a></h2>
    <div class="content" v-if="channels" v-for="channel in channels" :key="channel.channelPoint_">
      <div class="columns">
        <div class="column is-one-fifth">
          Active / Private
        </div>
        <div class="column is-four-fifth">
          {{ channel.active_ }} / {{ channel.private_ }}
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">
          Remote Pub Key
        </div>
        <div class="column is-four-fifth">
          {{ channel.remotePubkey_ }}
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">
          Channel Point
        </div>
        <div class="column is-four-fifth">
          {{ channel.channelPoint_ }}
        </div>
      </div>
      <div class="columns"><div class="column"><button v-on:click="showFull = !showFull">show/hide</button></div></div>
      <div v-show="showFull">
        <div class="columns">
          <div class="column is-one-fifth">
            Channel Id
          </div>
          <div class="column is-four-fifth">
            {{ channel.chanId_ }}
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth">
            Capacity
          </div>
          <div class="column is-four-fifth">
            {{ channel.capacity_ }}
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth">
            Local / remote balance
          </div>
          <div class="column is-four-fifth">
            {{ channel.localBalance_ }} / {{ channel.remoteBalance_ }}
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth">
            Commit fee / Number of updates
          </div>
          <div class="column is-four-fifth">
            {{ channel.commitFee_ }} / {{ channel.numUpdates_ }}
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth">
            memoizedHashCode
          </div>
          <div class="column is-four-fifth">
            {{ channel.memoizedHashCode_ }}
          </div>
        </div>
        <div class="columns">
          <div class="column">
            Satoshis received = {{ channel.totalSatoshisReceived_ }}, sent = {{ channel.totalSatoshisSent_ }}. Unsettled balance {{ channel.unsettledBalance_ }}
          </div>
        </div>
      </div>
    </div>
    <!--
    <p>Show: <a @click="showInfo('pendingChannels')">pending channels</a></p>
    <p v-if="pendingChannels">
      Pending Channels: {{ pendingChannels }}
    </p>
    <p>Show: <a @click="showInfo('closedChannels')">closed channels</a></p>
    <p v-if="closedChannels">
      Closed Channels: {{ closedChannels }}
    </p>
    -->
  </div>
</section>
</template>

<script>
import lightningService from '@/services/lightning/lightningService'
import SHA256 from 'crypto-js/sha256'
import _ from 'lodash'

export default {
  props: [ 'nodeName', 'pubkey', 'nodes' ],
  data () {
    return {
      showFull: false,
      error: null,
      peers: {},
      walletInfo: {},
      channels: null,
      invoices: null,
      closedChannels: null,
      pendingChannels: null,
      invoice: { value: 10000, memo: 'some text that may get hashed and stored in the description hash field' }
    }
  },
  mounted () {
    console.log('pub key: ' + this.pubkey)
    console.log('peers: ', this.peers)
    let myNode = _.find(this.nodes, {name: this.nodeName})
    if (myNode.numPeers > 0) {
      this.showInfo('listPeers')
    }
    if ((myNode.numPendingChannels + myNode.numActiveChannels) > 0) {
      this.showInfo('listChannels')
    }
  },
  methods: {
    hashMe: function () {
      return SHA256(this.invoice.memo)
    },
    showInfo: function (info) {
      let selfie = this
      lightningService.showInfo(this.nodeName, info).then((output) => {
        if (info === 'listPeers') {
          selfie.peers = output.peers_
        } else if (info === 'walletbalance') {
          selfie.walletInfo = output
        } else if (info === 'pendingChannels') {
          selfie.pendingChannels = output
        } else if (info === 'closedChannels') {
          selfie.closedChannels = output
        } else if (info === 'listChannels') {
          selfie.channels = output.channels_
        } else if (info === 'listInvoices') {
          selfie.invoices = output.invoices_
        }
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
          if (output.failed) {
            this.error = output.details
            return
          }
          this.output = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    disconnect: function (pubkey) {
      lightningService.disconnectPeer(this.nodeName, pubkey)
        .then((output) => {
          if (output.failed) {
            this.error = output.details
            return
          }
          this.output = output
        })
        .catch(e => {
          console.log('Unable to lookup lightning nodes', e)
        })
    },
    addInvoice: function () {
      let descriptionHash = this.hashMe(this.invoice.memo)
      lightningService.addInvoice(this.nodeName, this.invoice.value, descriptionHash, this.invoice.memo)
        .then((output) => {
          if (output.failed) {
            this.error = output.details
            return
          }
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
