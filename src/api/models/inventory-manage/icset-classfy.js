
// 存货分类
import {get, post, downloadFile} from '@/utils/request'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}
// 查询
export function queryInv (data) {
  return get('/zxkj/icset/invclassify/queryInv', data)
}

// 查询
export function query (data) {
  return get('/zxkj/icset/invclassify/query', data)
}

// 存货分类保存
export function save (data) {
  return post('/zxkj/icset/invclassify/save', data, {
    cb: notifyDataChange
  })
}

// 存货分类删除
export function deleteData (data) {
  return post('/zxkj/icset/invclassify/delete', data, {
    cb: notifyDataChange
  })
}

// 存货分类导入
export function impExcel (data) {
  return post('/zxkj/icset/invclassify/impExcel', data, {
    cb: notifyDataChange
  })
}

// 存货分类导出模板
export function expExcel (data) {
  return downloadFile('/zxkj/icset/invclassify/expExcel', data)
}

// 存货分类编码
export function queryDjCode (data) {
  return get('/zxkj/icset/invclassify/queryDjCode', data)
}
