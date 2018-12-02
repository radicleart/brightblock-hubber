<template>
<section>
  <!-- <account-display :account="account" :isModalActive="isModalActive" v-on:close-modal="closeModal"/> -->
  <div class="columns">
    <div class="column content is-8">
      <h1 class="title">Blockstack Namespace</h1>
      <div class="field">
        <label class="label">Lookup Name</label>
        <div class="control">
          <input
            v-model="username"
            class="input"
            type="text"
            placeholder="name of your project..">
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" v-on:click="viewProfile">View User Profile</button>
        </div>
        <div class="control">
          <button class="button is-link" v-on:click="viewFiles">View User Files</button>
        </div>
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <div class="field">
        <label class="label">Or browse names by entering a page number</label>
        <div class="control">
          <input
            @change="changePage"
            v-model="page"
            class="input"
            type="text"
            placeholder="enter a page number..">
        </div>
      </div>
    </div>
  </div>
  <div class="columns is-multiline">
    <div class="column content is-2" v-for="name in names.data" :key="name">
        <p><a href="#" @click="clickName(name)">{{ name }}</a></p>
    </div>
  </div>
</section>
</template>
<script>
import authorization from '../../services/authorization'
import AccountDisplay from './AccountDisplay'

export default {
  name: 'AccountLookup',
  data () {
    return {
      page: 100,
      display: false,
      names: {},
      username: '',
      profile: {},
      isModalActive: false,
      account: {}
    }
  },
  components: {
    AccountDisplay
  },
  mounted () {
    authorization.fetchNames(this.page).then((names) => {
      this.names = names
    })
    authorization.getUserData().then((data) => {
      this.username = data.username
      console.log(data)
    })
  },
  methods: {
    clickName: function (name) {
      this.username = name
      this.myClass = 'is-primary'
      this.errorMessage = ''
    },
    viewProfile: function () {
      this.$router.push({name: 'display', params: { username: this.username }})
    },
    viewFiles: function () {
      this.$router.push({name: 'files', params: { username: this.username }})
    },
    closeModal: function (event) {
      this.isModalActive = false
    },
    changePage: function (event) {
      authorization.fetchNames(this.page).then((names) => {
        this.names = names
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
