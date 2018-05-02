import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const cobrandModule = {
  state: {
    cobrands: null,
    loadingStatus: false,
    error: false
  },
  mutations: {
    updateCobrands: (state, cobrands) => {
      state.cobrands = cobrands
    },
    updateLoadingStatus: (state, status = false) => {
      state.loadingStatus = status;
    },
    updateError: (state, message = null) => {
      state.loadingStatus = message;
    }
  },
  getters: {
    [actionTypes.COBRANDS_GETTER]: state => state.cobrands,
    [actionTypes.COBRANDS_LOADING_STATUS_GETTER]: state => state.loadingStatus,
    [actionTypes.COBRANDS_ERROR_GETTER]: state => state.cobrands
  },
  actions: {
    [actionTypes.COBRANDS_FETCH_ACTION]: ({
      commit
    }) => {
      commit('updateLoadingStatus', true);
      commit('updateError');

      console.log('Getting Cobrand details')
      axios.post('/cobrand/get').then(res => {
        console.log('Got cobrand details');
        commit('updateCobrands', res.data);
        commit('updateLoadingStatus');
        commit('updateError');
      }).catch(e => {
        console.log(e)
        commit('updateLoadingStatus');
        commit('updateError', e);
      });
    }
  }
}

export default cobrandModule;
