import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const diskModule = {
  state: {
    diskDetails: []
  },
  mutations: {
    updateDiskDetails: (state, diskDetails) => {
      state.diskDetails = diskDetails
    }
  },
  getters: {
    [actionTypes.DISK_GETTER]: state => state.diskDetails
  },
  actions: {
    [actionTypes.DISK_GET_ALL_ACTION]: ({
      commit
    }) => {
      console.log('Getting Disk details')
      axios.post('/disk/get').then(res => {
        console.log('Got disk details', res)
        commit('updateDiskDetails', res.data)
      }).catch(e => console.log(e));
    }
  }
}

export default diskModule;
