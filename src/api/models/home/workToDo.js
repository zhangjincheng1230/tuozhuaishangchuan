import {post} from '@/utils/request'

// 首页-待办事项
export function query (param) {
  return post('/zxkj/sys/sys_work_todo/query', param)
}
// 首页添加新待办事项
export function save (param) {
  return post('/zxkj/sys/sys_work_todo/save', param)
}
// 添加新待办事项人员参考
export function queryUser (param) {
  return post('/zxkj/sys/sys_work_todo/queryuser', param)
}
// 处理待办事项
export function hand (param) {
  return post('/zxkj/sys/sys_work_todo/hand', param)
}
// 删除待办事项
export function del (param) {
  return post('/zxkj/sys/sys_work_todo/delete', param)
}
