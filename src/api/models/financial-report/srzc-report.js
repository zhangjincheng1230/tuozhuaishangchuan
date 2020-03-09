// 收入支出表
import {post, downloadFile, exportExcel} from '@/utils/request'
// 查询
export function query (param) {
  return post('/report/gl_rep_srzcbact/queryAction', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_srzcbact/export/excel', filename, param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_srzcbact/print', param)
}
