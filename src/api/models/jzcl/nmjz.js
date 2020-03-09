// 财务概要信息表
import { post, printpdf } from '@/utils/request'

// 查询
export function query (param) {
  return post('/zxkj/gl_qmjzact/query', param)
}
// 利润结转
export function profitJz (param) {
  return post('/zxkj/gl_qmjzact/profitJz', param)
}
// 反利润结转
export function fanLiRunJz (param) {
  return post('/zxkj/gl_qmjzact/fanLiRunJz', param)
}
// 结账检查
export function checksettle (param) {
  return post('/zxkj/gl_qmjzact/checksettle', param)
}
// 结账
export function settle (param) {
  return post('/zxkj/gl_qmjzact/settle', param)
}
// 反结账
export function unsettle (param) {
  return post('/zxkj/gl_qmjzact/unsettle', param)
}
// 打印
export function printPdf (fileName, param) {
  return printpdf('/zxkj/gl_qmjzact/print', fileName, param)
}
// 年末结账查询
export function search (param) {
  return post('/zxkj/gl_kmjzqueryact/query', param)
}
