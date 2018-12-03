<template>
<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
  <div class="navbar-text dropdown-item">{{ username }}</div>
  <div class="dropdown-divider"></div>
  <router-link class="dropdown-item" to="/admin/registrations" v-if="showAdmin">Admin</router-link>
  <router-link class="dropdown-item" to="/account/userData">My Account</router-link>
  <a href="#" class="dropdown-item" @click.prevent="logout">Logout</a>
</div>
</template>

<script>
import myAccountService from '@/services/myAccountService'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'LoggedInLinks',
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
