// 税费计算
import { get, post, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/end-process/tax-calculate/query', param)
}
// 重新取数
export function reFetchData (param) {
  return get('/zxkj/end-process/tax-calculate/reFetchData', param)
}

export function getOtherTaxArchives (param) {
  return get('/zxkj/end-process/tax-calculate/getOtherTaxArchives', param)
}

export function querySurtaxTemplate (param) {
  return get('/zxkj/end-process/tax-calculate/querySurtaxTemplate', param)
}

export function save (data) {
  return post('/zxkj/end-process/tax-calculate/save', data)
}

export function saveSurtaxTemplate (data) {
  return post('/zxkj/end-process/tax-calculate/saveSurtaxTemplate', data)
}

// 导出
export function exportExcel (data) {
  return downloadFile('/zxkj/end-process/tax-calculate/exportExcel', data)
}
