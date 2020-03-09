// 利润表
import {exportExcel, post, downloadFile} from '@/utils/request'
import {getMonthEnd} from '@/utils'

// 查询
export function query (param) {
  return post('/report/gl_rep_lrbact/queryAction', param)
}

export function queryYear (param) {
  return post('/report/gl_rep_lrbact/queryYearAction', param)
}

// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_lrbact/export/excel', filename, param)
}

// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_lrbact/print', param)
}
