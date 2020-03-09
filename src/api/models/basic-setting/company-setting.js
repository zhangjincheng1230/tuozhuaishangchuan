// 账套设置api
import { get, post } from '@/utils/request'
import {RELATE_DATE_TYPE} from '@/constants'
import Vue from "vue";

// 查询报税地区
export function queryArea (param) {
  return get('/zxkj/sys/sys_area/queryArea', param)
}

// 查询公司
export function query (param) {
  // return get('/zxkj/sys/sys_zxkj_corpact/query', param)
  return get('/zxkj/sys/sys_kj_ztsz/query', param)
}

// 启用总账核算存货
export function updateStGenledic (param) {
  return post('/zxkj/sys/sys_corpact/updateStGenledic', param)
}

// 停用总账核算存货
export function updateSpGenledic (param) {
  return post('/zxkj/sys/sys_corpact/updateSpGenledic', param)
}

// 启用资产
export function updateHflag (param) {
  return post('/zxkj/sys/sys_corpact/updateHflag', param)
}

// 停用资产
export function updateTyHflag (param) {
  return post('/zxkj/sys/sys_corpact/updateTyHflag', param)
}

// 启用库存
export function updateBuildic (param) {
  return post('/zxkj/sys/sys_corpact/updateBuildic', param)
}

// 停用库存
export function updateTyBuildic (param) {
  return post('/zxkj/sys/sys_corpact/updateTyBuildic', param)
}

// 查询标准行业
export function queryHyRef (param) {
  return get('/zxkj/sys/sys_hyact/queryRef', param)
}

//查询单个信息
// export function queryByInfo (param) {
//   return get('/zxkj/sys/sys_kj_ztsz/queryByInfo', param)
// }

//查询办税人员
export function queryUser (param) {
  return get('/zxkj/sys/sys_zxkj_corpact/queryUser', param)
}

//保存
export function saveInfo (param) {
  return post('/zxkj/sys/sys_kj_ztsz/updateTax', param, {
    cb: reloadCorps
  })
}

function reloadCorps (res) {
  if (res.success) {
    Vue.bus.emit(RELATE_DATE_TYPE.companyinfo)
    store.commit('setCorpInfo', res.rows)

  }
}

//查询纳税信息表
export function queryTaxRpt (param) {
  return get('/zxkj/sys/corpTaxact/queryTaxRpt', param)
}

//查询历史记录
export function queryChargeHis (param) {
  return get('/zxkj/sys/sys_zxkj_corpact/queryChargeHis', param)
}

//删除历史记录
export function delchargHis (param) {
  return post('/zxkj/sys/sys_zxkj_corpact/delchargHis', param)
}
