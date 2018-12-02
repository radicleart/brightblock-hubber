<template>
<div id="aModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Login to brightblock uses your own id.</p>
        <p>You can get one from <a href="https://blockstack.org">blockstack</a>!</p>
        <span class="icon-smile"></span>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="loginMultiPlayer">Login</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import myAccountService from '@/services/myAccountService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LoginModal',
  data () {
    return {
      isModalActive: false,
    }
  },
  created () {
    if (myAccountService.isPending()) {
      myAccountService.handlePending()
    }
  },
  computed: {
    username () {
      return this.$store.state.myAccountStore.myProfile.name
    },
    showAdmin () {
      return this.$store.state.myAccountStore.myProfile.showAdmin
    },
    loggedIn () {
      return this.$store.state.myAccountStore.myProfile.loggedIn
    },
    debugMode () {
      return this.$store.getters['isDebugMode']
    },
  },
  methods: {
    logout () {
      localStorage.clear()
      sessionStorage.clear()
      myAccountService.logout()
    },
    openModal () {
      this.isModalActive = true
    },
    closeModal () {
      this.isModalActive = false
    },
    login: () => {
      return myAccountService.login()
    },
    loginMultiPlayer: () => {
      return myAccountService.loginMultiPlayer()
    },
  }
}
</script>
