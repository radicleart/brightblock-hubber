<template>
<div>
  <notifications position="bottom right" group="artwork-actions" />
  <div class="main">
    <navigation/>
    <settings-blockchain v-if="error" v-on:continue-onward="continueOnward" v-bind:metamask="metamask"></settings-blockchain>
    <router-view v-else></router-view>
  </div>
  <app-footer/>
</div>
</template>

<script>
import SettingsBlockchain from '@/components/settings/SettingsBlockchain'
import Navigation from '@/components/nav/Navigation'
import AppFooter from './components/common/AppFooter'

export default {
  name: 'App',
  data () {
    return {
      error: null,
      metamask: {},
      connected: false,
      accounts: {},
    }
  },
  created () {
  },
  methods: {
    continueOnward: function () {
      this.error = undefined
    },
  },
  components: {
    AppFooter,
    Navigation,
    SettingsBlockchain,
  }
}
</script>
