// import { loginByUsername } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    iversionName: '',
    name: sessionStorage.getItem('realName'),
    system: {}
  },

  mutations: {
    SET_NAME: (state, name) => {
      sessionStorage.setItem('realName', name)
      state.name = name
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_SYSTEM: (state, system) => {
      state.system = system
    },
    SET_IVERSIONNAME: (state, iversionName) => {
      state.iversionName = iversionName
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      commit('SET_NAME', username)
    },
    setSystem  ({ commit }, system) {
      commit('SET_SYSTEM', system)
    }
  }
}

export default user
