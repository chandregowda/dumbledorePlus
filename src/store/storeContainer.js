import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'
import router from '../router/index'

Vue.use(Vuex)
const AUTH_TOKEN_GETTER = 'AUTH_TOKEN_GETTER'
const AUTH_USER_DETAILS_GETTER = 'AUTH_USER_DETAILS_GETTER'
const AUTH_CREATE_USER_ACTION = 'AUTH_CREATE_USER_ACTION'
const AUTH_LOGOUT_ACTION = 'AUTH_LOGOUT_ACTION'
const AUTH_SET_LOGOUT_TIMER = 'AUTH_SET_LOGOUT_TIMER'
const AUTH_LOGIN_ACTION = 'AUTH_LOGIN_ACTION'
const AUTH_AUTO_LOGIN_ACTION = 'AUTH_AUTO_LOGIN_ACTION'

const DATACENTERS_GETTER = 'DATACENTERS_GETTER'
const DATACENTERS_FETCH_ACTION = 'DATACENTERS_FETCH_ACTION'

const PROCESS_GETTER = 'PROCESS_GETTER'
const PROCESS_FETCHING_GETTER = 'PROCESS_FETCHING_GETTER'
const PROCESS_GET_ALL_ACTION = 'PROCESS_GET_ALL_ACTION'
const PROCESS_FETCH_START_ACTION = 'PROCESS_FETCH_START_ACTION'

const DISK_GETTER = 'DISK_GETTER'
const DISK_GET_ALL_ACTION = 'DISK_GET_ALL_ACTION'

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
    [DATACENTERS_GETTER]: state => state.datacenters
  },
  actions: {
    [DATACENTERS_FETCH_ACTION]: ({
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
    [DISK_GETTER]: state => state.diskDetails
  },
  actions: {
    [DISK_GET_ALL_ACTION]: ({
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

const processModule = {
  state: {
    processDetails: [],
    fetching: false
  },
  mutations: {
    updateProcessDetails: (state, processDetails) => {
      state.processDetails = processDetails;
    },
    updateFetching: (state, isFetchingCompleted) => {
      state.fetching = isFetchingCompleted;
    }
  },
  getters: {
    [PROCESS_GETTER]: state => state.processDetails,
    [PROCESS_FETCHING_GETTER]: state => state.fetching
  },
  actions: {
    [PROCESS_FETCH_START_ACTION]: ({
      commit
    }) => {
      commit('updateFetching', true);
    },
    [PROCESS_GET_ALL_ACTION]: ({
      commit
    }) => {
      console.log('Getting Process details');
      commit('updateFetching', true);
      axios.post('/process/get').then(res => {
        // axiosDumbledore.post('capi/getProcessDetails').then(res => {
        console.log('Got process details from Dumbledore')
        commit('updateFetching', false);
        commit('updateProcessDetails', res.data);
      }).catch(e => console.log(e));
    }
  }
}
const authModule = {
  state: {
    userDetails: null,
    token: null
  },
  mutations: {
    updateUserDetails: (state, userDetails) => {
      state.userDetails = userDetails
    },
    updateTokenId: (state, token) => {
      state.token = token
    },
    updateAuthDetails: (state, payload) => {
      state.token = payload.token
      state.userDetails = payload.userDetails
    }
  },
  getters: {
    [AUTH_TOKEN_GETTER]: state => state.token,
    [AUTH_USER_DETAILS_GETTER]: state => state.userDetails
  },
  actions: {
    [AUTH_SET_LOGOUT_TIMER]: ({
      commit,
      dispatch
    }, timeOutHours) => {
      // let totalSeconds = (timeOutHours || 24) * 60 * 60 // in Seconds
      let totalSeconds = 24 * 60 * 60 // in Seconds
      console.log('Logouts in ', totalSeconds);
      setTimeout(() => {
        dispatch(AUTH_LOGOUT_ACTION)
      }, totalSeconds)
    },
    [AUTH_LOGOUT_ACTION]: ({
      commit
    }, payload) => {
      console.log('Logging out')
      commit('updateAuthDetails', {
        token: null,
        userDetails: null
      })
      localStorage.clear()
      // localStorage.removeItem('token')
      // localStorage.removeItem('displayName')
      // localStorage.removeItem('accountName')
      // localStorage.removeItem('expirationDate')
      router.replace('/') // Now navigate to default login page
    },
    [AUTH_AUTO_LOGIN_ACTION]: ({
      commit
    }) => {
      let token = localStorage.getItem('token')
      if (token) {
        let expirationDate = localStorage.getItem('expirationDate')
        if (localStorage.getItem('expirationDate')) {
          let now = new Date()
          if (now.getTime() <= new Date(expirationDate).getTime()) {
            let accountName = localStorage.getItem('accountName')
            let displayName = localStorage.getItem('displayName')
            commit('updateAuthDetails', {
              token,
              userDetails: {
                accountName,
                displayName
              }
            })
            router.replace('/process') // Now navigate to default login page
          }
        }
      }
    },
    [AUTH_LOGIN_ACTION]: ({
      commit,
      dispatch
    }, payload) => {
      if (payload) {
        axios.post('/login', payload).then(res => {
          commit('updateAuthDetails', {
            token: res.data.token,
            userDetails: res.data.details
          })

          dispatch(AUTH_CREATE_USER_ACTION, res.data.details) // Store/update user details
          // dispatch(AUTH_SET_LOGOUT_TIMER, res.data.expiryTime) // Store/update user details

          // Store user details in localstorage
          localStorage.setItem('token', res.data.token)
          let expiresIn = new Date((new Date()).getTime() + (res.data.expiryTime || 24) * 60 * 60 * 1000)
          localStorage.setItem('expirationDate', expiresIn)

          // set 'x-access-token' for further API calls
          axios.defaults.headers.common['x-access-token'] = res.data.token

          router.replace('/home') // Navigate to home page on successful login
        }).catch(e => console.log(e))
      }
    },
    [AUTH_CREATE_USER_ACTION]: ({
      commit
    }, details) => {
      let accountName = details.sAMAccountName || details.mail.replace(/@*$/, '').toLowerCase()
      let displayName = details.displayName
      localStorage.setItem('accountName', accountName)
      localStorage.setItem('displayName', displayName)
      axios.post('/user/create', {
        data: {
          accountName: accountName,
          displayName: displayName
        }
      }).then(
        // r => console.log(r)
      ).catch(e => console.log(e))
    }
  }
}

export const store = new Vuex.Store({
  modules: {
    // counterStore: counterModule,
    authStore: authModule,
    datacenterStore: datacenterModule,
    diskStore: diskModule,
    processStore: processModule
  }
})
