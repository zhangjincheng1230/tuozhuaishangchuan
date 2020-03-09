// 纳税填报api
import { get, post } from '@/utils/request'

// 查询列表
export function queryTypeList (param) {
  return get('/zxkj/taxrpt/taxDeclarAction/queryTypeList', param)
}
// 编辑
export function edit (param) {
  return get('/zxkj/taxrpt/taxDeclarAction/getSpreadJsData', param)
}

// 单表重算
export function recal (param) {
  return post('/zxkj/taxrpt/taxDeclarAction/onRecal', param)
}

// 获取表样保存前的校验
export function getCondition (param) {
  return get('/zxkj/taxrpt/taxDeclarAction/getCondition', param)
}

// 保存
export function saveReport (param) {
  return post('/zxkj/taxrpt/taxDeclarAction/saveReport', param)
}

// 删除
export function del (param) {
  return post('/zxkj/taxrpt/taxDeclarAction/onDelete', param)
}

// 批量填写
export function batWrite (param) {
  return post('/zxkj/taxrpt/taxDeclarAction/batWrite', param)
}

// 上报
export function sendTaxReport (param) {
  return post('/zxkj/taxrpt/taxDeclarAction/sendTaxReport', param)
}

// 获取期初
export function getQc (param) {
  return get('/zxkj/cqtc/service_10102/saveReportInitForCorp', param)
}
