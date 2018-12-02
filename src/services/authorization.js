import axios from 'axios'
import {
  Person,
  lookupProfile,
  loadUserData,
  handlePendingSignIn,
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  signUserOut
} from 'blockstack'

const authorization = {
  lookupUserProfile: function (name) {
    if (!name || name.indexOf('.') === -1) {
      name = this.loadUserData().username
    }
    return new Promise(resolve => {
      console.log('lookupUserProfile: resolving : ' + name)
      lookupProfile(name)
        .then((profile) => {
          let person = new Person(profile.person)
          profile.person = person
          console.log('lookupUserProfile: profile : ' + profile)
          resolve(profile)
        }).catch(e => {
          console.log('lookupUserProfile: e : ', e)
          resolve({username: name, errorMessage: e})
        })
    })
  },
  getUserData: function () {
    return new Promise(resolve => {
      const userData = loadUserData()
      let person = new Person(userData.profile)
      let account = {
        name: person.name(),
        description: person.description(),
        avatarUrl: person.avatarUrl(),
        username: userData.username,
        // appPrivateKey: userData.appPrivateKey,
        // authResponseToken: userData.authResponseToken,
        hubUrl: userData.hubUrl,
        apps: userData.profile.apps
      }
      console.log('getUserData', account)
      resolve(account)
    })
  },
  loadUserData: function () {
    this.userData = loadUserData()
    let person = new Person(this.userData.profile)
    if (this.userData.profile && this.userData.profile.givenName && this.userData.profile.givenName.length > 0) {
      this.name = person.name()
      this.avatarUrl = person.avatarUrl()
    } else {
      this.name = this.userData.username
    }
    return this.userData
  },
  handlePending: function () {
    return new Promise(resolve => {
      handlePendingSignIn().then(function (userData) {
        authorization.loadUserData()
        resolve(userData)
      })
    })
  },
  isPending: function () {
    return isSignInPending()
  },
  canLogIn: function () {
    return new Promise(resolve => {
      axios.get('http://localhost:6270/v1/ping')
        .then(response => {
          resolve(response.data.status === 'alive')
        })
        .catch(e => {
          console.log('No one listening on 6270?')
          resolve(true)
        })
    })
  },
  fetchNames: function (page) {
    return new Promise(resolve => {
      axios.get('https://core.brightblock.org/v1/names?page=' + page)
        .then(response => {
          resolve(response)
        })
        .catch(e => {
          resolve(false)
        })
    })
  },
  fetchFilesDirect: function (page) {
    return new Promise(resolve => {
      axios.get('https://core.brightblock.org/v1/names?page=' + page)
        .then(response => {
          resolve(response)
        })
        .catch(e => {
          resolve(false)
        })
    })
  },
  fetchName: function (name) {
    if (!name || name.indexOf('.id') === -1) {
      name = this.getUsername()
    }
    return new Promise(resolve => {
      axios.get('https://core.brightblock.org/v1/names/' + name)
        .then(response => {
          resolve(response)
        })
        .catch(e => {
          resolve(false)
        })
    })
  },
  isLoggedIn: function () {
    if (isUserSignedIn()) {
      authorization.loadUserData()
      return true
    } else if (isSignInPending()) {
      authorization.handlePending()
      return false
    } else {
      return false
    }
  },
  logout: function (event) {
    signUserOut(window.location.origin)
  },
  loginMultiPlayer: function (event) {
    if (!this.isLoggedIn()) {
      const origin = window.location.origin
      redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
    }
  },
  login: function (event) {
    if (!this.isLoggedIn()) {
      redirectToSignIn()
    }
  }
}
export default authorization
