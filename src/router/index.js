/* eslint indent: 0 */

import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Auth/Login'
// import Dashboard from '@/components/Dashboard/Dashboard'
import Process from '@/components/Process'
import ProcessSummary from '@/components/ProcessSummary'
import Disk from '@/components/Disk'
import Datacenter from '@/components/Datacenter'
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
    path: '/process',
    name: 'Process',
    component: Process,
    beforeEnter: (to, from, next) => {
      if (store.getters.AUTH_TOKEN_GETTER) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/process-summary',
    name: 'ProcessSummary',
    component: ProcessSummary,
    beforeEnter: (to, from, next) => {
      if (store.getters.AUTH_TOKEN_GETTER) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/disk',
    name: 'Disk',
    component: Disk,
    beforeEnter: (to, from, next) => {
      if (store.getters.AUTH_TOKEN_GETTER) {
        next()
      } else {
        next('/')
      }
    }
  },
  {
    path: '/datacenter',
    name: 'Datacenter',
    component: Datacenter,
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
