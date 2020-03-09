// 增值税明细api
import {
  post, exportExcel
} from '@/utils/request'
const api = {
  query (param) {
    return post('/report/gl_rep_zzsmxact/query', param)
  }
}
export default api
