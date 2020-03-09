// 分部利润表
import {post, get, exportExcel, downloadFile} from '@/utils/request'
import {getMonthEnd} from '@/utils'

// 查询
export function query (param) {
  return post('/report/gl_rep_lrbact/queryCenterAction', param)
}
// 查询辅助类别
export function getFzLb (pkCorp) {
  return get('/report/gl_rep_qrysysset/queryFzLb', {corpid: pkCorp})
}
// 查询辅助项目
export function getFzxm (pkCorp) {
  return get('/report/gl_rep_qrysysset/queryFzxm', {corpid: pkCorp})
}
// 导出
export function expExcel (filename, param) {
  return exportExcel('/report/gl_rep_lrbact/export/excel', filename, param)
}

// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_lrbact/print', param)
}
