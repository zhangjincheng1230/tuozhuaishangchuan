// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './authentication'
import 'babel-polyfill'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import contextmenu from './components/ContextMenu'
import './components/ContextMenu/styles/index.styl'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import './directives/dialogDrag'
import 'animate.css'
import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import VueBus from 'vue-bus'
import '@/styles/index.less'
import echarts from 'echarts'
import 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table/lib/index.css'
import 'vxe-table-plugin-element/dist/style.css'

import App from './App'
import store from './store'
import router from './router'
import api from '@/api'
import lodash from '@/utils/lodash'
import {forThousands} from '@/filters'
import ZMessage from '@/utils/ZMessage'
import {registerGlobalEventListener} from '@/utils/dom'
import IntroJs from 'intro.js'
import 'intro.js/introjs.css'
import {hasPermission} from '@/utils/permission'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
let options = {
  fullscreenEl: false,
  index: 3
}
Vue.use(preview, options)
Vue.use(preview)

Vue.config.productionTip = false

Vue.use(IntroJs)
Vue.use(VueBus)
Vue.use(HappyScroll)
Vue.use(contextmenu)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 99999
  }
})
Vue.use(Element, {
  size: 'small' // set element-ui default size
})
Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
// 全局事件监听
registerGlobalEventListener()

Vue.prototype.$echarts = echarts
Vue.prototype.$api = api
Vue.prototype.$_ = lodash

Vue.prototype.$hasPermission = hasPermission

Viewer.setDefaults({
  Options: {
    'inline': true,
    'button': true,
    'navbar': true,
    'title': true,
    'toolbar': true,
    'tooltip': true,
    'movable': true,
    'zoomable': true,
    'rotatable': true,
    'scalable': true,
    'transition': true,
    'fullscreen': true,
    'keyboard': true,
    'url': 'data-source'
  }
})
Vue.filter('forThousands', forThousands)

// 自定义配置项
ZMessage.setConfig({ max: 1, isQueue: false, showNewest: true })

// 覆盖默认$message
Vue.prototype.$message = ZMessage
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  data () {
    return {
      appData: {
        selectTreeItem: ''
      }
    }
  },
  render: h => h(App)
})
