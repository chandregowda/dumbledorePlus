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

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Import Bootstrap
import BootstrapVue from 'bootstrap-vue'
// import bModal from 'bootstrap-vue/es/components/modal/modal'
// import bModalDirective from 'bootstrap-vue/es/directives/modal/modal'

Vue.use(BootstrapVue)
// Vue.component('b-modal', bModal)
// Vue.directive('b-modal', bModalDirective)

Vue.use(Vuex)

// Vue.use(VueResource)
// Vue.http.options.root = 'https://vuejs-http.firebaseio.com/'

Vue.config.productionTip = false

console.log('Starting APP')
// console.log(store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  store: store,
  components: {
    App
  },
  template: '<App/>'
})
