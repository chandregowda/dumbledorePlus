import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const ExceptionModule = {
  state: {
    exceptions: null
  },
  mutations: {
    updateExceptions: (state, exceptions) => {
      state.exceptions = exceptions
    }
  },
  getters: {
    [actionTypes.EXCEPTIONS_GETTER]: state => state.exceptions
  },
  actions: {
    [actionTypes.EXCEPTIONS_FETCH_ACTION]: ({
      commit
    }) => {
      console.log('Getting Exception details')
      // let url = '/Exception/get?accountName=' + localStorage.getItem('accountName');
      let url = '/Exception/get';
      axios.post(url).then(res => {
        console.log('Got Exception details')
        commit('updateExceptions', res.data)
      }).catch(e => console.log(e));
    }
  }
}
export default ExceptionModule;
