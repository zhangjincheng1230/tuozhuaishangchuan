// 存货档案 api
import {downloadFile, get, post} from '@/utils/request'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}
// 查询
export function queryB (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}
// 存货查询 按照参数
export function queryBParam (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryBParam', param)
}
// 存货保存
export function saveb (param) {
  return post('/zxkj/bdset/gl_fzhsact/saveB', param, {
    cb: notifyDataChange
  })
}
// 存货批改
export function batchSaveB (param) {
  return post('/zxkj/bdset/gl_fzhsact/batchSaveB', param, {
    cb: notifyDataChange
  })
}
// 存货删除
export function deleteB (param) {
  return post('/zxkj/bdset/gl_fzhsact/deleteB', param, {
    cb: notifyDataChange
  })
}
// 存货导入
export function importB (param) {
  return post('/zxkj/bdset/gl_fzhsact/importB', param, {
    cb: notifyDataChange
  })
}
// 存货导入更新
export function impUpdateB (param) {
  return post('/zxkj/bdset/gl_fzhsact/impUpdateB', param, {
    cb: notifyDataChange
  })
}
// 存货合并
export function mergeData (param) {
  return post('/zxkj/bdset/gl_fzhsact/mergeData', param, {
    cb: notifyDataChange
  })
}
// 获取出库科目
export function getChukuKm (param) {
  return get('/zxkj/bdset/gl_fzhsact/getChukuKm', param)
}
// 获取科目类别
export function getKmclassify (param) {
  return get('/zxkj/bdset/gl_fzhsact/getKmclassify', param)
}

// 获取辅助编号
export function getCode (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryDjCode', param)
}

// 查询入账设置
export function querySetting (param) {
  return get('/zxkj/glic/gl_icinvset/query', param)
}

// 导入模板导出
export function expExcel (data) {
  return downloadFile('/zxkj/bdset/gl_fzhsact/expExcel', data)
}

// 辅助档案更新导入模板导出
export function exportArchiveTemplate (data) {
  return downloadFile('/zxkj/bdset/gl_fzhsact/exportData', data)
}
