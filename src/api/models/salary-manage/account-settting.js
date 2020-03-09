// 入账设置 api
import { get, post } from '@/utils/request'

// 查询入账设置
export function query (param) {
  return get('/zxkj/salary/gl_gzkmszact2/query', param)
}

// 保存入账设置
export function saveInfo (param) {
  return post('/zxkj/salary/gl_gzkmszact2/save', param)
}

// 默认设置
export function saveGroup (param) {
  return get('/zxkj/salary/gl_gzkmszact2/saveGroup', param)
}

// 查询部门费用科目
export function queryFyKm (param) {
  return get('/zxkj/salary/gl_gzkmszact2/queryFyKm', param)
}

// 查询部门费用科目
export function saveFyKm (param) {
  return post('/zxkj/salary/gl_gzkmszact2/saveFykm', param)
}
