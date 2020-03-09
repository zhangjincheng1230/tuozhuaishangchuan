import router from './router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {loginByToken, getCorps} from '@/api/models/system'
import {query} from '@/api/models/general-inventory/inventory-setting'
import store from './store'
import { getMonthEnd } from '@/utils'
import ZMessage from '@/utils/ZMessage'
const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, form, next) => {
  NProgress.start()
  if (to.path.startsWith('/loginByToken') && to.query.hasOwnProperty('token') && to.query.token !== null) {
    loginByToken({token: to.query.token}).then(result => {
      if (result.rows) {
        store.commit('setUserInfo', result.rows)
        getCorps().then(resw => {
          if (resw.rows && resw.rows.length > 0) {
            // Message({
            //   type: 'info',
            //   message: '您现在做账公司为' + resw.rows[0].uname + '，如需请切换。。。。。'
            // })
            store.commit('setCorpInfo', resw.rows[0])
            const loginDate = getMonthEnd(resw.rows[0].accountProgressDate)
            store.commit('setLoginDate', loginDate)
            next('/home')
          } else {
            next('/login')
          }
        })
      } else {
        next('/login')
      }
    })
  } else {
    const hasToken = store.state.system.userInfo.token
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
      } else {
        const hasRoles = store.getters.permissionRoutes && store.getters.permissionRoutes.length > 0
        if (hasRoles) {
          const path = to.path
          if (path &&
            (path.indexOf('general-inventory/inventory-doc') >= 0 || path.indexOf('general-inventory/inventory-init') >= 0 ||
              path.indexOf('general-inventory/inventory-cost') >= 0 ||
              path.indexOf('general-inventory/inventory-details') >= 0 || path.indexOf('general-inventory/gross-profit') >= 0)) {
            query().then(result => {
              if (result.success) {
                if (result.rows && result.rows.chcbjzfs &&
                  result.rows.chcbjzfs === 2) {
                  next(false)
                  ZMessage({message: '存货成本核算为不核算明细，暂不支持该节点查询。',
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                    iconClass: ''})
                } else {
                  next()
                }
              }
            }).catch(e => {
            })
          } else {
            next()
          }
        } else {
          store.dispatch('permission/loadRoutes').then(() => {
            next({...to, replace: true})
          })
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
      }
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
