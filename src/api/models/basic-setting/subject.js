// 会计科目
import { get, post } from '@/utils/request'
import store from '@/store'

function reloadSubjectData (res) {
  if (res.success) {
    store.dispatch('fetchSubjectRefData').then(() => {})
  }
}
// 查询参照用科目
export function getSubjectRef () {
  return get('/zxkj/bdset/gl_cpacckmact/queryByPz')
}
// 查询科目
export function getSubject (param) {
  return get('/zxkj/bdset/gl_cpacckmact/query', param)
}

// 获取新编码
export function getNewCode (param) {
  return get('/zxkj/bdset/gl_cpacckmact/getNewCode', param)
}

// 根据公司pk查找参照科目
export function getSubjectRefByPkCorp (pk) {
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkCorp', {pk_corp: pk})
}

// 删除科目
export function deleteSubject (data) {
  return post('/zxkj/bdset/gl_cpacckmact/delete', data, {
    cb: reloadSubjectData
  })
}

// 新增科目
export function saveSubject (data) {
  return post('/zxkj/bdset/gl_cpacckmact/save', data, {
    cb: reloadSubjectData
  })
}

// 修改科目
export function updateSubject (data) {
  return post('/zxkj/bdset/gl_cpacckmact/update', data, {
    cb: reloadSubjectData
  })
}

// 封存科目
export function sealSubject (data) {
  return post('/zxkj/bdset/gl_cpacckmact/seal', data, {
    cb: reloadSubjectData
  })
}

// 解封科目
export function unsealSubject (data) {
  return post('/zxkj/bdset/gl_cpacckmact/unseal', data, {
    cb: reloadSubjectData
  })
}
// 是否允许增加下级科目
export function isAllowAdd (data) {
  return post('/zxkj/bdset/gl_cpacckmact/isAllowAdd', data)
}
// 编辑时校验
export function checkOnEdit (data) {
  return post('/zxkj/bdset/gl_cpacckmact/checkOnEdit', data)
}
// 上级科目是否被引用
export function checkParentRef (data) {
  return get('/zxkj/bdset/gl_cpacckmact/checkParentRef', data)
}
// 下级转辅助
export function childrenToAuxiliary (data) {
  return post('/zxkj/bdset/gl_cpacckmact/childrenToAuxiliary', data, {
    cb: reloadSubjectData
  })
}
