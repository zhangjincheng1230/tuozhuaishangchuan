import {get, post} from '@/utils/request'

// 打印设置
export function queryPrintSetting (param) {
  return get('/zxkj/gl_printsetting/query', param)
}

export function savePrintSetting (data) {
  return post('/zxkj/gl_printsetting/save', data)
}
