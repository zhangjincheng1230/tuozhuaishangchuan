// 存货档案 api
import { get, post } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/glic/gl_icinvalias/query', param)
}

// 存货保存
export function save (param) {
  return post('/zxkj/glic/gl_icinvalias/save', param)
}

// 存货删除
export function deleteData (param) {
  return post('/zxkj/glic/gl_icinvalias/onDelete', param)
}
