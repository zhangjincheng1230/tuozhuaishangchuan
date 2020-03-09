// 资产总账
import {exportExcel, get, post, printpdf} from '@/utils/request'

// 资产总账打印
export function printPdf (fileName, param) {
  return printpdf('/zxkj/am_rep_zczzact/print', fileName, param)
}

// 资产总账查询
export function query (data) {
  return post('/zxkj/am_rep_zczzact/query', data)
}
