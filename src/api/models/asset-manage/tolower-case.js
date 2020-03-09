// 资产清理
import { post, printpdf } from '@/utils/request'

export function queryList (param) {
  return post('/zxkj/am_zcqlact/query ', param)
}

export function printData (fileName, param) {
  return printpdf('/zxkj/am_zcqlact/print', fileName, param)
}

export function toLedeger (param) {
  return post('/zxkj/am_zcqlact/onBoToGL', param)
}

export function deleteDataRow (param) {
  return post('/zxkj/am_zcqlact/delete', param)
}
