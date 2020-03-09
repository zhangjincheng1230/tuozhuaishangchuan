// import { refreshPage } from '@/libs/tools'

function preProcessView (view) {
  if (view.meta.nestedView) {
    let parentView = view.matched[view.matched.length - 2]
    view = Object.assign({}, view)
    view.meta.title = parentView.meta.title
    view.name = parentView.name
  }
  return view
}

const platform = {
  namespaced: true,
  state: {
    visitedViews: [],
    cachedViews: [],
    topRouteName: 'cwcl'
  },
  mutations: {
    CHANGE_TOP_ROUTE: (state, name) => {
      state.topRouteName = name
    },
    ADD_VISITED_VIEW: (state, view) => {
      let visitedView = state.visitedViews.find(v => v.name === view.name)
      if (visitedView) {
        visitedView.path = view.path
        visitedView.fullPath = view.fullPath
        return
      }
      let title = view.meta.title || 'no-name'
      if (view.params && view.params.tagTitle) {
        title = view.params.tagTitle
      }
      state.visitedViews.push(
        Object.assign({}, view, {
          title: title
        })
      )
    },
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },

    DEL_VISITED_VIEW: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.name === view.name) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_VISITED_VIEWS: (state, views) => {
      let nameSet = new Set()
      views.forEach(v => nameSet.add(v.name))
      state.visitedViews = state.visitedViews.filter(v => !nameSet.has(v.name))
    },
    DEL_CACHED_VIEW: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      index > -1 && state.cachedViews.splice(index, 1)
    },
    DEL_CACHED_VIEWS: (state, views) => {
      let nameSet = new Set()
      views.forEach(v => nameSet.add(v.name))
      state.cachedViews = state.cachedViews.filter(name => !nameSet.has(name))
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(v => {
        return v.meta.affix || v.name === view.name
      })
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        state.cachedViews = []
      }
    },

    DEL_ALL_VISITED_VIEWS: state => {
      // keep affix tags
      const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.visitedViews = affixTags
    },

    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.name === view.name) {
          v = Object.assign(v, view)
          break
        }
      }
    }
  },
  actions: {
    addView ({dispatch}, view) {
      view = preProcessView(view)
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    addVisitedView ({commit}, view) {
      commit('ADD_VISITED_VIEW', view)
      if (view && view.matched) {
        let topRoute = view.matched[0]
        if (topRoute.meta.topMenu === true) {
          commit('CHANGE_TOP_ROUTE', topRoute.name)
        }
      }
    },
    addCachedView ({commit}, view) {
      commit('ADD_CACHED_VIEW', view)
    },

    delView ({dispatch, state}, view) {
      view = preProcessView(view)
      return new Promise(resolve => {
        if (view.matched) {
          let route = view.matched[view.matched.length - 1]
          let vm = route.instances.default
          if (vm && typeof vm['beforeCloseTag'] === 'function') {
            let beforeClose = vm['beforeCloseTag'].apply(vm)
            if (beforeClose === false) {
              return
            } else if (beforeClose instanceof Promise) {
              beforeClose.then(() => {
                dispatch('delVisitedView', view)
                dispatch('delCachedView', view)
                resolve({
                  visitedViews: [...state.visitedViews],
                  cachedViews: [...state.cachedViews]
                })
              })
              return
            }
          }
        }
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delVisitedView ({commit, state}, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView ({commit, state}, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },

    delOthersViews ({commit, dispatch, state}, view) {
      view = preProcessView(view)
      // 要关闭的view
      let views = state.visitedViews.filter(v => !v.meta.affix && v.name !== view.name)
      return dispatch('delViews', views)
    },

    delAllViews ({dispatch, state}) {
      let views = state.visitedViews.filter(v => !v.meta.affix)
      return dispatch('delViews', views)
    },
    delViews ({commit, state}, views) {
      return new Promise(resolve => {
        let confirmViewIndex = views.findIndex(v => {
          if (v.matched) {
            let vm = v.matched[v.matched.length - 1].instances.default
            if (vm && typeof vm['beforeCloseTag'] === 'function') {
              return true
            }
          }
        })
        if (confirmViewIndex > -1) {
          let confirmView = views[confirmViewIndex]
          let vm = confirmView.matched[confirmView.matched.length - 1].instances.default
          let beforeClose = vm['beforeCloseTag'].apply(vm)
          if (beforeClose === false) {
            views.splice(confirmViewIndex, 1)
          } else if (beforeClose instanceof Promise) {
            beforeClose.then(() => {
              commit('DEL_VISITED_VIEWS', views)
              commit('DEL_CACHED_VIEWS', views)
              resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
              })
            }).catch(() => {
              views.splice(confirmViewIndex, 1)
              commit('DEL_VISITED_VIEWS', views)
              commit('DEL_CACHED_VIEWS', views)
              resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
              })
            })
            return
          }
        }
        commit('DEL_VISITED_VIEWS', views)
        commit('DEL_CACHED_VIEWS', views)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    updateVisitedView ({commit}, view) {
      commit('UPDATE_VISITED_VIEW', view)
    },
    updateTagTitle ({commit, state}, tag) {
      let visitedViews = state.visitedViews.find(v => v.name === tag.name)
      if (visitedViews) {
        visitedViews.title = tag.title
      }
    }
  }
}
export default platform
