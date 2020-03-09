// 现金流量期初api
import {
  get, exportExcel, downloadFile
} from '@/utils/request'

const api = {
  query (param) {
    return get('/report/gl_rep_qybdact/query', param)
  },
  exportExcel (fileName, data, callback) {
    return exportExcel('/report/gl_rep_qybdact/export/excel', fileName, data, callback)
  },
  printPdf (fileName, data) {
    return downloadFile('/report/gl_rep_qybdact/print', data)
  }
}
export default api
