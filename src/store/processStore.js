import axios from '../axios-auth';
import * as actionTypes from './actionTypes';

const summarizeProcessDetails = (processDetails) => {
  let summary = {
    production: {
      totalIp: 0,
      totalProcess: 0,
      datacenters: {
        au: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        canada: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        idc: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        malaysia: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        uk: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        sc9: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        }
      }
    },
    stage: {
      totalIp: 0,
      totalProcess: 0,
      datacenters: {
        malaysia: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        uk: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        },
        sc9: {
          totalIp: 0,
          totalComponent: 0,
          ipList: [],
          components: {}
        }
      }
    }
  };

  processDetails.forEach((process) => {
    let {
      ip,
      environment,
      datacenter,
      component
    } = process;
    summary[environment]['totalProcess']++;
    if (!summary[environment]['datacenters'][datacenter]['components'][component]) {
      summary[environment]['datacenters'][datacenter]['components'][component] = 0;
    }
    summary[environment]['datacenters'][datacenter]['components'][component]++;
    summary[environment]['datacenters'][datacenter]['totalComponent']++;
    if (summary[environment]['datacenters'][datacenter]['ipList'].indexOf(ip) === -1) {
      summary[environment]['datacenters'][datacenter]['ipList'].push(ip);
      summary[environment]['datacenters'][datacenter]['totalIp']++;
      summary[environment]['totalIp']++;
    };
  });

  return summary;
}

const processModule = {
  state: {
    processDetails: [],
    summarizedProcessDetails: {},
    fetching: false
  },
  mutations: {
    updateProcessDetails: (state, processDetails) => {
      state.processDetails = processDetails;
    },
    updateFetching: (state, isFetchingCompleted) => {
      state.fetching = isFetchingCompleted;
    },
    updateSummarizedProcessDetails: (state, summarizedProcessDetails) => {
      state.summarizedProcessDetails = summarizedProcessDetails;
    }
  },
  getters: {
    [actionTypes.PROCESS_GETTER]: state => state.processDetails,
    [actionTypes.PROCESS_SUMMARY_GETTER]: state => state.summarizedProcessDetails,
    [actionTypes.PROCESS_FETCHING_GETTER]: state => state.fetching
  },
  actions: {
    summarizeProcessDetails: ({
      commit,
      dispatch
    }, processDetails) => {
      console.log('Summarizing Process Details');
      const summarizedProcessDetails = summarizeProcessDetails(processDetails);
      commit('updateSummarizedProcessDetails', summarizedProcessDetails)
    },
    [actionTypes.PROCESS_FETCH_START_ACTION]: ({
      commit
    }) => {
      commit('updateFetching', true)
    },
    [actionTypes.PROCESS_GET_ALL_ACTION]: ({
      commit,
      dispatch
    }) => {
      console.log('Getting Process details');
      commit('updateFetching', true);
      axios.post('/process/get').then(res => {
        // axiosDumbledore.post('capi/getProcessDetails').then(res => {
        console.log('Got process details from Dumbledore')
        commit('updateFetching', false);
        commit('updateProcessDetails', res.data);
        setTimeout(() => {
          dispatch('summarizeProcessDetails', res.data)
        }, 0)
      }).catch(e => console.log(e));
    }
  }
}
export default processModule;
