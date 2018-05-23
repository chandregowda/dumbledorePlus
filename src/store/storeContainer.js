import Vue from 'vue'
import Vuex from 'vuex'

import datacenterStore from './datacenterStore';
import processStore from './processStore';
import authStore from './authStore';
import exceptionStore from './exceptionStore';
import TimeStore from './timeStore';
import CobrandStore from './cobrandStore';
import IpStore from './ipStore';
import IpStatusStore from './ipStatusStore';
// import scannerStore from './scannerStore';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    authStore,
    datacenterStore,
    processStore,
    exceptionStore,
    TimeStore,
    CobrandStore,
    IpStore,
    IpStatusStore
  }
})
