// 资产明细账
import {exportExcel, get, post, printpdf} from '@/utils/request'

// 资产明细账打印
export function printPdf (fileName, param) {
  return printpdf('/zxkj/am_rep_zcmxact/print', fileName, param)
}

// 资产明细账查询
export function query (data) {
  return post('/zxkj/am_rep_zcmxact/query', data)
}
