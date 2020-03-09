// 科目期初
import {downloadFile, exportExcel, get, post, printpdf} from '@/utils/request'
import {formatDate} from "@/utils";

// 科目期初查询
export function query (param) {
  return get('/zxkj/qcset/gl_qcyeact/query', param)
}
// 辅助类别查询
export function queryFzlb (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryH', param)
}
// 辅助项目查询
export function queryFzXm (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}
// 获取币种
export function querybz () {
  return get('/zxkj/qcset/gl_qcyeact/queryCur')
}
// 获取币种
export function queryVerifyBeginAccounts () {
  return get('/zxkj/qcset/gl_qcyeact/queryVerifyBeginAccounts')
}
// 试算平衡
export function ssph () {
  return post('/zxkj/qcset/gl_qcyeact/ssph')
}
// 清除数据
export function clearSelect (param) {
  return get('/zxkj/qcset/gl_qcyeact/deleteAct', param)
}
// 固定资产期初同步
export function syngdzc () {
  return get('/zxkj/qcset/gl_qcyeact/gdzcsync')
}
// 库存期初同步
export function synkc (param) {
  return get('/zxkj/qcset/gl_qcyeact/kcsync', param)
}
// 打印
export function printPdf (filename, param) {
  return printpdf('/zxkj/qcset/gl_qcyeact/print', filename, param)
}
// 保存
export function save (param) {
  return post('/zxkj/qcset/gl_qcyeact/save', param)
}
// 辅助期初保存
export function fzqcsave (param) {
  return post('/zxkj/qcset/gl_fzhsqcact/saveFzQc', param)
}
// 未核销期初查询
export function whxqcquery (param) {
  return get('/zxkj/qcset/gl_qcyeact/queryVerifyBegin', param)
}
// 未核销期初保存
export function whxqcsave (param) {
  return post('/zxkj/qcset/gl_qcyeact/verifySave', param)
}
// 期初导出(辅助期初和科目期初)
export function expExcel (filename, param) {
  return exportExcel('/zxkj/qcset/gl_qcyeact/export/excel', filename, param)
}
// 期初导入
export function importExcel (param) {
  return post('/zxkj/qcset/gl_qcyeact/importExcel', param)
}
