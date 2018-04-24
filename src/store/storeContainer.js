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

/* const counterModule = {
  state: {
    counter: 5
  },
  mutations: {
    increment: state => state.counter++,
    decrement: state => state.counter--
  },
  getters: {
    getIncrement: state => state.counter * 2
  },
  actions: {
    incrementAfterSometime: ({
      commit
    }) => {
      setInterval(() => {
        commit('increment')
      }, 1000)
    }
  }
}
 */
const newCounterModule = {
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
      let totalSeconds = (timeOutHours || 24) * 60 * 60 // in Seconds
      setTimeout(() => {
        dispatch(AUTH_LOGOUT_ACTION)
      }, totalSeconds)
    },
    [AUTH_LOGOUT_ACTION]: ({
      commit
    }, payload) => {
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
            router.replace('/home') // Now navigate to default login page
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
          dispatch(AUTH_SET_LOGOUT_TIMER, res.data.expiryTime) // Store/update user details

          // Store user details in localstorage
          localStorage.setItem('token', res.data.token)
          let expiresIn = new Date((new Date()).getTime() + (res.data.expiryTime || 24) * 60 * 60 * 1000)
          localStorage.setItem('expirationDate', expiresIn)
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
    authStore: newCounterModule
  }
})
