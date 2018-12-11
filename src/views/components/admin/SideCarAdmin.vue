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
      <h3>Gaia Hub Configuration
      <span @click="editApiConfig()" class="md-alignment-center-right">
        <md-icon>edit</md-icon>
        <md-tooltip md-direction="top">edit api config settings</md-tooltip>
      </span>
      </h3>
        <md-dialog-alert
            :md-active.sync="history"
            md-content="Configs - most recently loaded at top.."
            md-confirm-text="Done!" />
        <!--
        <span @click="toggleHistory()">
          <md-icon>history</md-icon>
          <md-tooltip md-direction="top">show history</md-tooltip>
        </span>
        -->

    </div>
    <gaia-hub-config v-if="!editAdminApiConfig" @alertUser="alertUser"/>
  </div>
  <!-- end editGaiaConfig -->
</div>
</template>

<script>
import AdminApiConfig from "./AdminApiConfig";
import GaiaHubConfig from "./GaiaHubConfig";
export default {
  data() {
    return {
      editAdminApiConfig: true,
      history: false,
      showAlert: false,
      alertMessage: null
    };
  },
  mounted() {
    this.editAdminApiConfig = true;
    this.$store.dispatch("hubberStore/isApiDataValid").then(result => {
      this.editAdminApiConfig = result;
    });
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
