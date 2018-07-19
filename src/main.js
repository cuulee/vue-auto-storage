import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import AutoStorage from "./lib/index";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(AutoStorage);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
