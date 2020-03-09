// 辅助核算
import { get, post, downloadFile } from '@/utils/request'
import store from '@/store'
import Vue from 'vue'
import {REFRESH_DATA} from '@/constants'
function reloadTypeCacheData (res) {
  if (res.success) {
    store.dispatch('fetchAuxiliaryType').then(() => {})
  }
}
function reloadArchiveCacheDataById (id) {
}
function reloadArchiveCacheData (res) {
  if (res.success) {
    notifyDataChange(res)
  }
}
function notifyDataChange (res) {
  if (res.success) {
    Vue.bus.emit(REFRESH_DATA.refreshData)
  }
}
// 查询辅助核算类别
export function getType (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryH', param)
}
// 新增辅助类别
export function saveType (data) {
  return post('/zxkj/bdset/gl_fzhsact/saveH', data, {
    cb: reloadTypeCacheData
  })
}
// 删除辅助类别
export function deleteType (data) {
  return post('/zxkj/bdset/gl_fzhsact/deleteH', data, {
    cb: reloadTypeCacheData
  })
}
// 查询辅助档案
export function queryArchive (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}
// 查询辅助档案
export function queryArchiveByParam (param) {
  return get('/zxkj/bdset/gl_fzhsact/queryBParam', param)
}
// 删除辅助档案
export function deleteArchive (data) {
  return post('/zxkj/bdset/gl_fzhsact/deleteB', data, {
    cb: function (res) {
      if (res.success) {
        reloadArchiveCacheDataById(data[0].pid)
      }
    }
  })
}
// 辅助档案新编码
export function getNewCode (data) {
  return get('/zxkj/bdset/gl_fzhsact/queryDjCode', data)
}
// 辅助档案保存
export function saveArchive (data) {
  return post('/zxkj/bdset/gl_fzhsact/saveB', data, {
    cb: reloadArchiveCacheData
  })
}
// 辅助档案导入
export function importArchive (data) {
  return post('/zxkj/bdset/gl_fzhsact/importB', data, {
    cb: reloadArchiveCacheData
  })
}
// 辅助档案更新导入
export function importArchiveUpdate (data) {
  return post('/zxkj/bdset/gl_fzhsact/impUpdateB', data, {
    cb: reloadArchiveCacheData
  })
}
// 辅助档案更新导入模板导出
export function exportArchiveTemplate (data) {
  return downloadFile('/zxkj/bdset/gl_fzhsact/exportData', data)
}
// 辅助档案模板导出
export function expExcel (data) {
  return downloadFile('/zxkj/bdset/gl_fzhsact/expExcel', data)
}
// 人员批量修改
export function batchEditStaff (data) {
  return post('/zxkj/bdset/gl_fzhsact/batchSaveZy', data, {
    cb: reloadArchiveCacheData
  })
}
// 封存
export function seal (data) {
  return post('/zxkj/bdset/gl_fzhsact/onSeal', data, {
    cb: reloadArchiveCacheData
  })
}
// 取消封存
export function unseal (data) {
  return post('/zxkj/bdset/gl_fzhsact/unSeal', data, {
    cb: reloadArchiveCacheData
  })
}

// 是否存货大类
export function checkIsInventoryCategory (param) {
  return get('/zxkj/bdset/gl_fzhsact/isInventoryCategory', param)
}
