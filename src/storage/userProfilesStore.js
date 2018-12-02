// myAccountStore.js
import userProfilesService from '@/services/userProfilesService'
import _ from 'lodash'

const userProfilesStore = {
  namespaced: true,
  state: {
    userProfiles: [],
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
    getGaiaUrl: (state) => (username) => {
      let gaiaUrl
      let profiles = state.userProfiles.filter(profile => profile.username === username)
      if (profiles.length > 0) {
        let domain = location.origin
        let profile = profiles[0]
        for (var key in profile.apps) {
          if (key === domain) {
            gaiaUrl = profile.apps[key]
          }
        }
      }
      return gaiaUrl
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
    fetchUserProfile ({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        if (!user.username || user.username.length === 0 || user.username.indexOf('not given') > -1) {
          resolve()
        }
        let userProfiles = state.userProfiles
        let index = _.findIndex(userProfiles, function (o) {
          return o.username === user.username
        })
        if (index === -1) {
          userProfilesService.fetchUserProfile(user.username, function (userProfile) {
            commit('addUser', userProfile)
            resolve(userProfile)
          },
          function (error) {
            console.log('Error fetching user profile for: ' + user.username, error)
            resolve()
          })
        } else {
          resolve(userProfiles[index])
        }
      })
    },
  }
}
export default userProfilesStore
