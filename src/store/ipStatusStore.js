import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const ipStatusModule = {
  state: {
    ipStatusDetails: [],
    failedIpList: {},
    fetching: false
  },
  mutations: {
    updateIpStatusDetails: (state, ipStatusDetails) => {
      state.ipDetails = ipStatusDetails;
    },
    updateFetching: (state, isFetchingCompleted) => {
      state.fetching = isFetchingCompleted;
    },
    updateFiledIpList: (state, ipDetails) => {
      let failedIps = {};
      ipDetails.map(ipDetail => {
        // console.log('Updating :' + ipDetail.ip + ' : ' + ipDetail.status);
        failedIps[ipDetail.ip] = ipDetail.status;
        return undefined;
      });
      state.failedIpList = failedIps;
    }
  },
  getters: {
    [actionTypes.IPSTATUS_GETTER]: (state) => state.ipDetails,
    [actionTypes.IPSTATUS_FETCHING_GETTER]: (state) => state.fetching,
    [actionTypes.IPSTATUS_ONLY_IP_GETTER]: (state) => state.failedIpList
  },
  actions: {
    [actionTypes.IPSTATUS_FETCH_START_ACTION]: ({
      commit
    }) => {
      commit('updateFetching', true);
    },
    [actionTypes.IPSTATUS_GET_ALL_ACTION]: ({
      commit
    }) => {
      console.log('Getting IpStatus details');
      commit('updateFetching', true);
      axios
        .post('/ipStatus/get')
        .then((res) => {
          console.log('Got ipStatus details');
          commit('updateIpStatusDetails', res.data);
          commit('updateFetching', false);
          commit('updateFiledIpList', res.data);
        })
        .catch((e) => console.log(e));
    },
    [actionTypes.IPSTATUS_RETRY_FAILED_ID]: ({
      commit,
      dispatch
    }) => {
      console.log('Retrying Failed IP List');
      axios
        .post('/ipStatus/retry')
        .then((res) => {
          console.log('Retry completed ipStatus details');
          dispatch(actionTypes.IPSTATUS_GET_ALL_ACTION);
        })
        .catch((e) => console.log(e));
    }
  }
};

export default ipStatusModule;
