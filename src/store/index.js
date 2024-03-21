import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  state: {
    locale: 'en'
  },
  mutations: {
    setLocale(state, locale) {
      state.locale = locale
    }
  },
  actions: {
    changeLocale({ commit }, locale) {
      commit('setLocale', locale)
    }
  }

})

export default store
