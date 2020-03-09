// 财务概要信息表
import { post} from '@/utils/request'

// 查询
export function query (param) {
  return post('/zxkj/workbench/accountqry/query', param)
}
