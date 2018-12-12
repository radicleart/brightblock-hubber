hubber<template>
<div class="md-layout md-alignment-center-center">

  <!-- Select Storage Model -->
  <div class="md-layout-item md-size-100">
    <div class="title">
      <h3>Side Car Configuration</h3>
    </div>
    <md-field>
      <label>{{passwordMessage}}</label>
      <md-input v-model="password" type="password" placeholder="Password for encrypting api data" v-on:blur="decryptApiData" @keyup.enter="decryptApiData"></md-input>
    </md-field>
    <md-field>
      <label>Url for accessing your administrative side car</label>
      <md-input v-model="sideCar.url" type="text"></md-input>
    </md-field>
    <md-field>
      <label>API Key:</label>
      <md-input v-model="sideCar.apiKey" type="text"></md-input>
    </md-field>
    <md-button class="md-primary" @click="stashApiData">Next</md-button>
    <md-progress-bar md-mode="indeterminate" v-if="showProgress"></md-progress-bar>
    <md-dialog-alert
      :md-active.sync="showAlert"
      :md-content="alertMessage"
      md-confirm-text="OK!" />

  </div>
</div>
</template>

<script>
import hubberService from "@/services/hubberService";
export default {
  name: "AdminApiConfig",
  props: {},
  data() {
    return {
      password: null,
      passwordMessage: "Enter a password so we can keep your config safe",
      showProgress: false,
      showAlert: false,
      alertMessage: null,
      sideCar: {}
    };
  },
  mounted() {
    let configExists = hubberService.checkForStashedApiData();
    if (configExists) {
      this.passwordMessage =
        "Enter password to access your previous configuration data.";
    }
  },
  methods: {
    decryptApiData() {
      this.sideCar = hubberService.fetchStashedApiData(this.password);
    },
    stashApiData() {
      this.showProgress = true;
      if (!this.validateApiData()) {
        this.error = true;
        this.showProgress = false;
      } else {
        this.$store.commit("hubberStore/putApiData", {
          password: this.password,
          apiData: this.sideCar
        });
        this.$store
          .dispatch("hubberStore/fetchGaiaConfig")
          // eslint-disable-next-line
          .then(gaiaConfig => {
            this.$emit("loadConfig");
            // eslint-disable-next-line
        }).catch(e => {
            this.alertMessage = "Unable to contact hub using these settings.";
            this.showAlert = true;
          });
        this.showProgress = false;
      }
    },
    validateApiData() {
      this.alertMessage = "";
      let valid = true;
      if (!this.password || this.password.length === 0) {
        this.alertMessage +=
          "<br>Please enter a password so we can encrypt your info";
        valid = false;
      }
      if (!this.sideCar.url || !this.sideCar.url.startsWith("https://")) {
        this.alertMessage += "<br>side car url must start with https://";
        valid = false;
      }
      if (!this.sideCar.apiKey || !this.sideCar.apiKey.length === 0) {
        this.alertMessage += "<br>side car api key required.";
        valid = false;
      }
      return valid;
    }
  },
  computed: {
    gaiaHubUrl() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.hubUrl;
    }
  },
  components: {}
};
</script>
