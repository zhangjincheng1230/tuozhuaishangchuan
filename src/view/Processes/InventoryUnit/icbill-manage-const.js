import { orderBy } from 'natural-orderby'
export const purchInType = [
  {label: '全部', value: ''},
  {label: '采购入库', value: '41'},
  {label: '完工入库', value: '42'},
  {label: '其他入库', value: '43'}
]

export const saleOutType = [
  {label: '全部', value: ''},
  {label: '销售出库', value: '46'},
  {label: '领料出库', value: '47'},
  {label: '其他出库', value: '48'},
  {label: '成本调整', value: '49'}
]

export const purchInZg = [
  {label: '全部', value: ''},
  {label: '是', value: 'Y'},
  {label: '否', value: 'N'}
]

export function invDataFullName (invdata, ishiddenbm) {
  if (invdata) {
    for (const data of invdata) {
      if (data) {
        let formate = ''
        if (!ishiddenbm) {
          formate = data.spbm + '  / ' + data.spmc
        } else {
          formate = data.spmc
        }
        if (data.gg) {
          formate = formate + '  / ' + data.gg
        }
        if (data.jldw) {
          formate = formate + '  / ' + data.jldw
        }
        data.fullname = formate
      }
    }
    orderBy(invdata, v => v.spbm)
  }
  return invdata
}
