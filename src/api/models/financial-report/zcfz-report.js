import {
  post, downloadFile, exportExcel
} from '@/utils/request'
import { getMonthEnd } from '@/utils'

// 查询
export function query (param) {
  return post('/report/gl_rep_zcfzact/queryAction', param)
}

// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_zcfzact/print', param)
}

// 标准导出
export function excelExcel (filename, param, callback) {
  return exportExcel('/report/gl_rep_zcfzact/export/excel', filename, param, callback)
}

// 税局导出
export function expExcelSj (param, callback, fileType = 'application/zip;charset=gb2312') {
  let filename = '资产负债表、利润表、现金流量表(' + param.period + ')'
  if (param.areaType === '0' || param.areaType === '6') {
    filename += '.tax'
    fileType = 'application/octet-stream;charset=gb2312'
  } else {
    filename += '.zip'
  }
  return exportExcel('/report/gl_rep_zcfzact/exportSj/excel', filename, param, callback, fileType)
}
// 标准导出
export function excelExcelEn (param, callback, fileType = 'application/zip;charset=gb2312') {
  let filename = '资产负债表、利润表、现金流量表(' + param.period + ').zip'
  param.period = getMonthEnd(param.period)
  return exportExcel('/report/gl_rep_zcfzact/export/excelEn', filename, param, callback, fileType)
}
