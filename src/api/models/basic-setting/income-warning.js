// 预警设置api
import {get, post} from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/gl/gl_incomewarning/query', param)
}

// 查询
export function queryIncomeWarningInfo (param) {
  return get('/zxkj/gl/gl_incomewarning/queryIncomeWarningInfo', param)
}

// 保存
export function save (data) {
  return post('/zxkj/gl/gl_incomewarning/save', data)
}

// 删除
export function del (data) {
  return post('/zxkj/gl/gl_incomewarning/onDelete', data)
}

