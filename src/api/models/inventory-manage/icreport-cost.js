// 库存成本表
import {get, downloadFile} from '@/utils/request'

export function queryData (param) {
  return get('/zxkj/icreport/rep_cbbact/query', param)
}

export function expExcel (param) {
  return downloadFile('/zxkj/icreport/rep_cbbact/expExcel', param)
}

export function printData (param) {
  return downloadFile('/zxkj/icreport/rep_cbbact/print', param)
}
