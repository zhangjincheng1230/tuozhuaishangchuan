// 职员信息api
import {downloadFile, get, post} from '@/utils/request'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}
// 查询辅助人员
export function queryB (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}

// 查询辅助人员按照编码或者名称
export function queryParam (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryBParam', param)
}

// 删除职员信息
export function deleteRows (param) {
  return post('/zxkj/bdset/gl_fzhsact/deleteB', param, {
    cb: notifyDataChange
  })
}

// 封存职员信息
export function onSeal (param) {
  return get('/zxkj/bdset/gl_fzhsact/onSeal', param, {
    cb: notifyDataChange
  })
}

// 取消封存职员信息
export function unSeal (param) {
  return get('/zxkj/bdset/gl_fzhsact/unSeal', param, {
    cb: notifyDataChange
  })
}

// 导入职员信息
export function importB (param) {
  return post('/zxkj/bdset/gl_fzhsact/importB', param, {
    cb: notifyDataChange
  })
}

// 批量修改职员信息
export function batchSave (param) {
  return post('/zxkj/bdset/gl_fzhsact/batchSaveZy', param, {
    cb: notifyDataChange
  })
}

// 保存职员信息
export function onSave (param) {
  return post('/zxkj/bdset/gl_fzhsact/saveB', param, {
    cb: notifyDataChange
  })
}

// 获取辅助编号
export function getCode (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryDjCode', param)
}

// 辅助档案模板导出
export function expExcel (data) {
  return downloadFile('/zxkj/bdset/gl_fzhsact/expExcel', data)
}
