// 出库单
import {get, downloadFile} from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/icbill/tradeoutact/query', param)
}

// 导出
export function expExcel (param) {
  return downloadFile('/zxkj/icbill/tradeoutact/expExcel', param)
}

// 打印
export function print (param) {
  return downloadFile('/zxkj/icbill/tradeoutact/print', param)
}
