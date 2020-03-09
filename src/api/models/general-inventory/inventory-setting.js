// 存货设置 api
import {get, post} from '@/utils/request'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}
// 查询入账设置
export function query (param) {
  return get('/zxkj/glic/gl_icinvset/query', param)
}
// 入账设置保存
export function save (param) {
  return post('/zxkj/glic/gl_icinvset/save', param, {
    cb: notifyDataChange
  })
}
// 默认设置
export function setdefaultvalue (param) {
  return get('/zxkj/glic/gl_icinvset/setdefaultvalue', param)
}
