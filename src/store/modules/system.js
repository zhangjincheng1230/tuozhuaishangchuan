// 登录信息，存在session中
import {formatDate} from '@/utils'
import {getCorpServiceInfo, logout, getDefaultLoginDate} from '@/api/models/system'

function geDefaultState () {
  return {
    // 登录日期
    loginDate: formatDate(new Date()),
    // 公司信息
    corpInfo: {},
    // 用户信息
    userInfo: {},
    // 有权限的公司
    ownedCorps: [],
    // 当前公司变量
    info: {},
    menus: [],
    corpServiceInfo: {}
  }
}

export default {
  state: geDefaultState(),
  mutations: {
    setMenu (state, menus) {
      state.menus = menus
    },
    setCorpInfo (state, info) {
      state.corpInfo = info
    },
    setUserInfo (state, info) {
      state.userInfo = info
    },
    setLoginDate (state, date) {
      state.loginDate = date
    },
    setOwnedCorps (state, corps) {
      state.ownedCorps = corps
    },
    SET_SYSTEM_INFO: (state, system) => {
      state.info = system
    },
    SET_CORP_SERVICE_INFO: (state, info) => {
      state.corpServiceInfo = info
    },
    CLEAR_LOGIN_INFO: (state) => {
      Object.assign(state, geDefaultState())
    }
  },
  actions: {
    fetchCorpServiceInfo ({commit, state}) {
      return new Promise((resolve) => {
        getCorpServiceInfo({
          corpId: state.corpInfo.pk_gs
        }).then(res => {
          if (res.success) {
            commit('SET_CORP_SERVICE_INFO', res.data)
            resolve()
          }
        })
      })
    },
    changeLoginDate ({commit, state}, date) {
      return new Promise((resolve) => {
        commit('setLoginDate', date)
        resolve()
      })
    },
    changeLoginCorp ({commit, state}, corp) {
      return new Promise((resolve, reject) => {
        getDefaultLoginDate({
          corpId: corp.pk_gs
        }).then(res => {
          if (res.success) {
            commit('setCorpInfo', corp)
            commit('setLoginDate', res.data)
            resolve()
          } else {
            reject(new Error(res.msg))
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    logout ({commit, state, dispatch}) {
      return new Promise((resolve, reject) => {
        logout().catch(error => {
          console.log(error)
        })
        commit('CLEAR_LOGIN_INFO')
        commit('CLEAR_LOGIN_INFO')
        dispatch('tagsView/delAllViews')
        dispatch('permission/clearRoutes')
        resolve()
      })
    }
  }
}
