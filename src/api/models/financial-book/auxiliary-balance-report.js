// 辅助余额表
import { get, downloadFile, exportExcel as export1 } from '@/utils/request'

// 查询
export function query (param) {
  return get('/report/gl_rep_fzyebact/queryAction', param)
}
// 打印
export function printPdf (fileName, param) {
  return downloadFile('/report/gl_rep_fzyebact/print', param)
}
// 导出
export function exportExcel (fileName, param) {
  return export1('/report/gl_rep_fzyebact/export/excel', fileName, param)
}
