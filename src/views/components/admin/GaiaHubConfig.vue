<template>
<form novalidate class="md-layout" @submit.prevent="validate">
  <div>
    <md-dialog :md-active.sync="reloadDialog">
      <md-dialog-title>Config Uploaded</md-dialog-title>
      <md-dialog-content>Clicking 'Reload Hub' will activate your new settings. We will test the
      the new settings by writing a file to your storage.
      <br><br>The '<md-icon>sync</md-icon>' icon (top right of the form)
      can be used to reload the original config file.</md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="reloadHub">Reload Hub</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
  <div>
    <md-dialog :md-active.sync="reloadResultDialog">
      <md-dialog-title>Reload Result</md-dialog-title>
      <md-dialog-content>{{hubMessage}}</md-dialog-content>
      <md-dialog-content>Your hub has been reloaded and tested by writing and reading the
      above data to your storage provider.</md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
  <div class="md-layout-item md-size-100 md-xsmall-size-100 md-layout md-alignment-center-right">
    <span @click="reloadConfig">
      <md-icon>sync</md-icon>
      <md-tooltip md-direction="top">load backed up config</md-tooltip>
    </span>
  </div>
  <div class="md-layout-item md-size-100 md-xsmall-size-100">
    <p v-for="(error, index) in errors" :key="index" class="text-danger">
      {{error}}
    </p>
  </div>
  <div class="md-layout-item md-size-50 md-xsmall-size-50">
    <md-field>
      <label>Server</label>
      <md-input v-model="gaiaConfig.serverName" type="text"></md-input>
    </md-field>
  </div>
  <div class="md-layout-item md-size-50 md-xsmall-size-50">
    <md-field>
      <label>Port</label>
      <md-input v-model="gaiaConfig.port" type="number"></md-input>
    </md-field>
  </div>
  <div class="md-layout-item md-size-100 md-xsmall-size-100">
    <md-field>
      <label>Bucket</label>
      <md-input v-model="gaiaConfig.bucket" type="text"></md-input>
    </md-field>
  </div>
  <div class="md-layout-item md-size-100 md-xsmall-size-100">
    <md-field>
      <label>Read Url</label>
      <md-input v-model="gaiaConfig.readURL" type="text"></md-input>
    </md-field>
  </div>
  <div class="md-layout-item md-size-50 md-xsmall-size-100">
    <md-field>
      <label>List Files Page Size</label>
      <md-input v-model="gaiaConfig.pageSize" type="number"></md-input>
    </md-field>
  </div>
  <div class="md-layout-item md-size-50 md-xsmall-size-100">
    <md-field>
      <label>Proofs - number of social proofs required of the user.</label>
      <md-input v-model="gaiaConfig.proofsConfig" type="number"></md-input>
    </md-field>
  </div>
  <div class="md-layout-item md-size-100 md-xsmall-size-100">
    <md-field>
      <label>White list - who can write to it and list its files (space separated)</label>
      <md-input v-model="gaiaConfig.whiteList" type="text"></md-input>
    </md-field>
  </div>

  <div class="md-layout-item md-size-100 md-xsmall-size-100">
    <div class="flex-column">
      <md-checkbox v-model="gaiaConfig.requireCorrectHubUrl">Require Valid Hub Urls</md-checkbox>
    </div>
  </div>
  <div class="md-layout-item md-size-100 md-xsmall-size-100" v-if="gaiaConfig.requireCorrectHubUrl">
    <md-field>
      <label>Hub Urls - auth requests correctly include the hubURL they are trying to connect with.</label>
      <md-input v-model="gaiaConfig.validHubUrls" type="text"></md-input>
    </md-field>
  </div>

  <div class="md-layout-item md-size-100">
    <div class="title">
      <h3>Select Driver (Backend Storage System)</h3>
    </div>
    <div class="flex-column">
      <md-radio v-model="gaiaConfig.driver" value="aws">AWS</md-radio>
      <md-radio v-model="gaiaConfig.driver" value="azure">Azure</md-radio>
      <md-radio v-model="gaiaConfig.driver" value="google">Google</md-radio>
      <md-radio v-model="gaiaConfig.driver" value="disk">Local disk</md-radio>
      <md-radio v-model="gaiaConfig.driver" value="dropbox" disabled>Dropbox</md-radio>
    </div>
  </div>

  <div class="md-layout-item md-size-100 md-xsmall-size-100" v-if="gaiaConfig.driver === 'aws'">
    <div class="title">
      <h3>AWS Credentials</h3>
    </div>
    <div class="md-layout-item md-size-100 md-xsmall-size-50">
      <md-field>
        <label>Access Key Id</label>
        <md-input v-model="gaiaConfig.awsCredentials.accessKeyId" type="text"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-100 md-xsmall-size-50">
      <md-field>
        <label>Secret Access Key</label>
        <md-input v-model="gaiaConfig.awsCredentials.secretAccessKey" type="text"></md-input>
      </md-field>
    </div>
  </div>

  <div class="md-layout-item md-size-100 md-xsmall-size-100" v-if="gaiaConfig.driver === 'disk'">
    <div class="title">
      <h3>Local Disk</h3>
    </div>
    <div class="md-layout-item md-size-100 md-xsmall-size-50">
      <md-field>
        <label>Root Storage Directory</label>
        <md-input v-model="gaiaConfig.diskSettings.storageRootDirectory" type="text"></md-input>
      </md-field>
    </div>
  </div>

  <div class="md-layout-item md-size-100 md-xsmall-size-100" v-if="gaiaConfig.driver === 'azure'">
    <div class="title">
      <h3>Azure Credentials</h3>
    </div>
    <div class="md-layout-item md-size-100 md-xsmall-size-100">
      <md-field>
        <label>Account Key</label>
        <md-input v-model="gaiaConfig.azCredentials.accountKey" type="text"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-100 md-xsmall-size-100">
      <md-field>
        <label>Account Name</label>
        <md-input v-model="gaiaConfig.azCredentials.accountName" type="text"></md-input>
      </md-field>
    </div>
  </div>

  <div class="md-layout-item md-size-100 md-xsmall-size-100" v-if="gaiaConfig.driver === 'google'">
    <div class="title">
      <h3>Google Credentials</h3>
    </div>
    <div class="md-layout-item md-size-100 md-xsmall-size-100">
      <md-field>
        <label>Project Id</label>
        <md-input v-model="gaiaConfig.gcCredentials.projectId" type="text"></md-input>
      </md-field>
    </div>
  </div>

  <div class="md-layout-item md-size-50 md-xsmall-size-100">
    <md-button class="md-primary" @click="saveGaiaConfig">Upload Config</md-button>
  </div>

</form>
</template>

<script>
export default {
  data() {
    return {
      gaiaConfig: {},
      errors: [],
      hubMessage: null,
      reloadDialog: false,
      reloadResultDialog: false
    };
  },
  mounted() {
    let gaiaConfig = this.$store.getters["hubberStore/getActiveGaiaConfig"];
    if (!gaiaConfig) {
      gaiaConfig = {};
    }
    this.gaiaConfig = gaiaConfig;
  },
  methods: {
    saveGaiaConfig() {
      this.validate();
      if (this.errors.length > 0) {
        this.$emit(
          "alertUser",
          "Errors in your settings - please see the errors above the form"
        );
        return;
      }
      this.$store
        .dispatch("hubberStore/updateGaiaConfig", this.gaiaConfig)
        // eslint-disable-next-line
        .then(message => {
          this.hubMessage = message;
          this.reloadDialog = true;
          // eslint-disable-next-line
      }).catch(e => {
          this.$emit(
            "alertUser",
            "Unable to contact hub using these settings. "
          );
        });
    },
    reloadConfig() {
      this.$store.commit("hubberStore/resetLiveGaiaConfig");
      this.gaiaConfig = this.$store.getters["hubberStore/getActiveGaiaConfig"];
      this.$emit(
        "alertUser",
        "Switched form to original hub settings - press 'Upload Config'. "
      );
    },
    reloadHub() {
      this.reloadDialog = false;
      this.$store
        .dispatch("hubberStore/reloadGaiaHub")
        // eslint-disable-next-line
        .then(message => {
          this.hubMessage = "hubber_test.json: " + message;
          this.reloadResultDialog = true;
          // eslint-disable-next-line
      }).catch(e => {
          this.$emit("alertUser", e);
        });
    },
    closeDialog() {
      this.reloadDialog = false;
      this.reloadResultDialog = false;
    },
    validate() {
      this.errors = [];
      try {
        let driver = this.gaiaConfig.driver;
        if (!driver) {
          this.errors.push("Please select a driver.");
        } else if (driver === "aws") {
          if (!this.gaiaConfig.awsCredentials.accessKeyId) {
            this.errors.push("accessKeyId required for aws driver.");
          }
          if (!this.gaiaConfig.awsCredentials.secretAccessKey) {
            this.errors.push("Secret access key required for aws driver.");
          }
        } else if (driver === "azure") {
          if (!this.gaiaConfig.azCredentials.accountKey) {
            this.errors.push("account key required for azure driver.");
          }
          if (!this.gaiaConfig.azCredentials.accountName) {
            this.errors.push("account name required for azure driver.");
          }
        } else if (driver === "google") {
          if (!this.gaiaConfig.gcCredentials.projectId) {
            this.errors.push("project id required for google cloud driver.");
          }
        } else if (driver === "disk") {
          if (!this.gaiaConfig.diskSettings.storageRootDirectory) {
            this.errors.push(
              "storage root directory required for disk driver."
            );
          }
        }

        let proofs = Number(this.gaiaConfig.proofsConfig);
        if (proofs < 0 || proofs > 5) {
          this.errors.push("Proofs required must be in range 0 to 5.");
        } else {
          this.gaiaConfig.proofsConfig = proofs;
        }

        let pageSize = Number(this.gaiaConfig.pageSize);
        if (pageSize < 0 || pageSize > 50) {
          this.errors.push("Page size required must be in range 0 to 50.");
        } else {
          this.gaiaConfig.pageSize = pageSize;
        }

        let requireCorrectHubUrl = this.gaiaConfig.requireCorrectHubUrl;
        let validHubUrls = this.gaiaConfig.validHubUrls;
        if (requireCorrectHubUrl) {
          if (!validHubUrls || validHubUrls.length === 0) {
            this.errors.push(
              "Please list the urls (space separated) " +
                "allowed to make requests to this hub."
            );
          } else {
            this.gaiaConfig.validHubUrls = validHubUrls.split(" ");
          }
        } else {
          this.gaiaConfig.validHubUrls = [];
        }

        let whiteList = this.gaiaConfig.whiteList;
        if (!whiteList || whiteList.length === 0) {
          this.gaiaConfig.whiteList = [];
        } else {
          this.gaiaConfig.whiteList = whiteList.split(" ");
        }
      } catch (e) {
        this.errors.push(e);
      }
    }
  },
  computed: {},
  components: {}
};
</script>
