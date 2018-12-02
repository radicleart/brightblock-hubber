// myAccountStore.js
import peerToPeerService from '@/services/peerToPeerService'
import _ from 'lodash'

const peerToPeerStore = {
  namespaced: true,
  state: {
    peers: [],
  },
  getters: {
    getProfile: (state) => (username) => {
      if (!username) {
        return {}
      }
      let matches = state.userProfiles.filter(profile => profile.username === username)
      if (matches.length > 0) {
        return matches[0]
      } else {
        // store.dispatch('userProfilesStore/fetchUserProfile', {username: username}, {root: true})
        return {}
      }
    },
    getProfiles: (state) => {
      return state.userProfiles
    },
  },
  mutations: {
    addUser (state, userProfile) {
      let index = _.findIndex(state.userProfiles, function (o) {
        return o.username === userProfile.username
      })
      if (index === -1) {
        state.userProfiles.push(userProfile)
      }
    },
  },
  actions: {
    addPeerToPeerUser ({ commit, state }, user) {
      return new Promise((resolve, reject) => {
      })
    },
  }
}
export default peerToPeerStore
