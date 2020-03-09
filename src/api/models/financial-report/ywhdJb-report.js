// 业务活动表季报
import {post, downloadFile, exportExcel} from '@/utils/request'

// 查询
export function query (param) {
  return post('/report/gl_rep_ywhdquarterlybact/queryAction', param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_ywhdquarterlybact/print', param)
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_ywhdquarterlybact/export/excel', filename, param)
}
