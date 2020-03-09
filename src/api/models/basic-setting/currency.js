// 币种
import { get } from '@/utils/request'

// 查询科目外币
export function getSubjectCurrency (param) {
  return get('/zxkj/qcset/gl_qcyeact/queryCur', param)
}
// 查询集团币种档案
export function getCurrencyArchive (param) {
  return get('/zxkj/bdset/gl_cpacckmact/getCurrency', param)
}
