import Vue from 'vue'
import Vuex from 'vuex'

import datacenterModule from './datacenterStore';
import diskModule from './diskStore';
import processModule from './processStore';
import authModule from './authStore';

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    // counterStore: counterModule,
    authStore: authModule,
    datacenterStore: datacenterModule,
    diskStore: diskModule,
    processStore: processModule
  }
})
