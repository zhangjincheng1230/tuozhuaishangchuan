// 往来账龄余额api
import {
  post, exportExcel
} from '@/utils/request'
const api = {
  query (param) {
    return post('/report/gl_rep_zlyebact/query', param)
  },
  exportExcel (fileName, data) {
    return exportExcel('/report/gl_rep_zlyebact/export/excel', fileName, data)
  }
}
export default api
