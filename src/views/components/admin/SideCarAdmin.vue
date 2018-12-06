<template>
<div class="md-layout md-alignment-center-center">

  <!-- Select Storage Model -->
  <div class="md-layout-item md-size-100">
    <div class="title">
      <h3>Select Storage Mode</h3>
    </div>
    <div class="flex-column">
      <md-radio v-model="storageModel" value="shared">Shared</md-radio>
      <md-radio v-model="storageModel" value="personal">Personal</md-radio>
    </div>
  </div>
  <!-- end Select Storage Model -->

  <!-- Shared Storage Model -->
  <div class="md-layout-item md-size-100" v-if="storageModel === 'shared'">
    <div class="">
      <p>
        Run a shared Gaia Hub by setting the default "Url for Gaia Hub Connection"
        <a href="http://localhost:8888/account/api" target="_blank">on this screen</a> to
        our Gaia Hub location: <b>https://gaia.brightblock.org</b>.
      </p>
      <p class="">
        The new value will be picked up once you log out and log back in to Blockstack.
      </p>
      <p class="text-warning">
        <md-icon class="text-danger">warning</md-icon> There is no way of migrating data to this hub at the moment so don't do this if you have any data
        from other blockstack d-apps!
      </p>
    </div>
  </div>
  <!-- end Shared Storage Model -->

  <!-- Personal Storage Model -->
  <div class="md-layout-item md-size-100" v-if="storageModel === 'personal'">
    <div class="title">
      <h3>Personal Storage</h3>
      <p class="text-muted">You have a choice here. You can run your own Gaia hub following <a href="https://github.com/blockstack/gaia" arget="_blank">these instructions</a>.</p>
      <p class="text-muted">Deploy and configure your own hub by following the instruction below.</p>
    </div>
    <div class="title">
      <h3>1. Configure Your Gaia Hub</h3>
    </div>
    <!-- Select Storage Provider -->
    <div class="title">
      <h3>Select Storage Provider</h3>
    </div>
    <div class="flex-column">
      <md-radio v-model="config.driver" value="aws">S3 - Amazon Web Services</md-radio>
      <md-radio v-model="config.driver" value="dbx">Dropbox</md-radio>
    </div>
    <!-- end Select Storage Provider -->
    <div v-if="config.driver === 'dbx'">
      <div class="md-layout-item md-size-100 md-xsmall-size-100 md-small-size-100 md-medium-size-100">
        <div class="title">
          <p>Support for Dropbox coming soon..</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="md-layout-item md-size-100 md-xsmall-size-100 md-small-size-100 md-medium-size-100">
        <div class="title">
          <h3>Enter S3 Credentials</h3>
        </div>
        <md-field>
          <label>Url to configure your Gaia Hub</label>
          <md-input v-model="gaiaHubUrl" type="text"></md-input>
        </md-field>
        <md-field>
          <label>Password</label>
          <md-input v-model="password" type="password"></md-input>
        </md-field>
      </div>
    </div>
  </div>
  <!-- end Personal Storage Model -->
</div>
</template>

<script>
import GaiaSettingsNavPills from "./GaiaSettingsNavPills";
export default {
  data() {
    return {
      password: null,
      provider: "dbx",
      storageModel: null,
      config: {
        configSecret: "",
        serverName: "",
        port: "3000",
        driver: "aws",
        bucket: "brightblock",
        readUrl: "https://brightblock.s3.amazonaws.com/",
        credentials: {
          accessKeyId: "AKIAJYFWA7KVAARNJHIQ",
          secretAccessKey: ""
        },
        argsTransport: {
          level: "warn",
          handleExceptions: true,
          stringify: true,
          timestamp: true,
          colorize: false,
          json: true
        },
        proofs: {
          proofsRequired: 0
        }
      }
    };
  },
  mounted() {},
  computed: {
    gaiaHubUrl() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.hubUrl;
    }
  },
  components: {
    GaiaSettingsNavPills
  }
};
</script>
