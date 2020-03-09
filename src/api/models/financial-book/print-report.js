// 打印设置
import { post } from '@/utils/request'

// 报表设置
export function printQuerySetting (nodeName, corpid) {
  return post('/zxkj/gl_printsetting/query', { nodeName: nodeName, pk_corp: corpid })
}

export function saveSetting (param) {
  return post('/zxkj/gl_printsetting/save', param)
}

export function saveMulColumn (param) {
  return post('/zxkj/gl_printsetting/saveMulColumn', param)
}
