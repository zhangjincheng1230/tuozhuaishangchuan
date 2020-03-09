// 银行账户api
import { get, post } from '@/utils/request'

// 查询银行账户
export function queryBankAccount (param) {
  return get('/zxkj/bdset/gl_yhzhact/query', param)
}
// 启用银行账户
export function enableBankAccount (data) {
  return post('/zxkj/bdset/gl_yhzhact/qiyong', data)
}
// 停用银行账户
export function disableBankAccount (data) {
  return post('/zxkj/bdset/gl_yhzhact/tingyong', data)
}
// 获取银行账户新编码
export function getBankAccountCode (param) {
  return get('/zxkj/bdset/gl_yhzhact/queryDjCode', param)
}
// 保存银行账户
export function saveBankAccount (data) {
  return post('/zxkj/bdset/gl_yhzhact/save', data)
}
// 删除银行账户
export function deleteBankAccount (data) {
  return post('/zxkj/bdset/gl_yhzhact/delete', data)
}
