// 入库单
import {get, post, downloadFile} from '@/utils/request'

export function queryData (param) { // 查询
  return get('/zxkj/icbill/purchinact/query', param)
}

export function getBillNo (param) { // 获取单据号
  return get('/zxkj/icbill/purchinact/getbillno', param)
}

export function copeData (param) { // 复制
  return get('/zxkj/icbill/purchinact/copy', param)
}

export function editData (param) { // 修改
  return get('/zxkj/icbill/purchinact/modify', param)
}

export function deleteRow (param) { // 删除
  return post('/zxkj/icbill/purchinact/delete', param)
}

export function clearToZz (param) { // 取消转总账
  return post('/zxkj/icbill/purchinact/rollbackToZz', param)
}

export function saveToZz (param) { // 转总账
  return post('/zxkj/icbill/purchinact/saveToZz', param)
}

export function saveToTotalZz (param) { // 汇总转总账
  return post('/zxkj/icbill/purchinact/saveToTotalZz', param)
}

export function impExcel (param) { // 导入
  return post('/zxkj/icbill/purchinact/impExcel', param)
}

export function expExcel (param) { // 导出
  return downloadFile('/zxkj/icbill/purchinact/expExcel', param)
}

export function print (param) { // 打印
  return downloadFile('/zxkj/icbill/purchinact/print', param)
}

export function saveData (param) {
  return post('/zxkj/icbill/purchinact/save', param)
}

export function getCustomerName (param) { // 获取供应商
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}
