// 数量金额明细账
import { post, downloadFile, exportExcel } from '@/utils/request'

// 查询
export function query (param) {
  return post('/report/gl_rep_sljemxzact/query', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_sljemxzact/print', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_sljemxzact/export/excel', filename, param)
}
