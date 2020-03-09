// 申报查询api
import { get, post } from '@/utils/request'

// 查询主表
export function queryTemp (param) {
  return get('/zxkj/taxrpt/declaraquery/query', param)
}
// 查询子表
export function queryB (param) {
  return get('/zxkj/taxrpt/declaraquery/queryB', param)
}
// 查询
export function getData (param) {
  return get('/zxkj/taxrpt/declaraquery/getSpreadJsData', param)
}
