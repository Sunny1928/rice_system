import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import vuetify from './plugins/vuetify'
import VueLoading from 'vuejs-loading-plugin'
import JsonExcel from 'vue-json-excel';

Vue.use(VueLoading)

Vue.component("downloadExcel", JsonExcel);

Vue.config.productionTip = false

sync(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
