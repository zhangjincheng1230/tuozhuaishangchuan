// 凭证管理
import {downloadFile, get, post} from '@/utils/request'
import Vue from 'vue'
import {RELATE_DATE_TYPE} from '@/constants'

function notifyVoucherChange (res) {
  if (res.success) {
    Vue.bus.emit(RELATE_DATE_TYPE.voucher)
  }
}

export function save (data) {
  return post('/zxkj/voucher-manage/voucher/save', data, {
    cb: notifyVoucherChange
  })
}

export function sort (data) {
  return post('/zxkj/voucher-manage/voucher/sort', data, {
    cb: notifyVoucherChange
  })
}

export function deleteVoucher (data) {
  return post('/zxkj/voucher-manage/voucher/delete', data, {
    cb: notifyVoucherChange
  })
}

export function mergeVoucher (data) {
  return post('/zxkj/voucher-manage/voucher/mergeVoucher', data, {
    cb: notifyVoucherChange
  })
}

export function importVoucher (data) {
  return post('/zxkj/voucher-manage/voucher/importVoucher', data, {
    cb: notifyVoucherChange
  })
}

export function audit (data) {
  return post('/zxkj/voucher-manage/voucher/audit', data)
}

export function unAudit (data) {
  return post('/zxkj/voucher-manage/voucher/unAudit', data)
}

export function account (data) {
  return post('/zxkj/voucher-manage/voucher/account', data)
}

export function unAccount (data) {
  return post('/zxkj/voucher-manage/voucher/unAccount', data)
}

export function modifyCreator (data) {
  return post('/zxkj/voucher-manage/voucher/modifyCreator', data)
}

export function queryVoucher (param) {
  return get('/zxkj/voucher-manage/voucher/query', param)
}

export function queryById (param) {
  return get('/zxkj/voucher-manage/voucher/queryById', param)
}

export function copy (data) {
  return post('/zxkj/voucher-manage/voucher/copy', data)
}

export function queryCommonAssist (param) {
  return get('/zxkj/voucher-manage/common-assist/query', param)
}

export function saveCommonAssist (data) {
  return post('/zxkj/voucher-manage/common-assist/save', data)
}

export function deleteCommonAssist (data) {
  return post('/zxkj/voucher-manage/common-assist/delete', data)
}

export function checkCommonAssistExist (data) {
  return post('/zxkj/voucher-manage/common-assist/checkExist', data)
}

export function getTaxItem (param) {
  return get('/zxkj/voucher-manage/voucher/getTaxItem', param)
}

export function getNewCode (param) {
  return get('/zxkj/voucher-manage/voucher/getNewCode', param)
}

export function printVoucher (data) {
  return downloadFile('/zxkj/voucher-manage/voucherPrint/print', data)
}

export function printVoucherCover (data) {
  return downloadFile('/zxkj/voucher-manage/voucherPrint/printCover', data)
}

export function checkChannelContract (param) {
  return get('/zxkj/voucher-manage/voucher/checkChannelContract', param)
}

export function queryPowerUser (param) {
  return get('/zxkj/voucher-manage/voucher/queryPowerUser', param)
}

export function queryMergeSetting () {
  return get('/zxkj/voucher-manage/voucher/queryMergeSetting')
}

export function saveMergeSetting (data) {
  return post('/zxkj/voucher-manage/voucher/saveMergeSetting', data)
}

export function getTempById (param) {
  return get('/zxkj/voucher-manage/voucher/getTempById', param)
}

export function queryImage (param) {
  return get('/zxkj/voucher-manage/voucher/queryImage', param)
}

export function getImageById (param) {
  return get('/zxkj/voucher-manage/voucher/getImageById', param)
}

export function getVoucherCashFlow (param) {
  return get('/zxkj/voucher-manage/voucher/getVoucherCashFlow', param)
}

export function saveVoucherCashFlow (data) {
  return post('/zxkj/voucher-manage/voucher/saveVoucherCashFlow', data)
}

export function deleteVoucherCashFlow (data) {
  return post('/zxkj/voucher-manage/voucher/deleteVoucherCashFlow', data)
}

export function getVoucherTaxItem (param) {
  return get('/zxkj/voucher-manage/voucher/getVoucherTaxItem', param)
}

export function saveVoucherTaxItem (data) {
  return post('/zxkj/voucher-manage/voucher/saveVoucherTaxItem', data)
}

export function deleteVoucherTaxItem (data) {
  return post('/zxkj/voucher-manage/voucher/deleteVoucherTaxItem', data)
}

export function exportVoucher (data) {
  return downloadFile('/zxkj/voucher-manage/voucher/exportExcel', data)
}

export function downloadTemplate (data) {
  return downloadFile('/zxkj/voucher-manage/voucher/downloadTemplate', data)
}

export function queryAssistPrintSetting (param) {
  return get('/zxkj/voucher-manage/voucher/queryAssistPrintSetting', param)
}

export function saveAssistPrintSetting (data) {
  return post('/zxkj/voucher-manage/voucher/saveAssistPrintSetting', data)
}

export function sign (data) {
  return get('/zxkj/voucher-manage/vouchersign/sign', data)
}

export function cancelSign (data) {
  return get('/zxkj/voucher-manage/vouchersign/cancelSign', data)
}

export function saveAsTemplate (data) {
  return post('/zxkj/voucher-manage/voucher/saveAsTemplate', data)
}

export function checkInventoryExist (param) {
  return get('/zxkj/voucher-manage/voucher/checkCrkmx', param)
}

export function printInventory (data) {
  return downloadFile('/zxkj/voucher-manage/voucher/printCrkmx', data)
}

export function readColumnSetting (param) {
  return get('/zxkj/voucher-manage/voucher/readColumnSetting', param)
}

export function saveColumnSetting (data) {
  return post('/zxkj/voucher-manage/voucher/saveColumnSetting', data)
}

export function queryHeadByPeriod (param) {
  return get('/zxkj/voucher-manage/voucher/queryHeadByPeriod', param)
}

export function queryChildren (param) {
  return get('/zxkj/voucher-manage/voucher/queryChildren', param)
}

export function manualSort (data) {
  return post('/zxkj/voucher-manage/voucher/manualSort', data)
}

export function checkHasScarletLetter (param) {
  return get('/zxkj/voucher-manage/voucher/checkHasScarletLetter', param)
}
