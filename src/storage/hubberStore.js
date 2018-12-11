import hubberService from "@/services/hubberService";
import axios from "axios";

const hubberStore = {
  namespaced: true,
  state: {
    apiData: null,
    gaiaConfigs: [],
    gaiaConfigBackup: null
  },
  getters: {
    getGaiaConfig: state => configName => {
      if (state.gaiaConfigs.length === 0) {
        return state.gaiaConfigBackup;
      }
      let configs = state.gaiaConfigs.filter(
        gaiaConfig => gaiaConfig.configName === configName
      );
      if (!configs) {
        return state.gaiaConfigs[0];
      } else {
        return configs[0];
      }
    },
    getBackedUpGaiaConfig: state => {
      return state.gaiaConfigBackup;
    },
    getApiData: state => {
      return state.apiData;
    }
  },
  mutations: {
    putApiData(state, data) {
      state.apiData = data.apiData;
      hubberService.stashApiData(data.apiData, data.password);
    },
    putLiveGaiaConfig(state, gaiaConfig) {
      state.gaiaConfigBackup = gaiaConfig;
    }
  },
  actions: {
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
            // console.log(e);
            reject(false);
          });
      });
    },
    updateGaiaConfig({ state }, gaiaConfig) {
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
            console.log(response.data.message);
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
          .then(response => {
            console.log(response.data);
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
            reject("Reload failed...");
          });
      });
    }
  }
};
export default hubberStore;
