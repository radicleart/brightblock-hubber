import axios from "axios";

const SERVER_URL = process.env.ETH_GATEWAY_URL;

const xhrService = {
  makeDirectCall: function(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          if (response.failed) {
            reject(new Error(response.message));
          }
          resolve(response.data);
        })
        .catch(e => {
          reject(new Error(e.message));
        });
    });
  },
  makeGetCall: function(command, args) {
    let callInfo = {
      method: "get",
      url: SERVER_URL + command,
      headers: {
        "Content-Type": "application/json"
      }
    };
    for (var key in args) {
      callInfo.url += "/" + args[key];
    }
    return new Promise((resolve, reject) => {
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          if (response.failed) {
            reject(new Error(response.message));
          }
          resolve(response.data.details);
        })
        .catch(e => {
          reject(new Error(e.message));
        });
    });
  },
  makePostCall: function(command, data) {
    let callInfo = {
      method: "post",
      url: SERVER_URL + command,
      headers: {
        "Content-Type": "application/json"
      }
    };
    return new Promise((resolve, reject) => {
      axios
        .post(callInfo.url, data)
        .then(response => {
          if (response.failed) {
            reject(new Error(response.message));
          }
          resolve(response.data.details);
        })
        .catch(e => {
          reject(new Error(e.message));
        });
    });
  }
};
export default xhrService;
