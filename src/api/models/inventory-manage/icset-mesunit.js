// 计量单位
import {get, post, downloadFile} from '@/utils/request'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}

// 计量单位获取编码
export function queryDjCode (data) {
  return get('/zxkj/icset/meausreact/queryDjCode', data)
}

// 计量单位获查询
export function queryInfo (data) {
  return get('/zxkj/icset/meausreact/queryInfo', data)
}

// 计量单位保存
export function save (data) {
  return post('/zxkj/icset/meausreact/onUpdate', data, {
    cb: notifyDataChange
  })
}

// 计量单位删除
export function onDelete (data) {
  return post('/zxkj/icset/meausreact/onDelete', data, {
    cb: notifyDataChange
  })
}
// 计量单位导入
export function impExcel (data) {
  return post('/zxkj/icset/meausreact/impExcel', data, {
    cb: notifyDataChange
  })
}

// 计量单位导出模板
export function expExcel (data) {
  return downloadFile('/zxkj/icset/meausreact/expExcel', data)
}
