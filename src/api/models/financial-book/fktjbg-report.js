// 多栏账api
import {
  post
} from '@/utils/request'
const api = {
  query (param) {
    return post('/report/gl_rep_fktjbgact/query', param)
  },
  save (param) {
    return post('/report/gl_rep_fktjbgact/save', param)
  },
  querySds (param) {
    return post('/report/gl_rep_fktjbgact/querySds', param)
  },
  queryZzs (param) {
    return post('/report/gl_rep_fktjbgact/queryZzs', param)
  },
  queryFktj (param) {
    return post('/report/gl_rep_fktjbgact/queryFktj', param)
  }
}
export default api
