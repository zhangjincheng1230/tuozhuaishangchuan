// 现金流量表
import {post, downloadFile, exportExcel} from '@/utils/request'

// 查询
export function query (param) {
  return post('/report/gl_rep_xjlybact/queryAction', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_xjlybact/print', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_xjlybact/export/excel', filename, param)
}
// 联查明细
export function linkXjllMx (param) {
  return post('/report/gl_rep_xjlybact/queryMxAction', param)
}
// 现金流量明细导出
export function exportXjllMxExcel (filename, param) {
  return exportExcel('/report/gl_rep_xjlybact/export/excelmx', filename, param)
}
// 联查凭证
export function linkXjllPz (param) {
  return post('/report/gl_rep_xjlybact!linkPz', param, { oldApi: true })
}
// 联查现金流量期初
export function linkXjllQc (param) {
  return post('gl/gl_qcset/gl_qcxjly.jsp', param, { oldApi: true })
}
