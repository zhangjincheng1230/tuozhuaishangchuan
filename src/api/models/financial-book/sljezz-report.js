// 数量金额总账
import { formatDate } from '@/utils'
import { get, downloadFile, exportExcel } from '@/utils/request'

// 查询
export function query (param) {
  return get('/report/gl_rep_sljezzact/queryAction', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_sljezzact/print', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_sljezzact/export/excel', filename + formatDate(new Date()), param)
}
