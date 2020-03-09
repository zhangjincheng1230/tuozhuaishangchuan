import { orderBy } from 'natural-orderby'

export function invDataFullName (invdata, ishiddenbm) {
  if (invdata) {
    for (const data of invdata) {
      if (data) {
        let formate = ''
        if (!ishiddenbm) {
          formate = data.code + ' / ' + data.name
        } else {
          formate = data.name
        }
        if (data.spec) {
          formate = formate + '  / ' + data.spec
        }
        if (data.unit) {
          formate = formate + '  / ' + data.unit
        }
        data.fullname = formate
      }
    }
    orderBy(invdata, v => v.code)
  }
  return invdata
}
