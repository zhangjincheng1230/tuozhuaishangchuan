// 凭证模板api
import { get, post } from '@/utils/request'

// 查询常用模板
export function queryTemp (param) {
  return get('/zxkj/bdset/gl_cymb/query', param)
}
// 获取新编码
export function getNewCode (param) {
  return get('/zxkj/bdset/gl_cymb/getNewCode', param)
}

// 保存常用模板
export function saveTemp (data) {
  return post('/zxkj/bdset/gl_cymb/save', data)
}
// 删除常用模板
export function deleteTemp (data) {
  return post('/zxkj/bdset/gl_cymb/delete', data)
}
// 辅助常用模板
export function copyTemp (data) {
  return post('/zxkj/bdset/gl_cymb/copy', data)
}
