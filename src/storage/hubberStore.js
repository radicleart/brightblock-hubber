import hubberService from "@/services/hubberService";
import axios from "axios";

const hubberStore = {
  namespaced: true,
  state: {
    apiData: null,
    password: null,
    activeGaiaConfig: null,
    gaiaConfigBackup: null
  },
  getters: {
    getActiveGaiaConfig: state => {
      if (!state.activeGaiaConfig) {
        let backup = hubberService.fetchStashedGaiaData(state.password);
        state.activeGaiaConfig = backup;
      }
      return state.activeGaiaConfig;
    },
    getBackedUpGaiaConfig: state => {
      let backup = hubberService.fetchStashedGaiaData(state.password);
      return backup;
    },
    getApiData: state => {
      return state.apiData;
    }
  },
  mutations: {
    putApiData(state, data) {
      state.apiData = data.apiData;
      state.password = data.password;
      hubberService.stashApiData(state.apiData, state.password);
    },
    putLiveGaiaConfig(state, gaiaConfig) {
      let backup = hubberService.fetchStashedGaiaData(state.password);
      if (!backup) {
        state.gaiaConfigBackup = gaiaConfig;
        hubberService.stashLiveConfig(gaiaConfig, state.password);
      }
    },
    resetLiveGaiaConfig(state) {
      let backup = hubberService.fetchStashedGaiaData(state.password);
      state.activeGaiaConfig = backup;
    },
    putGaiaConfig(state, gaiaConfig) {
      state.activeGaiaConfig = gaiaConfig;
      hubberService.stashActiveGaiaConfig(gaiaConfig, state.password);
    }
  },
  actions: {
    isApiDataValid({ state }) {
      return new Promise((resolve, reject) => {
        let configExists = hubberService.checkForStashedApiData();
        if (configExists && state.apiData) {
          if (state.apiData) {
            this.$store
              .dispatch("hubberStore/fetchGaiaConfig")
              // eslint-disable-next-line
              .then(gaiaConfig => {
                resolve(true);
              })
              // eslint-disable-next-line
            .catch(e => {
                reject(false);
              });
          }
        }
      });
    },
    fetchGaiaConfig({ state, commit }) {
      return new Promise((resolve, reject) => {
        let apiData = state.apiData;
        axios({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiData.apiKey
          },
          method: "get",
          url: apiData.url + "/v1/admin/config"
        })
          .then(response => {
            let gaiaConfig = response.data.config;
            gaiaConfig = hubberService.sanitiseGaiaConfig(gaiaConfig);
            commit("putLiveGaiaConfig", gaiaConfig);
            resolve(gaiaConfig);
          })
          // eslint-disable-next-line
          .catch(e => {
            reject(false);
          });
      });
    },
    updateGaiaConfig({ state, commit }, gaiaConfig) {
      return new Promise((resolve, reject) => {
        let apiData = state.apiData;
        axios({
          method: "post",
          url: apiData.url + "/v1/admin/config",
          data: gaiaConfig,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiData.apiKey
          }
        })
          .then(response => {
            commit("putGaiaConfig", gaiaConfig);
            resolve(response.data.message);
          })
          // eslint-disable-next-line
          .catch(e => {
            // console.log(e);
            reject(false);
          });
      });
    },
    reloadGaiaHub({ state }) {
      return new Promise((resolve, reject) => {
        let apiData = state.apiData;
        axios({
          method: "post",
          url: apiData.url + "/v1/admin/reload",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiData.apiKey
          }
        })
          // eslint-disable-next-line
          .then(response => {
            hubberService.writeTestFile(
              function() {
                hubberService.readTestFile(
                  function(file) {
                    resolve(file);
                  },
                  function(error) {
                    reject(error);
                  }
                );
              },
              function(error) {
                reject(error);
              }
            );
          })
          // eslint-disable-next-line
          .catch(e => {
            // console.log(e);
            reject("Error writing test new config - are you logged in?");
          });
      });
    }
  }
};
export default hubberStore;
