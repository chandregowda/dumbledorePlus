import axios from '../axios-auth';
import * as actionTypes from './actionTypes';
import router from '../router/index';

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
    [actionTypes.AUTH_TOKEN_GETTER]: state => state.token,
    [actionTypes.AUTH_USER_DETAILS_GETTER]: state => state.userDetails
  },
  actions: {
    [actionTypes.AUTH_SET_LOGOUT_TIMER]: ({
      commit,
      dispatch
    }, timeOutHours) => {
      // let totalSeconds = (timeOutHours || 24) * 60 * 60 // in Seconds
      let totalSeconds = 24 * 60 * 60 // in Seconds
      console.log('Logouts in ', totalSeconds);
      setTimeout(() => {
        dispatch(actionTypes.AUTH_LOGOUT_ACTION)
      }, totalSeconds)
    },
    [actionTypes.AUTH_LOGOUT_ACTION]: ({
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
    [actionTypes.AUTH_AUTO_LOGIN_ACTION]: ({
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
    [actionTypes.AUTH_LOGIN_ACTION]: ({
      commit,
      dispatch
    }, payload) => {
      if (payload) {
        axios.post('/login', payload).then(res => {
          commit('updateAuthDetails', {
            token: res.data.token,
            userDetails: res.data.details
          })

          dispatch(actionTypes.AUTH_CREATE_USER_ACTION, res.data.details) // Store/update user details
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
    [actionTypes.AUTH_CREATE_USER_ACTION]: ({
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

export default authModule;
