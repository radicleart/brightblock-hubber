<template>
<div class="md-layout md-alignment-center-center">
  <md-dialog-alert
    :md-active.sync="showAlert"
    :md-content="alertMessage"
    md-confirm-text="OK!" />

  <admin-api-config v-if="editAdminApiConfig" @loadConfig="loadConfig"/>

  <!-- editGaiaConfig -->
  <div class="md-layout-item md-size-100" v-else>

    <div class="title">
      <h3>Gaia Hub Configuration</h3>
      <p class="text-muted">Load a new Gaia Configuration into your Gaia Hub.
        <md-dialog-alert
            :md-active.sync="history"
            md-content="Configs - most recently loaded at top.."
            md-confirm-text="Done!" />
        <span @click="toggleHistory()">
          <md-icon>history</md-icon>
          <md-tooltip md-direction="top">show history</md-tooltip>
        </span>
        <span @click="reloadConfig">
          <md-icon>sync</md-icon>
          <md-tooltip md-direction="top">sync config from live</md-tooltip>
        </span>
        <span @click="editApiConfig()">
          <md-icon>edit</md-icon>
          <md-tooltip md-direction="top">edit api config settings</md-tooltip>
        </span>
      </p>
    </div>
    <gaia-hub-config :configName="configName" v-if="!editAdminApiConfig" @alertUser="alertUser"/>
  </div>
  <!-- end editGaiaConfig -->
</div>
</template>

<script>
import AdminApiConfig from "./AdminApiConfig";
import GaiaHubConfig from "./GaiaHubConfig";
import hubberService from "@/services/hubberService";
export default {
  data() {
    return {
      configName: "live",
      editAdminApiConfig: true,
      history: false,
      sideCar: {},
      showAlert: false,
      alertMessage: null
    };
  },
  mounted() {
    this.editAdminApiConfig = true;
    let configExists = hubberService.checkForStashedApiData();
    if (configExists) {
      let apiData = this.$store.getters["hubberStore/getApiData"];
      if (apiData) {
        this.$store.dispatch("hubberStore/fetchGaiaConfig").then(gaiaConfig => {
          console.log(gaiaConfig);
          this.editAdminApiConfig = false;
        });
      }
    }
  },
  methods: {
    editApiConfig() {
      this.editAdminApiConfig = true;
    },
    toggleHistory() {
      this.history = !this.history;
    },
    alertUser(message) {
      this.alertMessage = message;
      this.showAlert = true;
    },
    loadConfig() {
      this.editAdminApiConfig = false;
    },
    reloadConfig() {
      // let gaiaConfig = this.$store.getters["hubberStore/getBackedUpGaiaConfig"];
      this.configName = "live";
    }
  },
  computed: {
    gaiaHubUrl() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.hubUrl;
    }
  },
  components: {
    AdminApiConfig,
    GaiaHubConfig
  }
};
</script>
