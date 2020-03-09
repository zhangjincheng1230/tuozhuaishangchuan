// 参数设置api
import { get, post } from '@/utils/request'

// 查询
export function query () {
  return get('/zxkj/sys/sys_parameteract/queryInfo', {})
}

// 参数设置保存
export function onSave (data) {
  return post('/zxkj/sys/sys_parameteract/onSave', data)
}
