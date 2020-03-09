// 现金流量期初api
import {
  get,
  post
} from '@/utils/request'

const api = {
  query (param) {
    return get('/zxkj/gl_dataupgrade/loaddata', param)
  },
  save (data) {
    return post('/zxkj/gl_dataupgrade/update', data)
  },
  queryCurrentCodeRule (data) {
    return post('/zxkj/bdset/gl_cpacckmact/queryAccountRule', data)
  }
}
export default api
