// 外币汇率api
import { get, post } from '@/utils/request'
import { getCurrencyArchive } from '@/api/models/basic-setting/currency'

export function queryExRate (param) {
  return get('/zxkj/bdset/gl_bdhlact/query', param)
}

// 未使用
export function queryExRatebyid (param) {
  return get('/zxkj/bdset/gl_bdhlact/queryOne', param)
}

export function saveExRate (data) {
  return post('/zxkj/bdset/gl_bdhlact/save', data)
}

export function deleteExRate (data) {
  return post('/zxkj/bdset/gl_bdhlact/delete', data)
}

// 查询所有币种
export function queryCurrency () {
  return getCurrencyArchive({})
}

// // 查询集团币种档案
// export function queryCurrency () {
//   return get('/sys/sys_currentact/queryCurrency', {}, { oldApi: true })
// }
