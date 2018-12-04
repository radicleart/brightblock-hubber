<template>
  <div class="col-sm-10">
    <form class="form-horizontal">
      {{ result }}
      <div v-if="errors.length" :key="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li
            v-for="(error, index) in errors"
            :key="index"
            v-bind:error="error"
          >
            {{ error }}
          </li>
        </ul>
      </div>

      <div class="form-group">
        <label>Title</label>
        <input
          class="form-control"
          type="password"
          placeholder="Your gaia hub config secret?"
          v-model="config.configSecret"
        />
      </div>

      <div class="form-group">
        <label>Server Name</label>
        <input
          class="form-control"
          type="text"
          placeholder="Server name"
          v-model="config.serverName"
        />
      </div>

      <div class="form-group">
        <label>port</label>
        <input
          class="form-control"
          type="text"
          placeholder="port"
          v-model="config.port"
        />
      </div>

      <div class="form-group">
        <label>driver</label>
        <input
          class="form-control"
          type="text"
          placeholder="driver"
          v-model="config.driver"
        />
      </div>

      <div class="form-group">
        <label>bucket</label>
        <input
          class="form-control"
          type="text"
          placeholder="bucket"
          v-model="config.bucket"
        />
      </div>

      <div class="form-group">
        <label>readUrl</label>
        <input
          class="form-control"
          type="text"
          placeholder="readUrl"
          v-model="config.readUrl"
        />
      </div>

      <div class="form-group">
        <label>accessKeyId</label>
        <input
          class="form-control"
          type="text"
          placeholder="accessKeyId"
          v-model="config.credentials.accessKeyId"
        />
      </div>

      <div class="form-group">
        <label>secretAccessKey</label>
        <input
          class="form-control"
          type="text"
          placeholder="secretAccessKey"
          v-model="config.credentials.secretAccessKey"
        />
      </div>

      <div class="form-group">
        <label>proofsRequired</label>
        <input
          class="form-control"
          type="text"
          placeholder="proofsRequired"
          v-model="config.proofs.proofsRequired"
        />
      </div>

      <div class="form-group">
        <label>proofsRequired</label>
        <input
          class="form-control"
          type="text"
          placeholder="proofsRequired"
          v-model="config.argsTransport.level"
        />
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="handleExceptions"
          v-model="config.argsTransport.handleExceptions"
        />
        <label class="form-check-label" for="handleExceptions"
          >handleExceptions</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="stringify"
          v-model="config.argsTransport.stringify"
        />
        <label class="form-check-label" for="stringify">stringify</label>
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="timestamp"
          v-model="config.argsTransport.timestamp"
        />
        <label class="form-check-label" for="timestamp">timestamp</label>
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="colorize"
          v-model="config.argsTransport.colorize"
        />
        <label class="form-check-label" for="colorize">colorize</label>
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="json"
          v-model="config.argsTransport.json"
        />
        <label class="form-check-label" for="json">json</label>
      </div>

      <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary"
          v-on:click.prevent="gaiaHubConfig"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      result: null,
      errors: [],
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
  methods: {
    gaiaHubConfig() {
      let gaiaHubUrl = this.$store.state.constants.gaiaHubUrl + "/config";
      axios({
        method: "post",
        url: gaiaHubUrl,
        data: this.config,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          this.result = response.data;
        })
        .catch(e => {
          this.result = e.message;
        });
    }
  }
};
</script>
