// 存货档案
import {get, post, downloadFile} from '@/utils/request'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}
// 存货档案查询
export function queryB (param) {
  return get('/zxkj/icset/inventoryact/queryInfoBypage', param)
}
// 存货查询 按照参数
export function queryBParam (param) {
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}
// 存货保存
export function save (param) {
  return post('/zxkj/icset/inventoryact/save', param, {
    cb: notifyDataChange
  })
}
// 存货批改
export function batchSave (param) {
  return post('/zxkj/icset/inventoryact/batchSave', param, {
    cb: notifyDataChange
  })
}
// 存货删除
export function onDelete (param) {
  return post('/zxkj/icset/inventoryact/onDelete', param, {
    cb: notifyDataChange
  })
}
// 存货导入
export function impExcel (param) {
  return post('/zxkj/icset/inventoryact/impExcel', param, {
    cb: notifyDataChange
  })
}
// 存货合并
export function mergeData (param) {
  return post('/zxkj/icset/inventoryact/mergeData', param, {
    cb: notifyDataChange
  })
}
// 获取存货编码
export function getCode (param) {
  return get('/zxkj/icset/inventoryact/queryDjCode', param)
}

// 获取存货档案科目参照
export function queryBySpecialKM (param) {
  return get('/zxkj/icset/inventoryact/queryBySpecialKM', param)
}

// 存货档案生成结算价
export function fTradePrice (param) {
  return post('/zxkj/icset/inventoryact/createPrice', param)
}

// 存货档案导出模板
export function expExcel (data) {
  return downloadFile('/zxkj/icset/inventoryact/expExcel', data)
}

// 工业成本结转，查询商品
export function queryInfo_kcsp (data) {
  return get('/zxkj/icset/inventoryact/queryInfo_kcsp', data)
}
