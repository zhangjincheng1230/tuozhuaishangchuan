// 纳税工作台api
import { get, post, exportExcel, downFj } from '@/utils/request'
// 查询所有客户的数据
export function query (param) {
  return post('/zxkj/workbench/query', param)
}
// 查询单个客户的数据
export function queryByCorp (param) {
  return post('/zxkj/workbench/queryByCorp', param)
}
// 保存
export function save (param) {
  return post('/zxkj/workbench/save', param)
}
// 取数
export function fetchData (param) {
  return post('/zxkj/workbench/fetchData', param)
}
// 提醒
export function saveRemind (param) {
  return post('/zxkj/workbench/saveRemind', param)
}
// 提醒历史
export function queryHistory (param) {
  return post('/zxkj/workbench/queryHistory', param)
}
// 导出excel
export function exportData (fileName, param) {
  return exportExcel('/zxkj/workbench/export/excel', fileName, param)
}
// 提醒设置
export function sendReminSet (param) {
  return post('/zxkj/workbench/sendReminSet', param)
}
// 查询期间的数据
export function qryRemindSet (param) {
  return post('/zxkj/workbench/qryRemindSet', param)
}
// 查询主办会计
export function queryUser (param) {
  return post('/zxkj/workbench/queryUser', param)
}
// 获取财务进度
export function getFinanceProgress (param) {
  return post('/zxkj/workbench/getFinanceProgress', param)
}
// 更新财务进度
export function updateFinanceProgress (param) {
  return post('/zxkj/workbench/updateFinanceProgress', param)
}
// 查询
export function queryCol (param) {
  return post('/zxkj/workbench/queryCol', param)
}
// 保存
export function saveCol (param) {
  return post('/zxkj/workbench/saveCol', param)
}
// 保存
export function queryAllArea (param) {
  return get('/zxkj/sys/sys_area/queryAllArea', param)
}
// 上传文件
export function uploadFile (param) {
  return post('/zxkj/workbench/uploadFile', param, {'Content-Type': 'multipart/form-data'})
}

// 上传文件
export function getAttaches (param) {
  return post('/zxkj/workbench/getAttaches', param)
}
// 上传文件
export function delAttaches (param) {
  return post('/zxkj/workbench/delAttaches', param)
}
// 上传文件
export function downloadAttach (fileName, param) {
  return downFj('/zxkj/workbench/downloadAttach', fileName, param)
}
