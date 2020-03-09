// 存货别名 api
import { get, post } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/icset/invalias/queryInv', param)
}

// 存货保存
export function save (param) {
  return post('/zxkj/icset/invalias/save', param)
}

// 存货删除
export function deleteData (param) {
  return post('/zxkj/icset/invalias/onDelete', param)
}
