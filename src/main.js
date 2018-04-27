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

import fontawesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faChessKing from '@fortawesome/fontawesome-free-solid/faChessKing';
import faDove from '@fortawesome/fontawesome-free-solid/faDove';
import faCubes from '@fortawesome/fontawesome-free-solid/faCubes';
import faDotCircle from '@fortawesome/fontawesome-free-solid/faDotCircle';
import faServer from '@fortawesome/fontawesome-free-solid/faServer';
import faSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt';
import faSpaceShuttle from '@fortawesome/fontawesome-free-solid/faSpaceShuttle';
// import faPhoenixFramework from '@fortawesome/fontawesome-free-solid/faPhoenixFramework';

fontawesome.library.add(brands, faSpinner, faSignOutAlt, faHome, faUser, faChessKing, faDove, faCubes, faDotCircle, faServer, faSyncAlt, faSpaceShuttle)

Vue.use(BootstrapVue)
// Vue.component('b-modal', bModal)
// Vue.directive('b-modal', bModalDirective)

Vue.use(Vuex)
Vue.use(require('vue-moment'));
// Vue.use(VueResource)
// Vue.http.options.root = 'https://vuejs-http.firebaseio.com/'

Vue.config.productionTip = false

console.log('Starting APP')

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
