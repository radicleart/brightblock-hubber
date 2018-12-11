import CryptoJS from "crypto-js";
import { getFile, putFile } from "blockstack";

const HUBBER_SC_KEY = "HUBBER_SC_KEY";

const hubberService = {
  stashApiData: function(data, password) {
    try {
      var cyphered = CryptoJS.AES.encrypt(JSON.stringify(data), password);
      localStorage.setItem(HUBBER_SC_KEY, cyphered.toString());
    } catch (e) {
      console.log("Error storing encrypted config" + e.message);
      throw e;
    }
  },
  writeTestFile: function(success, failure) {
    let data = {
      test: "test storing a file in user storage via gaia",
      random: Math.random().toString(36)
    };
    putFile("gaia_store_test.json", JSON.stringify(data), {
      encrypt: false
    })
      .then(function(message) {
        success(message);
      })
      .catch(function(e) {
        console.log(e);
        failure({ message: "Error writing file." });
      });
  },
  readTestFile: function(success, failure) {
    getFile("gaia_store_test.json", {
      decrypt: false
    })
      .then(function(message) {
        success(message);
      })
      .catch(function(e) {
        console.log(e);
        failure({ message: "Error reading file." });
      });
  },
  checkForStashedApiData: function() {
    try {
      return localStorage.getItem(HUBBER_SC_KEY) !== "undefined";
    } catch (e) {
      return false;
    }
  },
  fetchStashedApiData: function(password) {
    try {
      var cyphered = localStorage.getItem(HUBBER_SC_KEY);
      var bytes = CryptoJS.AES.decrypt(cyphered, password);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData ? decryptedData : {};
    } catch (e) {
      return {};
    }
  },
  sanitiseGaiaConfig: function(gaiaConfig) {
    if (!gaiaConfig.pageSize) {
      gaiaConfig.pageSize = 20;
    }
    if (!gaiaConfig.azCredentials) {
      gaiaConfig.azCredentials = {};
    }
    if (!gaiaConfig.awsCredentials) {
      gaiaConfig.awsCredentials = {};
    }
    if (!gaiaConfig.gcCredentials) {
      gaiaConfig.gcCredentials = {};
    }
    if (!gaiaConfig.diskSettings) {
      gaiaConfig.diskSettings = {};
    }
    if (!gaiaConfig.proofsConfig) {
      gaiaConfig.proofsConfig = 0;
    }
    if (gaiaConfig.validHubUrls) {
      gaiaConfig.validHubUrls = gaiaConfig.validHubUrls.join(" ");
    } else {
      gaiaConfig.validHubUrls = "";
    }
    if (gaiaConfig.whiteList) {
      gaiaConfig.whiteList = gaiaConfig.whiteList.join(" ");
    } else {
      gaiaConfig.whiteList = "";
    }
    return gaiaConfig;
  }
};
export default hubberService;
