import axios from "axios";
import CryptoJS from "crypto-js";
import {
  Person,
  loadUserData,
  handlePendingSignIn,
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  signUserOut
} from "blockstack";
import store from "@/storage/store";

const HUBBER_SC_KEY = "HUBBER_SC_KEY";

const myAccountService = {
  myProfile: function() {
    let myProfile = {
      loggedIn: false
    };
    let account = loadUserData();
    if (account) {
      let person = new Person(account.profile);
      myProfile = {
        loggedIn: true,
        name: person.name(),
        description: person.description(),
        avatarUrl: person.avatarUrl(),
        username: account.username,
        hubUrl: account.hubUrl,
        apps: account.profile.apps
      };
    }
    return myProfile;
  },
  encryptContent: function(data, password) {
    try {
      var cyphered = CryptoJS.AES.encrypt(JSON.stringify(data), password);
      localStorage.setItem(HUBBER_SC_KEY, cyphered.toString());
    } catch (e) {
      console.log("Error storing encrypted config" + e.message);
      throw e;
    }
  },
  decryptContent: function(data, password) {
    var cyphered = localStorage.getItem(HUBBER_SC_KEY);
    var bytes = CryptoJS.AES.decrypt(cyphered, password);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
    return decryptedData;
  },
  handlePending: function() {
    handlePendingSignIn().then(function() {
      store.dispatch("myAccountStore/fetchMyAccount");
    });
  },
  isPending: function() {
    return isSignInPending();
  },
  canLogIn: function() {
    return new Promise(resolve => {
      axios
        .get("http://localhost:6270/v1/ping")
        .then(response => {
          resolve(response.data.status === "alive");
        })
        .catch(e => {
          console.log("No one listening on 6270?", e);
          resolve(true);
        });
    });
  },
  isLoggedIn: function() {
    if (isUserSignedIn()) {
      store.dispatch("myAccountStore/fetchMyAccount");
      return true;
    } else if (isSignInPending()) {
      myAccountService.handlePending();
      return false;
    } else {
      return false;
    }
  },
  logout: function() {
    signUserOut(window.location.origin);
    store.dispatch("myAccountStore/fetchMyAccount");
  },
  loginMultiPlayer: function() {
    if (!this.isLoggedIn()) {
      const origin = window.location.origin;
      redirectToSignIn(origin, origin + "/manifest.json", [
        "store_write",
        "publish_data"
      ]);
    }
  },
  login: function() {
    if (!this.isLoggedIn()) {
      redirectToSignIn();
      store.dispatch("myAccountStore/fetchMyAccount");
    }
  }
};
export default myAccountService;
