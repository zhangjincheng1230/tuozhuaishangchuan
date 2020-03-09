// 期末处理 api
import {downloadFile, get, post, printpdf} from '@/utils/request'
import Vue from 'vue'
import {RELATE_DATE_TYPE} from '@/constants'

function notifyVoucherChange (res) {
  if (res.success) {
    Vue.bus.emit(RELATE_DATE_TYPE.period_close)
  }
}

// 查询
export function query (param) {
  return post('/zxkj/gl/gl_qmgzact/query', param)
}
// 关账
export function ongz (param) {
  return post('/zxkj/gl/gl_qmgzact/onGz', param,{cb: notifyVoucherChange})
}
// 反关账
export function onfangz (param) {
  return post('/zxkj/gl/gl_qmgzact/fanGz', param,{cb: notifyVoucherChange})
}
// 反关账校验
export function checkLaterMonthGz (param) {
  return post('/zxkj/gl/gl_qmgzact/checkLaterMonthGz', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/zxkj/gl/gl_qmgzact/print', param)
}
