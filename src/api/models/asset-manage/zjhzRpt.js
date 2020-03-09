// 折旧汇总表
import {exportExcel, get, post, printpdf} from '@/utils/request'

// 折旧汇总表查询
export function tableofcontents (data) {
  return post('/zxkj/am_rep_zjhzbact/query', data)
}

// 折旧汇总表打印
export function printPdf (fileName, param) {
  return printpdf('/zxkj/am_rep_zjhzbact/print', fileName, param)
}
// 折旧汇总表导出
export function exportData (fileName, param) {
  return exportExcel('/zxkj/am_rep_zjhzbact/export/excel', fileName, param)
}
