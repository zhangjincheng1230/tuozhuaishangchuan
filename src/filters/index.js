// set function parseTime,formatTime to filter
// export { parseTime, formatTime } from '../libs/utils'

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化 */
export function numberFormatter (num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}
export function toThousandslsFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
export function taxRateFilter (num) {
  var taxRate = parseFloat(num) * 100
  return taxRate + '%'
}
export function dateFormatChinese (date) {
  if (date) {
    return formatDate(new Date(date), 'yyyy年MM月dd日')
  }
}
function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 格式化数字
 * @param num
 * @param precision 精度
 * @param showZero 显示0
 * @returns {string}
 */
export function forThousands (num, precision = 2, showZero) {
  if (num === null || num === undefined || num === '') {
    num = 0
  }
  const numVal = Number(num)
  if (!showZero && numVal === 0) {
    return ''
  } else {
    const rpReg = new RegExp('(\\d)(?=(\\d{3})+(?:\\.\\d+)' + (precision === 0 ? '?' : '+') + '$)', 'g')
    return numVal.toFixed(precision).replace(rpReg, '$1,')
  }
}
