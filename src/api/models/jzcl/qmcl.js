// 期末处理 api
import { get, post } from '@/utils/request'
import Vue from 'vue'
import {RELATE_DATE_TYPE} from '@/constants'

function notifyVoucherChange (res) {
  if (res.success) {
    Vue.bus.emit(RELATE_DATE_TYPE.period_close)
  }
}

// 查询
export function query (param) {
  return post('/zxkj/gl/gl_qmclact/query', param)
}

// 联查凭证
export function queryGlpz (param) {
  return post('/zxkj/gl/gl_qmclact/queryGlpz', param)
}

// 计提折旧
export function onjtzj (param) {
  return post('/zxkj/gl/gl_qmclact/onjtzj', param, {cb: notifyVoucherChange})
}

// 反计提折旧
export function canceljtzj (param) {
  return post('/zxkj/gl/gl_qmclact/canceljtzj', param, {cb: notifyVoucherChange})
}

// 增值税结转
export function onzzsjz (param) {
  return post('/zxkj/gl/gl_qmclact/onzzsjz', param, {cb: notifyVoucherChange})
}

// 反增值税结转
export function cancelzzsjz (param) {
  return post('/zxkj/gl/gl_qmclact/cancelzzsjz', param, {cb: notifyVoucherChange})
}

// 计提附加税
export function onjtfjs (param) {
  return post('/zxkj/gl/gl_qmclact/onjtfjs', param, {cb: notifyVoucherChange})
}

// 反计提附加税
export function canceljtfjs (param) {
  return post('/zxkj/gl/gl_qmclact/canceljtfjs', param, {cb: notifyVoucherChange})
}

// 计提所得税
export function onjtsds (param) {
  return post('/zxkj/gl/gl_qmclact/onjtsds', param, {cb: notifyVoucherChange})
}

// 反计提所得税
export function canceljtsds (param) {
  return post('/zxkj/gl/gl_qmclact/canceljtsds', param, {cb: notifyVoucherChange})
}

// 查询以前年弥补亏损
export function queryqmLoss (param) {
  return post('/zxkj/gl/gl_qmclact/queryqmLoss', param)
}

// 更新以前年弥补亏损
export function updateqmLoss (param) {
  return post('/zxkj/gl/gl_qmclact/updateqmLoss', param)
}

// 损益结转
export function onsyjz (param) {
  return post('/zxkj/gl/gl_qmclact/onsyjz', param, {cb: notifyVoucherChange})
}

// 反损益结转
export function cancelsyjz (param) {
  return post('/zxkj/gl/gl_qmclact/cancelsyjz', param, {cb: notifyVoucherChange})
}

// 查询调汇信息
export function queryAdjust (param) {
  return post('/zxkj/gl/gl_qmclact/queryAdjust', param)
}

// 期末调汇
export function onhdsytz (param) {
  return post('/zxkj/gl/gl_qmclact/onhdsytz', param, {cb: notifyVoucherChange})
}

// 反期末调汇
export function cancelhdsytz (param) {
  return post('/zxkj/gl/gl_qmclact/cancelhdsytz', param, {cb: notifyVoucherChange})
}

// 成本结转、汇兑损益调整校验
export function checkTemporaryIsExist (param) {
  return post('/zxkj/gl/gl_qmclact/checkTemporaryIsExist', param)
}

// 批量成本结转
export function onbatcbjz (param) {
  return post('/zxkj/gl/gl_qmclact/onbatcbjz', param, {cb: notifyVoucherChange})
}

// 单条成本结转
export function onsinglecbjz (param) {
  return post('/zxkj/gl/gl_qmclact/onsinglecbjz', param, {cb: notifyVoucherChange})
}

// 取消成本结转
export function cancelCbjz (param) {
  return post('/zxkj/gl/gl_qmclact/cancelCbjz', param, {cb: notifyVoucherChange})
}

// 查询待选择科目
export function queryCBJZKM (param) {
  return post('/zxkj/gl/gl_qmclact/queryCBJZKM', param)
}

// 计算
export function jisuan (param) {
  return post('/zxkj/gl/gl_qmclact/jisuan', param)
}

// 生成凭证
export function saveToPz (param) {
  return post('/zxkj/gl/gl_qmclact/saveToPz', param, {cb: notifyVoucherChange})
}

// 工业结转第1步
export function queryIndustCFVO (param) {
  return post('/zxkj/gl/gl_qmclact/queryIndustCFVO', param)
}

// 工业结转第2步
export function secondquery (param) {
  return post('/zxkj/gl/gl_qmclact/secondquery', param)
}

// 工业结转第3步
export function thirdquery (param) {
  return post('/zxkj/gl/gl_qmclact/thirdquery', param)
}

// 工业结转第4步
export function fourthquery (param) {
  return post('/zxkj/gl/gl_qmclact/fourthquery', param)
}

// 工业结转第5步
export function fivequery (param) {
  return post('/zxkj/gl/gl_qmclact/fivequery', param)
}

// 工业结转第6步
export function onIndustrySave (param) {
  return post('/zxkj/gl/gl_qmclact/onIndustrySave', param, {cb: notifyVoucherChange})
}

// 完工计算
export function onIndustryCalc (param) {
  return post('/zxkj/gl/gl_qmclact/onIndustryCalc', param)
}

// 取消各种场景下的结转(材料结转、辅助成本、制造费用、完工产品、销售成本)（不启用库存，工业结转情况下）
export function canceljiezhuan (param) {
  return post('/zxkj/gl/gl_qmclact/canceljiezhuan', param, {cb: notifyVoucherChange})
}

// 结转辅助生产成本（不启用库存，工业结转情况下）
export function jzfuzhusccb (param) {
  return post('/zxkj/gl/gl_qmclact/jzfuzhusccb', param, {cb: notifyVoucherChange})
}

// 校验成本结转模板（不启用库存，工业结转情况下）
export function checkCbjzmb (param) {
  return post('/zxkj/gl/gl_qmclact/checkCbjzmb', param)
}

// 结转制造费用（不启用库存，工业结转情况下）
export function jzzhizaofy (param) {
  return post('/zxkj/gl/gl_qmclact/jzzhizaofy', param, {cb: notifyVoucherChange})
}

// 完工产品成本分摊查询（不启用库存，工业结转情况下）
export function queryWangong (param) {
  return post('/zxkj/gl/gl_qmclact/queryWangong', param)
}

// 查询完工商品信息 （不启用库存，工业结转情况下）
export function queryCBJZKMwg (param) {
  return post('/zxkj/gl/gl_qmclact/queryCBJZKMwg', param)
}

// 完工保存 （不启用库存，工业结转情况下）
export function savePzWangong (param) {
  return post('/zxkj/gl/gl_qmclact/savePzWangong', param, {cb: notifyVoucherChange})
}
