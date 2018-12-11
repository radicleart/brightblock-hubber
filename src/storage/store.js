// store.js
import Vue from "vue";
import Vuex from "vuex";
import { CONSTANTS } from "./constants";
import myAccountStore from "./myAccountStore";
import hubberStore from "./hubberStore";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    myAccountStore: myAccountStore,
    hubberStore: hubberStore
  },
  state: {
    constants: {},
    serverTime: {}
  },
  getters: {
    isDebugMode: state => {
      return state.constants.debugMode;
    },
    serverTime: state => {
      return state.serverTime;
    }
  },
  mutations: {
    serverTime(state, serverTime) {
      state.serverTime = serverTime;
    },
    constants(state) {
      state.constants = CONSTANTS;
    },
    debugMode(state) {
      state.constants.debugMode = !state.constants.debugMode;
    }
  },
  actions: {}
});
export default store;
