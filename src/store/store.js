import Vue from 'Vue'
import Vuex from 'vuex'
import axios from '../axios-auth'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userDetails: null,
    token: null
  },
  mutations: {
    authUser: function (state, {
      details,
      token
    }) {
      state.userDetails = details
      state.token = token
    }
  },
  actions: {
    storeUser: function ({
      commit
    }, payload) {
      axios.post('/user/create', {
        data: {
          accountName: payload.accountName,
          displayName: payload.displayName
        }
      }).then(r => console.log(r)).catch(e => console.log(e))
    },
    login: function ({
      commit,
      dispatch
    }, payload) {
      console.log('Sending login API request')
      axios
        .post('/login', payload)
        .then(r => {
          console.log(r)
          if (r.data && r.data.message === 'LOGIN_SUCCESSFUL') {
            console.log('Login Successful')

            let details = r.data.details
            let accountName = details.sAMAccountName || details.mail.replace(/@*$/, '').toLowerCase()
            let displayName = details.displayName

            // Store the data in Vue store
            commit('authUser', {
              details: r.data.details,
              token: r.data.token
            })

            // Create / Update logged in user in DB
            dispatch('storeUser', {
              accountName,
              displayName,
              token: r.data.token
            })

            // Store user details in localstorage
            localStorage.setItem('token', r.data.token)
            localStorage.setItem(
              'accountName',
              accountName
            )
            localStorage.setItem('displayName', displayName)
            axios.defaults.headers.common['x-access-token'] = r.data.token
          }
        })
        .catch(e => console.log(e))
    }
  },
  getters: {
    user: function (state) {
      return state.userDetails
    },
    isAuthenticated: function (state) {
      return state.token !== null
    }
  }
})
