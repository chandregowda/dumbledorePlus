import Vue from 'vue'
import Vuex from 'vuex'

import datacenterStore from './datacenterStore';
import diskStore from './diskStore';
import processStore from './processStore';
import authStore from './authStore';
import exceptionStore from './exceptionStore';
import TimeStore from './timeStore';
import CobrandStore from './cobrandStore';
// import scannerStore from './scannerStore';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    authStore,
    datacenterStore,
    diskStore,
    processStore,
    exceptionStore,
    TimeStore,
    CobrandStore
  }
})
