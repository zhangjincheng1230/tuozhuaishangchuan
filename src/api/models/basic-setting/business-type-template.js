// 业务类型模板api
import { get, post, downloadFile } from '@/utils/request'

// 查询
export function queryTemp (param) {
  return get('/zxkj/sys/sys_dcpzmb/query', param)
}

export function queryB (param) {
  return get('/zxkj/sys/sys_dcpzmb/queryChildByID', param)
}

// 查询行业相关
export function queryHYRef (param) {
  return get('/zxkj/sys/sys_hyact/queryRef', param)
}

// 保存
export function saveTemp (data) {
  return post('/zxkj/sys/sys_dcpzmb/save', data)
}
// 删除
export function deleteTemp (data) {
  return post('/zxkj/sys/sys_dcpzmb/delete', data)
}
//
export function copyTemp (data) {
  return post('/zxkj/sys/sys_dcpzmb/copyTocorp', data)
}
// 导入
export function importB (data) {
  return post('/zxkj/sys/sys_dcpzmb/impExcel', data)
}
// 导入模板导出
export function expExcel (data) {
  return downloadFile('/zxkj/sys/sys_dcpzmb/expExcel', data)
}
