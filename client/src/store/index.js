import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    isPrint: false,
    printDataArr:[],
    printCustomerInfo:{},
  },
  getters: {
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
    },
    setPrintData (state, arr) {
      state.printDataArr = arr
    },
    setPrinCustomer (state, customer) {
      state.printCustomerInfo = customer
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    setPrintData ({commit}, arr) {
      commit('setPrintData', arr)
    },
    setPrintCustomer ({commit}, customer) {
      commit('setPrinCustomer', customer)
    },
  },
  modules: {
  }
})
