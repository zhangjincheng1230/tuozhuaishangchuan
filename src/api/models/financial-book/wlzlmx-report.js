// 往来账龄明细api
import {
  post, exportExcel
} from '@/utils/request'
const api = {
  query (param) {
    return post('/report/gl_rep_zlmxbact/query', param)
  },
  exportExcel (fileName, data) {
    return exportExcel('/report/gl_rep_zlmxbact/export/excel', fileName, data)
  }
}
export default api
