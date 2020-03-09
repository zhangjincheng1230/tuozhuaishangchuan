// 科目明细账
import {post, get, exportExcel, downloadFile} from '@/utils/request'
import {getMonthBegin, getMonthEnd} from "@/utils"

// 查询
export function query (param) {
  return post('/report/gl_rep_kmmxjact/queryAction', param)
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
  const qrydate = getMonthBegin(param.periodRange[0]) + '-' + getMonthEnd(param.periodRange[1])
  return exportExcel('/report/gl_rep_kmmxjact/export/excel', filename + '- (' + qrydate + ')', param)
}

// 打印
export function printPdf (filename, param) {
  return downloadFile('/report/gl_rep_kmmxjact/print', param)
}

// 打印封皮
export function printCoverPdf (filename, param) {
  return downloadFile('/report/gl_rep_kmmxjact/printcover/pdf', param)
}
