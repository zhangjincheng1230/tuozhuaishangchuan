// 资产卡片
import {exportExcel, get, post} from '@/utils/request'

export function loadData (param) { // 资产卡片参照查询
  return get('/zxkj/am_kpglact/queryRefData', param)
}

export function queryData (param) { // 资产卡片查询/刷新
  return post('/zxkj/am_kpglact/query', param)
}

export function add () { // 资产卡片新增
  return post('/zxkj/am_kpglact/doAdd')
}

export function editData (param) { // 资产卡片修改
  return post('/zxkj/am_kpglact/checkEdit', param)
}

export function deleteDataRow (param) { // 删除
  return post('/zxkj/am_kpglact/delete', param)
}

export function checkBefSave (param) { // 资产保存校验
  return post('/zxkj/am_kpglact/checkBefSave', param)
}

export function saveDataRow (param) { // 资产保存
  return post('/zxkj/am_kpglact/save', param)
}

export function trunLedger (param) { // 资产转总账/合并制证
  return get('/zxkj/am_kpglact/batchToVoucher', param)
}

export function adjusts (param) { // 年限调整
  return get('/zxkj/am_kpglact/adjustLimit', param)
}

export function asstesClear (param) { // 资产清理
  return post('/zxkj/am_kpglact/updateMultAssetClear', param)
}

export function cardTidy (param) { // 卡片整理
  return post('/zxkj/am_kpglact/doOrder', param)
}

export function queryFromZclb (param) { // 查询资产类别
  return get('/zxkj/am_kpglact/queryKmFromZclb', param)
}

export function expExcel (filename, param) { // 导出
  return exportExcel('/zxkj/am_kpglact/export/excel', filename, param)
}

// 资产导入
export function importExcel (param) {
  return post('/zxkj/am_kpglact/importExcel', param)
}

// 显示列设置
export function columnSet (param) {
  return post('/zxkj/am_kpglact/saveDisplayColumn', param)
}

// 查询显示列
export function qryColumnSet (param) {
  return post('/zxkj/am_kpglact/queryDisplayColumn', param)
}
