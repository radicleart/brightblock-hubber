import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import MaterialKit from "./plugins/material-kit";
import store from "@/storage/store";

Vue.config.productionTip = false;

Vue.use(MaterialKit);

const NavbarStore = {
  showNavbar: false
};

store.dispatch("myAccountStore/fetchMyAccount");

Vue.mixin({
  data() {
    return {
      NavbarStore
    };
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
