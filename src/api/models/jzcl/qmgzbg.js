// 期末处理 api
import {get, post, printpdf} from '@/utils/request'

// 查询
export function query (param) {
  return post('/zxkj/gl/gl_qmgzact/queryQmGzBg', param)
}
// 关账
export function ongz (param) {
  return post('/zxkj/gl/gl_qmgzact/onGz', param)
}
// 反关账
export function onfangz (param) {
  return post('/zxkj/gl/gl_qmgzact/fanGz', param)
}
// 反关账校验
export function checkLaterMonthGz (param) {
  return post('/zxkj/gl/gl_qmgzact/checkLaterMonthGz', param)
}
// 反关账校验
export function saveSet (param) {
  return post('/zxkj/gl/gl_qmgzact/saveSet', param)
}

// 自动整理
export function autoSort (param) {
 return post('/zxkj/gl/gl_qmgzact/sort', param)
}
