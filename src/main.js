// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './router'
// import store from './store/store'

import {
  store
} from './store/storeContainer'
// import VueResource from 'vue-resource'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'

// import fontawesome from '@fortawesome/fontawesome';
// import '@fortawesome/fontawesome-free-brands';
import '@fortawesome/fontawesome-free-solid';

Vue.use(BootstrapVue)

Vue.use(Vuex)
// Vue.use(require('vue-moment'));

Vue.config.productionTip = false

console.log('Dumbledore Plus APP initiated')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: {
    App
  },
  template: '<App/>'
})
