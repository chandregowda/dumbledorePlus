import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const ExceptionModule = {
  state: {
    Exceptions: null
  },
  mutations: {
    updateExceptions: (state, Exceptions) => {
      state.Exceptions = Exceptions
    }
  },
  getters: {
    [actionTypes.EXCEPTIONS_GETTER]: state => state.Exceptions
  },
  actions: {
    [actionTypes.EXCEPTIONS_FETCH_ACTION]: ({
      commit
    }) => {
      console.log('Getting Exception details')
      let url = '/Exception/get?accountName=' + localStorage.getItem('accountName');
      axios.post(url).then(res => {
        console.log('Got Exception details')
        commit('updateExceptions', res.data)
      }).catch(e => console.log(e));
    }
  }
}
export default ExceptionModule;
