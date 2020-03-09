// 期末结转模版
import { get, post } from '@/utils/request'

// 查询结转成本模板
export function getCostTransferTemplate (param) {
  return get('/zxkj/bdset/gl_cpcbmbact/query', param)
}
// 保存结转成本模板
export function saveCostTransferTemplate (data) {
  return post('/zxkj/bdset/gl_cpcbmbact/save', data)
}
// 更新结转成本模板
export function updateCostTransferTemplate (data) {
  return post('/zxkj/bdset/gl_cpcbmbact/update', data)
}
// 删除结转成本模板
export function deleteCostTransferTemplate (data) {
  return post('/zxkj/bdset/gl_cpcbmbact/delete', data)
}

// 查询汇兑损益模板
export function queryExchangeTemplate (data) {
  return get('/zxkj/bdset/gl_remittance/query', data)
}
// 保存汇兑损益模板
export function saveExchangeTemplate (data) {
  return post('/zxkj/bdset/gl_remittance/save', data)
}
// 删除汇兑损益模板
export function deleteExchangeTemplate (data) {
  return post('/zxkj/bdset/gl_remittance/delete', data)
}
// 查询附加税模板
export function getSurtaxTemplate (data) {
  return get('/zxkj/bdset/gl_surtaxtempact/query', data)
}
// 保存附加税模板
export function saveSurtaxTemplate (data) {
  return post('/zxkj/bdset/gl_surtaxtempact/save', data)
}
// 查询利润结转模板
export function getProfitTemplate (data) {
  return get('/zxkj/bdset/gl_cplrmbact/query', data)
}

// 保存利润结转模板
export function saveProfitTemplate (data) {
  return post('/zxkj/bdset/gl_cplrmbact/save', data)
}

// 删除利润结转模板
export function deleteProfitTemplate (data) {
  return post('/zxkj/bdset/gl_cplrmbact/delete', data)
}

// 查询期间损益模板
export function queryQjsyTemplate (data) {
  return get('/zxkj/bdset/gl_cpsymb/query', data)
}

export function saveQjsyTemplate (data) {
  return post('/zxkj/bdset/gl_cpsymb/save', data)
}

export function deleteQjsyTemplate (data) {
  return post('/zxkj/bdset/gl_cpsymb/delete', data)
}
