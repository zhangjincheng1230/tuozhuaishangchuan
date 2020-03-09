// 发生额余额表
import { formatDate } from '@/utils'
import { post, get, exportExcel, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return post('/report/gl_rep_fsyebact/queryAction', param)
}

// 查询一年数据
export function queryYear (data) {
  return post('/report/gl_rep_fsyebact/queryYear', data)
}

// 查询辅助类别
export function getCurrency (pkCorp) {
  return get('/report/gl_rep_qrysysset/queryCurrency', {corpid: pkCorp})
}
// 查询科目
export function getSubjectRef (pkCorp) {
  return get('/report/gl_rep_qrysysset/querySubjectRef', {corpid: pkCorp})
}
// 导出
export function expExcel (filename, param) {
  console.log('expExcel***param------------------>', param)
  return exportExcel('/report/gl_rep_fsyebact/export/excel', filename + '(' + param.corpName + ')_' + formatDate(new Date()), param)
}
// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_fsyebact/print', param)
}
