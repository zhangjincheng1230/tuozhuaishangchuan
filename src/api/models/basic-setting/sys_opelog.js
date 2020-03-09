// 操作日志api
import { formatDate } from '@/utils'
import { get, post, downloadFile, exportExcel, printpdf } from '@/utils/request'
// 查询日志
export function queryLogs (param) {
    return get('/zxkj/sys/sys_opelog/query', param)
}
//查询类型
export function queryType (param) {
  return get('/zxkj/sys/sys_opelog/queryType', param)
}
//查询用户
export function queryOpeUser (param) {
  return get('/zxkj/sys/sys_opelog/queryOpeUser', param)
}
// 打印
export function printPdf (fileName, data) {
  return printpdf('/zxkj/sys/sys_opelog/print', fileName, data)
}
// 导出
export function expExcel (fileName, data) {
  return exportExcel('/zxkj/sys/sys_opelog/export/excel', fileName + '_' + formatDate(new Date()), data)
}

