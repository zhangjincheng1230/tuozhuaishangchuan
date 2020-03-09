// 多栏账api
import {
  get, post, exportExcel, downloadFile
} from '@/utils/request'
const api = {
  query (param) {
    return post('/report/gl_rep_multiserv/query', param)
  },
  exportExcel (fileName, data) {
    return exportExcel('/report/gl_rep_multiserv/export/excel', fileName, data)
  },
  printPdf (fileName, data) {
    return downloadFile('/report/gl_rep_multiserv/print', data)
  },
  queryFzxm (pkCorp) {
    return get('/report/gl_rep_multiserv/queryFzxm', {corpid: pkCorp})
  }
}
export default api
