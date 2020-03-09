import {
  get, exportExcel, downloadFile
} from '@/utils/request'

const api = {
  query (param) {
    return get('/report/gl_rep_yyfpact/query', param)
  },
  exportExcel (fileName, data, callback) {
    return exportExcel('/report/gl_rep_yyfpact/export/excel', fileName, data, callback)
  },
  printPdf (fileName, data) {
    return downloadFile('/report/gl_rep_yyfpact/print', data)
  }
}
export default api
