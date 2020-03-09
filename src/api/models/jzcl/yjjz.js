// 一键结转 api
import { get, post } from '@/utils/request'
import Vue from 'vue'
import {RELATE_DATE_TYPE} from '@/constants'

function notifyVoucherChange (res) {
  if (res.success) {
    Vue.bus.emit(RELATE_DATE_TYPE.period_close)
  }
}

// 查询
export function query (param) {
  return post('/zxkj/gl/gl_yjjzact/query', param)
}

// 查询设置
export function queryset (param) {
  return get('/zxkj/gl/gl_yjjzact/queryset', param)
}

// 保存设置
export function savejzSet (param) {
  return post('/zxkj/gl/gl_yjjzact/savejzSet', param)
}

// 一键结转
export function onYjjz (param) {
  return post('/zxkj/gl/gl_yjjzact/onYjjz', param, {cb: notifyVoucherChange})
}

// 取消一键结转
export function cancelYjjz (param) {
  return post('/zxkj/gl/gl_yjjzact/cancelYjjz', param, {cb: notifyVoucherChange})
}
