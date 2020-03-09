// 科目汇总表
import { get, exportExcel, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return get('/report/gl_rep_kmhzbact/queryAction', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_kmhzbact/print', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_kmhzbact/export/excel', filename, param)
}
