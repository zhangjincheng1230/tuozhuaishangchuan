// 存货期初api
import {downloadFile, get, post} from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/glic/gl_icinvqc/query', param)
}
// 保存
export function save (param) {
  return post('/zxkj/glic/gl_icinvqc/save', param)
}
// 删除
export function onDelete (param) {
  return post('/zxkj/glic/gl_icinvqc/onDelete', param)
}
// 同步
export function sync (param) {
  return get('/zxkj/glic/gl_icinvqc/sync', param)
}
// 导入
export function importExcel (param) {
  return post('/zxkj/glic/gl_icinvqc/importExcel', param)
}
// 获取更新启用日期
export function updateDate (param) {
  return get('/zxkj/glic/gl_icinvqc/updateDate', param)
}

// 导入模板导出
export function expExcel (data) {
  return downloadFile('/zxkj/glic/gl_icinvqc/expExcel', data)
}

// 获取期初 日期
export function getQcDate (data) {
  return get('/zxkj/glic/gl_icinvqc/getQcDate', data)
}
