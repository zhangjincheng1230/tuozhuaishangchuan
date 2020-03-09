// 销售凭证模板api
import {
  get,
  post
} from '@/utils/request'
const api = {
  // 查询销售凭证模板
  queryXspzMb (param) {
    return get('/gl/gl_xssrmb!query', param, {
      oldApi: true
    })
  },
  // 保存销售凭证模板
  saveXspzMb (data) {
    return post('/gl/gl_xssrmb!save', data, {
      oldApi: true
    })
  },
  // 删除销售凭证模板
  deleteXspzMb (data) {
    return post('/gl/gl_xssrmb!delete', data, {
      oldApi: true
    })
  }
}

export default api
