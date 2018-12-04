<template>
  <div class="col-sm-10">
    <h5 class="">Main Settings</h5>
    <div class="row">
      <div class="col-sm-2">Domain:</div>
      <div class="col-sm-10">{{ constants.domain }}</div>
    </div>
    <div class="row">
      <div class="col-sm-2">Environment:</div>
      <div class="col-sm-10">{{ constants.environment }}</div>
    </div>

    <h5 class="mt-3">API Settings</h5>
    <div class="row">
      <div class="col-sm-2">Shape Shift:</div>
      <div class="col-sm-10">{{ constants.shapeShiftUrl }}</div>
    </div>
    <div class="row">
      <div class="col-sm-2">Search:</div>
      <div class="col-sm-10">{{ constants.searchUrl }}</div>
    </div>
    <div class="row">
      <div class="col-sm-2">Eth Gateway:</div>
      <div class="col-sm-10">{{ constants.ethGatewayUrl }}</div>
    </div>

    <h5 class="mt-3">Debug Settings</h5>
    <div class="row">
      <div class="col-sm-2">Debug Mode:</div>
      <div class="col-sm-10">
        <a
          href="#"
          class="badge badge-primary white"
          @click.prevent="toggleDebugMode"
          >{{ debugMode }}</a
        >
      </div>
    </div>

    <h5 class="mt-3">Gaia Test Settings</h5>
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-10">
        <a
          href="#"
          class="badge badge-primary white"
          @click.prevent="gaiaHubInfoCheck"
          >Check Hub Info</a
        >
        <a
          href="#"
          class="badge badge-primary white"
          @click.prevent="gaiaListFilesCheck"
          >Check List Files</a
        >
        <a
          href="#"
          class="badge badge-primary white"
          @click.prevent="gaiaStoreCheck"
          >Store Random File</a
        >
      </div>
    </div>
    <div class="row" v-if="gaiaResult">
      <div class="col-sm-2"></div>
      <div class="col-sm-10">{{ gaiaResult }}</div>
    </div>
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-10">
        <ul>
          <li v-for="(index, file) in gaiaListResult" :key="index">
            {{ file }}:
            <a href="#" @click.prevent="gaiaGetFile(index)">{{ index }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="row" v-if="gaiaFileResult">
      <div class="col-sm-2"></div>
      <div class="col-sm-10">{{ gaiaFileResult }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const gaiaAuthToken =
  "v1:eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJnYWlhQ2hhbGxlbmdlIjoiW1wiZ2FpYWh1YlwiLFwiMjAxOFwiLFwiXCIsXCJibG9ja3N0YWNrX3N0b3JhZ2VfcGxlYXNlX3NpZ25cIl0iLCJodWJVcmwiOiJodHRwczovL2dhaWEuYnJpZ2h0YmxvY2sub3JnIiwiaXNzIjoiMDIyNmVlZjk2MDI4YWYwMTQ1M2YwYzk2NGE0MTcxMGEzZDgwNGQ3MGY2MTgyOTZkMGVjMzczY2MxMGFhYjEwNjM4Iiwic2FsdCI6ImRmODk3YWRkMjVjZDBiNjE1MjUxZjViMmY1OGI3ODllIn0.FoeOdvMqWFU9tqVtToUHE7axjsA0YK_YArhFCXQ0eytRvJbkeW2S1h2V_iQF2311wq322CaPoIRZIxC6Rgqccg";

export default {
  data() {
    return {
      gaiaHubUrl: "",
      address: "",
      gaiaListResult: [],
      gaiaResult: null,
      gaiaStoreResult: null,
      gaiaFileResult: null
    };
  },
  created() {
    let hubConfig = localStorage.getItem("blockstack-gaia-hub-config");
    let hubJSON = JSON.parse(hubConfig);
    this.address = hubJSON.address;
    this.gaiaHubUrl = this.$store.state.constants.gaiaHubUrl;
  },
  methods: {
    toggleDebugMode() {
      this.$store.commit("debugMode");
    },
    listFilesUrl(file) {
      return this.gaiaHubUrl + "/" + this.address + "/" + file;
    },
    gaiaHubInfoCheck() {
      this.gaiaFileResult = null;
      this.gaiaListResult = [];
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/hub_info",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          this.gaiaResult = response.data;
        })
        .catch(e => {
          this.gaiaResult = e.message;
        });
    },
    gaiaListFilesCheck() {
      this.gaiaFileResult = null;
      this.gaiaListResult = [];
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/list-files/" + this.address,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      let $self = this;
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          $self.gaiaListResult = response.data;
        })
        .catch(e => {
          $self.gaiaResult = e.message;
        });
    },
    gaiaStoreCheck() {
      this.gaiaResult = null;
      this.gaiaFileResult = null;
      let data = {
        test: "test storing a file in aws s3 bucket via gaia",
        random: Math.random().toString(36)
      };
      axios({
        method: "post",
        url:
          this.gaiaHubUrl + "/store/" + this.address + "/gaia_store_test.json",
        data: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      })
        .then(response => {
          this.gaiaStoreResult = response.data;
          this.gaiaGetFile("gaia_store_test.json");
        })
        .catch(e => {
          this.gaiaStoreResult = e.message;
        });
    },
    gaiaGetFile(file) {
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/" + this.address + "/" + file,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      let $self = this;
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          $self.gaiaFileResult = response.data;
        })
        .catch(e => {
          $self.gaiaFileResult = e.message;
        });
    }
  },
  computed: {
    debugMode() {
      let debugMode = this.$store.getters["isDebugMode"];
      return debugMode;
    },
    constants() {
      return this.$store.state.constants;
    }
  },
  components: {}
};
</script>
