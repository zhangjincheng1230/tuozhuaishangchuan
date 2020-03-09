import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import platform from './modules/platform'
import tagsView from './modules/tagsView'
import accounting from './modules/accounting'
import system from './modules/system'
import permission from './modules/permission'
import paramset from './modules/paramset'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const persistedState = createPersistedState({
  storage: window.sessionStorage,
  key: 'dzf-zxkj',
  paths: ['system']
})

const store = new Vuex.Store({
  modules: {
    user,
    platform,
    tagsView,
    accounting,
    system,
    permission,
    paramset
  },
  getters,
  plugins: [persistedState]
})

export default store
