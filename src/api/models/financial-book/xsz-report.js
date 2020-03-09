// 序时账
import {formatDate, getMonthBegin, getMonthEnd} from '@/utils'
import {post, get, exportExcel, downloadFile} from '@/utils/request'

// 查询
export function query (param) {
  return post('/report/gl_rep_xszact/query', param)
}
// 查询辅助类别
export function getCurrency (pkCorp) {
  return get('/report/gl_rep_qrysysset/queryCurrency', {corpid: pkCorp})
}
// 查询科目
export function getSubjectRef (pkCorp) {
  return get('/report/gl_rep_qrysysset/querySubjectRef', {corpid: pkCorp})
}
// 导出
export function expExcel (filename, param) {
  // const qrydate = getMonthBegin(param.periodRange[0]) + '-' + getMonthEnd(param.periodRange[1])
  return exportExcel('/report/gl_rep_xszact/export/excel', filename + '- (' + formatDate(new Date()) + ')', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_xszact/print', param)
}
