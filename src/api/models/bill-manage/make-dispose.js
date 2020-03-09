// 开票处理
import {post, get} from '@/utils/request'

export function accounting (param) { // 入账
  return post('/zxkj/bill/billing_process/accounting', param)
}

export function sentOut (param) { // 寄出
  return post('/zxkj/bill/billing_process/sentOut', param)
}

export function billing (param) { // 开票
  return post('/zxkj/bill/billing_process/billing', param)
}

export function tax (param) { // 报税
  return post('/zxkj/bill/billing_process/tax', param)
}

export function query (param) { // 查询
  return get('/zxkj/bill/billing_process/query', param)
}

export function queryB (param) { // 查询子表
  return get('/zxkj/bill/billing_process/queryB', param)
}
