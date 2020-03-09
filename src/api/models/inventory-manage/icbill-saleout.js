// 出库单
import {downloadFile, get, post} from '@/utils/request'

export function queryData (param) { // 查询
  return get('/zxkj/icbill/saleoutact/query', param)
}

export function querySub (param) { // 查询子表信息
  return post('/zxkj/icbill/saleoutact/querySub', param)
}

export function copeData (param) { // 复制
  return get('/zxkj/icbill/saleoutact/copy', param)
}

export function editData (param) { // 修改
  return get('/zxkj/icbill/saleoutact/modify', param)
}

export function queryBYH (param) { // 跳转修改
  return post('/zxkj/icbill/saleoutact/queryBYH', param)
}

export function delSale (param) { // 删除
  return post('/zxkj/icbill/saleoutact/delSale', param)
}

export function saveSale (param) { // 保存
  return post('/zxkj/icbill/saleoutact/saveSale', param)
}
export function togl (param) { // 转总账
  return post('/zxkj/icbill/saleoutact/togl', param)
}

export function toTotalGL (param) { // 汇总转总账
  return post('/zxkj/icbill/saleoutact/toTotalGL', param)
}

export function rollback (param) { // 取消转总账
  return post('/zxkj/icbill/saleoutact/rollbackTogl', param)
}

export function impExcel (param) { // 导入
  return post('/zxkj/icbill/saleoutact/impExcel', param)
}

export function expExcel (param) { // 导出
  return downloadFile('/zxkj/icbill/saleoutact/expExcel', param)
}

export function printPdf (param) { // 打印
  return downloadFile('/zxkj/icbill/saleoutact/print', param)
}
export function dashBack (param) { // 红字冲回
  return post('/zxkj/icbill/saleoutact/dashBack', param)
}

export function getBillNo (param) { // 获取单据号
  return get('/zxkj/icbill/saleoutact/getBillno', param)
}
