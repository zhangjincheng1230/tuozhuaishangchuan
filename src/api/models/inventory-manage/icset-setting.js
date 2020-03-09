// 库存管理入账设置
import {get, post} from '@/utils/request'
// 默认设置
export function saveGroup (data) {
  return get('/zxkj/icset/chkmszact/saveGroup', data)
}

// 查询
export function query (data) {
  return get('/zxkj/icset/chkmszact/query', data)
}

// 保存
export function save (data) {
  return post('/zxkj/icset/chkmszact/save', data)
}
