// 折旧明细账
import { post, printpdf, exportExcel } from '@/utils/request'

export function queryTableList (param) {
  return post('/zxkj/am_rep_zczjmxact/query', param)
}

export function printData (fileName, param) {
  return printpdf('/zxkj/am_rep_zczjmxact/print', fileName, param)
}

export function exportData (fileName, param) {
  return exportExcel('/zxkj/am_rep_zczjmxact/export/excel', fileName, param)
}
