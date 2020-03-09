// 总账对账
import { post, printpdf } from '@/utils/request'

export function queryData (param) {
  return post('/zxkj/am/am_rep_zczzdzbact/query ', param)
}

export function printData (fileName, param) {
  return printpdf('/zxkj/am/am_rep_zczzdzbact/print', fileName, param)
}
