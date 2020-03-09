// 毛利率 api
import { get, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/glic/gl_rep_mllbact/query', param)
}

// 打印
export function printPdf (param) {
  return downloadFile('/zxkj/glic/gl_rep_mllbact/print', param)
}

// 导出
export function exportExcel (param) {
  return downloadFile('/zxkj/glic/gl_rep_mllbact/expExcel', param)
}
