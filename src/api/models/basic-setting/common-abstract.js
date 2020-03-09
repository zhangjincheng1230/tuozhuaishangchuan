// 常用摘要api
import { get, post } from '@/utils/request'

export function queryAbstract () {
  return get('/zxkj/sys/sys_zyact/query', {})
}

export function queryAbstractbyid (param) {
  return get('/zxkj/sys/sys_zyact/queryByID', param)
}

export function saveAbstract (data) {
  return post('/zxkj/sys/sys_zyact/save', data)
}

export function deleteAbstract (data) {
  return post('/zxkj/sys/sys_zyact/onDelete', data)
}

export function checkExistAbstract (data) {
  return post('/zxkj/sys/sys_zyact/existCheck', data)
}

export function queryParentAbstract (param) {
  return get('/zxkj/sys/sys_zyact/queryParent', param)
}
