<template>
  <section>
    <account-profile :username="username" :account="account" :filename="filename" :error="error"/>
    <account-zonefile :username="username" :zonefile="zonefile" :error="error"/>
  </section>
</template>

<script>
import authorization from '../../services/authorization'
import AccountZonefile from './AccountZonefile'
import AccountProfile from './AccountProfile'
import AccountUserData from './AccountUserData'

export default {
  name: 'AccountDisplay',
  props: [ 'username' ],
  data () {
    return {
      error: {
        errorMessage: '',
        hasError: false,
        myClass: '',
      },
      filename: 'projects.json',
      zonefile: {},
      account: {},
      files: {}
    }
  },
  components: {
    AccountZonefile,
    AccountProfile,
    AccountUserData
  },
  mounted () {
    if (!this.username) {
      this.username = authorization.getUsername()
    }
    authorization.lookupUserProfile(this.username).then((account) => {
      if (account && !account.errorMessage) {
        this.account = account
      } else {
        console.log('Error looking up profile for: ' + this.username + ' cause: ' + account.errorMessage)
      }
    }).catch(e => {
      console.log('AccountDisplay: Unable to lookup ' + this.username, e)
      this.myClass = 'is-danger'
      this.errorMessage = 'Unable to lookup ' + this.username
      this.hasError = true
    })
    authorization.fetchName(this.username).then((zonefile) => {
      if (zonefile) {
        console.log('AccountLookup: zonefile: ', zonefile)
        this.zonefile = zonefile.data
        if (!this.zonefile.zonefile || zonefile.data.status === 'registered_subdomain') {
          this.zonefile.zonefile = zonefile.data.zonefile_txt
        }
      }
    })
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
