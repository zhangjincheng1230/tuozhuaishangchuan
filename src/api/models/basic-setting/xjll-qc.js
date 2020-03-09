// 现金流量期初api
import {
  get,
  post
} from '@/utils/request'

const api = {
  query (param) {
    return get('/zxkj/gl_qcxjlyact/query', param)
  },
  save (data) {
    return post('/zxkj/gl_qcxjlyact/save', data)
  },
  update (data) {
    return post('/zxkj/gl_qcxjlyact/update', data)
  },
  delete (data) {
    return post('/zxkj/gl_qcxjlyact/delete', data)
  },
  qryPrjInv (data) {
    return post('/zxkj/gl_invcashfolw/query', data)
  }
}
export default api
