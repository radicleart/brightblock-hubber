<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <router-link class="navbar-brand" to="/"><kbd>Open Art Market</kbd></router-link>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="navbar-toggler-icon"></span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <router-link class="dropdown-item" to="/artworks">Artworks</router-link>
          <router-link class="dropdown-item" to="/artists">Artists</router-link>
          <router-link class="dropdown-item" to="/online-auctions">Auctions</router-link>
          <router-link class="dropdown-item" to="/search">Search</router-link>
        </div>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" style="width: 400px;" v-model="queryString" v-on:keyup.13="searchIndex">
    </form>

    <ul class="navbar-nav" v-if="loggedIn">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span v-html="avatar"></span>
        </a>
        <logged-in-links/>
      </li>
    </ul>
    <ul class="navbar-nav" v-else>
      <li class="nav-item">
        <button type="button" class="nav-link btn btn-white" data-toggle="modal" data-target="#aModal">Login</button>
      </li>
    </ul>
  </div>
  <login-modal/>
</nav>
</template>

<script>
import LoggedInLinks from './LoggedInLinks'
import LoginModal from './LoginModal'
import SearchForm from './SearchForm'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Navigation',
  data: () => {
    return {
      isModalActive: true,
      queryString: null,
      loginModalActive: false
    }
  },
  mounted () {
  },
  watch: {
  },
  computed: {
    avatar () {
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      if (myProfile.loggedIn) {
        return '<img style="width: 40px; height: 40px; border-radius: 20px;" src="' + myProfile.avatarUrl + '"/>'
      } else {
        return '<span class="icon-user"></span>'
      }
    },
    loggedIn () {
      let myProfile = this.$store.getters['myAccountStore/getMyProfile']
      return myProfile.loggedIn
    },
  },
  methods: {
    searchIndex () {
      if (!this.queryString) {
        this.queryString = '*'
      }
      this.$router.push({ path: '/search', query: { title: this.queryString } })
      if (window.location.href.indexOf('/search') > -1) {
        // window.location.reload()
      }
    },
  },
  components: {
    SearchForm,
    LoggedInLinks,
    LoginModal
  }
}
</script>
