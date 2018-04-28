import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const scannerModule = {
  state: {
    scanners: null
  },
  mutations: {
    updateScanner: (state, scanners) => {
      state.scanners = scanners
    }
  },
  getters: {
    [actionTypes.SCANNER_GETTER]: state => state.scanners
  },
  actions: {
    [actionTypes.SCANNER_FETCH_ACTION]: ({
      commit
    }) => {
      console.log('Getting Scanner details')
      axios.post('/scanner/get').then(res => {
        console.log('Got scanner details')
        commit('updateScanner', res.data)
      }).catch(e => console.log(e));
    }
  }
}
export default scannerModule;
