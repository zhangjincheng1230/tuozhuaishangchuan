// 备份与恢复api
import { get, post, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/gl/gl_backupact/query', param)
}
// 开始备份
export function save (data) {
  return post('/zxkj/gl/gl_backupact/save', data)
}
// 批量恢复数据
export function multiRestore (data) {
  return post('/zxkj/gl/gl_backupact/multiRestore', data)
}
// 恢复数据
export function restore (param) {
  return get('/zxkj/gl/gl_backupact/restore', param)
}
// 删除数据
export function del (data) {
  return post('/zxkj/gl/gl_backupact/delete', data)
}
// 下载数据
export function download (data) {
  return downloadFile('/zxkj/gl/gl_backupact/download', data)
}
// 上传数据
export function upload (data) {
  return post('/zxkj/gl/gl_backupact/upload', data)
}
// 更新备注
export function upBack (data) {
  return post('/zxkj/gl/gl_backupact/upBackVo', data)
}
