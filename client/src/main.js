import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Clock from "./components/Clock.vue";

Vue.config.productionTip = false;
Vue.component("clock", Clock);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
