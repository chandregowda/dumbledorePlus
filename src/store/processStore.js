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
      summary[environment]['datacenters'][datacenter]['components'][component] = {
        count: 0,
        details: []
      };
    }
    summary[environment]['datacenters'][datacenter]['components'][component].count++;
    summary[environment]['datacenters'][datacenter]['components'][component].details.push(process);
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
    updateProcessFetching: (state, isFetchingCompleted) => {
      state.fetching = isFetchingCompleted;
    },
    updateSummarizedProcessDetails: (state, summarizedProcessDetails) => {
      state.summarizedProcessDetails = summarizedProcessDetails;
    }
  },
  getters: {
    [actionTypes.PROCESS_GETTER]: state => state.processDetails,
    [actionTypes.PROCESS_SUMMARY_GETTER]: state => state.summarizedProcessDetails,
    [actionTypes.PROCESS_FETCHING_GETTER]: state => state.fetching,
    GET_PROCESS_DETAILS: state => {
      return options => {
        let {
          environment,
          datacenter,
          ip,
          instance,
          component
        } = options;
        // console.log('Inside GET_PROCESS_DETAILS', environment, datacenter, ip, instance, component);
        let env = state.summarizedProcessDetails[environment];
        let dcs = env.datacenters[datacenter.toLowerCase()];
        let comp = dcs.components[component];
        let details = comp.details;
        let allProcessList = details.filter(process => {
          return process.ip === ip && process.instance === instance
        })
        // console.log('Filtered Process Detail', allProcessList);
        if (allProcessList) {
          return allProcessList[0];
        }
        return null;
      }
    }
  },
  actions: {
    summarizeProcessDetails: ({
      commit,
      dispatch
    }, processDetails) => {
      const summarizedProcessDetails = summarizeProcessDetails(processDetails);
      commit('updateSummarizedProcessDetails', summarizedProcessDetails)
    },
    [actionTypes.PROCESS_FETCH_START_ACTION]: ({
      commit
    }) => {
      commit('updateProcessFetching', true)
    },
    [actionTypes.PROCESS_GET_ALL_ACTION]: ({
      commit,
      dispatch
    }) => {
      console.log(`${(new Date()).toLocaleString()} : Getting Process details`);
      commit('updateProcessFetching', true);
      axios.post('/process/get').then(res => {
        // axiosDumbledore.post('capi/getProcessDetails').then(res => {
        console.log(`${(new Date()).toLocaleString()} : Fetched Process details from Dumbledore`);
        commit('updateProcessFetching', false);
        commit('updateProcessDetails', res.data);
        setTimeout(() => {
          dispatch('summarizeProcessDetails', res.data)
        }, 0)
      }).catch(e => console.log(e));
    }
  }
}
export default processModule;
