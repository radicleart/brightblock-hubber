// myAccountStore.js
import myAccountService from '@/services/myAccountService'

const myAccountStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: 'anon',
      loggedIn: false,
      showAdmin: false,
    },
  },
  getters: {
    getMyProfile: (state) => {
      return state.myProfile
    },
  },
  mutations: {
    myProfile (state, myProfile) {
      state.myProfile = myProfile
    },
  },
  actions: {
    fetchMyAccount ({ commit, state }) {
      return new Promise((resolve, reject) => {
        let myProfile = myAccountService.myProfile()
        commit('myProfile', myProfile)
        resolve(myProfile)
      })
    },
  }
}
export default myAccountStore
