// 库存汇总表
import {get, downloadFile} from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/icreport/rep_hzbact/query', param)
}

// 导出
export function expExcel (param) {
  return downloadFile('/zxkj/icreport/rep_hzbact/expExcel', param)
}

// 打印
export function print (param) {
  return downloadFile('/zxkj/icreport/rep_hzbact/print', param)
}
