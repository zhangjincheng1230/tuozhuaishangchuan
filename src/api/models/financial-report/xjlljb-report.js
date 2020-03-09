import {
  exportExcel,
  post, downloadFile
} from '@/utils/request'

export function query (param) {
  return post('/report/gl_rep_xjlyquarbact/queryAction', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_xjlyquarbact/export/excel', filename, param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_xjlyquarbact/print', param)
}
