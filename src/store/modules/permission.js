import router, { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import {queryFunNode} from '@/api/models/system'
import cloneDeep from 'lodash/cloneDeep'
import { Loading } from 'element-ui'

const state = {
  routes: [],
  menuRoutes: [],
  menuList: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // state.menuRoutes = asyncRoutes.filter(route => route.meta && route.meta.menu === true)
    let allRoutes = constantRoutes.concat(asyncRoutes)
    state.routes = allRoutes
    router.addRoutes(allRoutes)
  },
  SET_MENUS: (state, menuRoutes) => {
    state.menuRoutes = menuRoutes
  },
  SET_MENUList: (state, menuRoutes) => {
    state.menuList = menuRoutes
  },
  CLEAR_ROUTES: (state) => {
    state.routes = []
    state.menuRoutes = []
    resetRouter()
  }
}

const actions = {
  loadRoutes ({commit, state}, routes) {
    commit('SET_ROUTES', asyncRoutes)
  },
  loadMenus ({commit}) {
    let loadingInstance = Loading.service({ fullscreen: true })
    queryFunNode().then(result => {
      commit('SET_MENUList', result.rows)
      commit('SET_MENUS', getMenuRoutes(result.rows))
    }).finally(() => {
      loadingInstance.close()
    })
  },
  clearRoutes ({commit}) {
    commit('CLEAR_ROUTES')
  }
}

function getMenuRoutes (perimissions) {
  let routes = cloneDeep(asyncRoutes)
  return filterRoute(routes, perimissions)
}

function filterRoute (routes, routeNames) {
  let filteredRoutes = routes.filter(route => {
    if (route.path === '*') {
      return false
    }
    if (route.name === 'common-settings') {
      return true
    }
    if (route.children) {
      let children = filterRoute(route.children, routeNames)
      if (children.length === 0) {
        return false
      }
      route.children = children
    } else if (routeNames.indexOf(route.name) === -1) {
      return false
    }
    return true
  })
  return filteredRoutes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
