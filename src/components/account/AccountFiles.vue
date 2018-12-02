<template>
<section>
    <h1 class="title">
      File Information
    </h1>
    <h2 class="subtitle">
      {{ this.username }}
    </h2>
    <section class="content" v-if="hasError">
      <p v-bind:class="myClass">{{ errorMessage }}</p>
    </section>
    <section class="content">
      <div class="columns is-multiline">
        <div class="column is-12">
          <h2 class="subtitle">files using direct get</h2>
        </div>
        <div class="column" v-for="file in files" :key="file.gaiaUrl">
          <p>{{ file.gaiaUrl }}: {{ file.projects }}: </p>
        </div>
      </div>
    </section>
    <section class="content" v-if="bsfiles.length > 0">
      <div class="columns is-multiline">
        <div class="column is-12">
          <h2 class="subtitle">files using blockstack getFile</h2>
        </div>
        <div class="column" v-for="file in bsfiles" :key="file.gaiaUrl">
          <p>{{ file.gaiaUrl }}: {{ file.projects }}: </p>
        </div>
      </div>
    </section>
</section>
</template>

<script>
import authorization from '../../services/authorization'
import axios from 'axios'

export default {
  name: 'AccountDisplay',
  props: [ 'username', 'appUrl', 'gaiaUrl' ],
  data () {
    return {
      files: [],
      bsfiles: [],
      errorMessage: '',
      hasError: false,
      myClass: ''
    }
  },
  components: {
  },
  mounted () {
    if (!this.username) {
      this.username = authorization.getUsername()
    }
    authorization.lookupUserProfile(this.username).then((account) => {
      if (account && !account.errorMessage) {
        this.account = account
        for (var key in account.apps) {
          var gaiaUrl = account.apps[key] + 'projects.json'
          // let options = {
          //   username: this.username,
          //   app: key
          // }
          // storage.getFile('projects.json', options).then((response) => {
          //   this.bsfiles.push({
          //     gaiaUrl: response,
          //     projects: response.data
          //    })
          // })
          axios.get(gaiaUrl)
            .then(response => {
              this.files.push({
                gaiaUrl: response.config.url,
                projects: response.data
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      } else {
        console.log('Error looking up profile for: ' + this.username + ' cause: ' + account.errorMessage)
      }
    })
      .catch(e => {
        console.log('AccountDisplay: Unable to lookup ' + this.username, e)
        this.myClass = 'is-danger'
        this.errorMessage = 'Unable to lookup ' + this.username
        this.hasError = true
      })
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
