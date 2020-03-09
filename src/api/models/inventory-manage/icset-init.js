// 库存期初
import {get, post ,downloadFile} from '@/utils/request'
export function queryInfo (param) {
  return get('/zxkj/icset/qcact/queryInfo', param)
}

export function saveInfo (param) {
  return post('/zxkj/icset/qcact/onUpdate', param)
}

export function DeleteRow (param) {
  return post('/zxkj/icset/qcact/onDelete', param)
}

export function importExcel (param) {
  return post('/zxkj/icset/qcact/impExcel', param)
}

// 导出模板
export function expExcel (data) {
  return downloadFile('/zxkj/icset/qcact/expExcel', data)
}
