// 原值变更
import {post} from '@/utils/request'

export function queryData (param) {
  return post('/zxkj/am_yzbgact/query', param)
}

export function deleteRows (param) {
  return post('/zxkj/am_yzbgact/delete', param)
}

export function addRows (param) {
  return post('/zxkj/am_yzbgact/save', param)
}
