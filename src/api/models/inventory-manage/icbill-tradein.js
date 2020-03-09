// 入库单
import {get, downloadFile} from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/icbill/tradeinact/query', param)
}

// 导出
export function expExcel (param) {
  return downloadFile('/zxkj/icbill/tradeinact/expExcel', param)
}

// 打印
export function print (param) {
  return downloadFile('/zxkj/icbill/tradeinact/print', param)
}
