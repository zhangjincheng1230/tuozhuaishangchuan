// 社保公积金api
import { get, post } from '@/utils/request'

// 查询社保公积金
export function query (param) {
  return get('/zxkj/salary/gl_gzbbase/query', param)
}

// 查询社保公积金比例基数
export function getSalaryAccSet (param) {
  return post('/zxkj/salary/gl_gzbbase/getSalaryAccSet', param)
}

// 保存社保公积金比例基数
export function saveInfo (param) {
  return post('/zxkj/salary/gl_gzbbase/save', param)
}

// 删除社保公积金比例基数
export function deleteRows (param) {
  return post('/zxkj/salary/gl_gzbbase/delete', param)
}

// 批量调整基数设置
export function changeNumBatch (param) {
  return post('/zxkj/salary/gl_gzbbase/changeNum', param)
}
// 统一基数设置
export function changeNumGroup (param) {
  return post('/zxkj/salary/gl_gzbbase/changeNumGroup', param)
}
