// 出入库明细表 api
import { get, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/glic/gl_rep_crkmxact/query', param)
}

// 打印
export function printPdf (param) {
  return downloadFile('/zxkj/glic/gl_rep_crkmxact/print', param)
}

// 导出
export function exportExcel (param) {
  return downloadFile('/zxkj/glic/gl_rep_crkmxact/expExcel', param, { oldApi: true })
}
