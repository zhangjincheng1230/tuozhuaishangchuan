// 库存成本表 api
import { get, post, downloadFile } from '@/utils/request'

// 查询
export function query (param) {
  return get('/zxkj/glic/gl_rep_kcccbact/query', param)
}

export function showzg (param) {
  return get('/zxkj/glic/gl_rep_kcccbact/showzg', param)
}

export function adjustKc (param) {
  return get('/zxkj/glic/gl_rep_kcccbact/adjustKc', param)
}

export function zgsave (param) {
  return post('/zxkj/glic/gl_rep_kcccbact/zgsave', param)
}

export function getClassifyFlag (param) {
  return get('/zxkj/glic/gl_rep_kcccbact/getClassifyFlag', param)
}

// 打印
export function printPdf (param) {
  return downloadFile('/zxkj/glic/gl_rep_kcccbact/print', param)
}

// 导出
export function exportExcel (param) {
  return downloadFile('/zxkj/glic/gl_rep_kcccbact/expExcel', param)
}
