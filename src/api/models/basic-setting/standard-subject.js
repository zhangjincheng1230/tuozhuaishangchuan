// 标准科目api
import { get, post } from '@/utils/request'
// 查询行业
export function queryHy () {
  return get('/zxkj/bdset/gl_synccpacckmact/queryHy', {})
}
// 查询公司
export function queryGs (param) {
  return post('/zxkj/bdset/gl_synccpacckmact/queryGs', param)
}
// 保存科目
export function saveCpacountVOS (data) {
  return post('/zxkj/bdset/gl_synccpacckmact/save', data)
}
