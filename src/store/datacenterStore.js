import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const datacenterModule = {
  state: {
    datacenters: null
  },
  mutations: {
    updateDatacenters: (state, datacenters) => {
      state.datacenters = datacenters
    }
  },
  getters: {
    [actionTypes.DATACENTERS_GETTER]: state => state.datacenters
  },
  actions: {
    [actionTypes.DATACENTERS_FETCH_ACTION]: ({
      commit
    }) => {
      console.log('Getting Datacenter details')
      axios.post('/datacenter/get').then(res => {
        console.log('Got datacenter details')
        commit('updateDatacenters', res.data)
      }).catch(e => console.log(e));
    }
  }
}
export default datacenterModule;
