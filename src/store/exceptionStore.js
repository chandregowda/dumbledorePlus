import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const ExceptionModule = {
  state: {
    exceptions: null,
    fetching: false
  },
  mutations: {
    updateExceptions: (state, exceptions) => {
      state.exceptions = exceptions
    },
    updateFetching: (state, isFetchingCompleted = false) => {
      state.fetching = isFetchingCompleted;
    }
  },
  getters: {
    [actionTypes.EXCEPTIONS_GETTER]: state => state.exceptions,
    [actionTypes.EXCEPTIONS_FETCHING_GETTER]: state => state.fetching
  },
  actions: {
    [actionTypes.EXCEPTIONS_FETCH_START_ACTION]: ({
      commit
    }) => {
      commit('updateFetching', true)
    },
    [actionTypes.EXCEPTIONS_FETCH_ACTION]: ({
      commit
    }) => {
      console.log('Getting Exception details')
      commit('updateFetching', true);
      // let url = '/Exception/get?accountName=' + localStorage.getItem('accountName');
      let url = '/Exception/get';
      axios.post(url).then(res => {
        console.log('Got Exception details')
        commit('updateFetching', false);
        commit('updateExceptions', res.data);
      }).catch(e => console.log(e));
    }
  }
}
export default ExceptionModule;
