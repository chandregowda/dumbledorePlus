/* eslint indent: 0 */

import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Auth/Login'
import Dashboard from '@/components/Dashboard/Dashboard'
import Home from '@/components/Home'
import {
  store
} from '../store/storeContainer'
Vue.use(Router)

const routes = [{
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.getters.AUTH_TOKEN_GETTER) {
        next()
      } else {
        next(Login)
      }
    }
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.getters.AUTH_TOKEN_GETTER) {
        next()
      } else {
        next('/ ')
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (store.getters.AUTH_TOKEN_GETTER) {
        next()
      } else {
        next('/')
      }
    }
  }
]

export default new Router({
  mode: 'history',
  routes
})
