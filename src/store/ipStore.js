import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const ipModule = {
  state: {
    ipDetails: [],
    fetching: false
  },
  mutations: {
    updateIpDetails: (state, ipDetails) => {
      state.ipDetails = ipDetails
    },
    updateIpFetching: (state, isFetchingCompleted) => {
      state.fetching = isFetchingCompleted;
    }
  },
  getters: {
    [actionTypes.IP_GETTER]: state => state.ipDetails,
    [actionTypes.IP_FETCHING_GETTER]: state => state.fetching
  },
  actions: {
    [actionTypes.IP_FETCH_START_ACTION]: ({
      commit
    }) => {
      commit('updateIpFetching', true)
    },
    [actionTypes.IP_GET_ALL_ACTION]: ({
      commit
    }) => {
      console.log('Getting Ip details');
      commit('updateIpFetching', true);
      axios.post('/ip/get').then(res => {
        console.log('Got ip details');
        commit('updateIpDetails', res.data)
        commit('updateIpFetching', false);
      }).catch(e => console.log(e));
    }
  }
}

export default ipModule;
