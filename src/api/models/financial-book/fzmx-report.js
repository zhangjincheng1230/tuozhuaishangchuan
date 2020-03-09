// 辅助明细表
import {post, exportExcel, downloadFile} from '@/utils/request'

// 查询
export function query (param) {
  return post('/report/gl_rep_fzkmmxjact/queryAction', param)
}
// 打印
export function printPdf (filename,param) {
  return downloadFile('/report/gl_rep_fzkmmxjact/print', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_fzkmmxjact/export/excel', filename, param)
}
