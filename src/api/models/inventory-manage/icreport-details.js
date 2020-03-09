// 库存明细账
import {downloadFile, get} from '@/utils/request'

export function queryData (param) {
  return get('/zxkj/icreport/mxzact/queryAction', param)
}

export function expExcel (param) {
  return downloadFile('/zxkj/icreport/mxzact/expExcel', param)
}

export function printRows (param) {
  return downloadFile('/zxkj/icreport/mxzact/print', param)
}
