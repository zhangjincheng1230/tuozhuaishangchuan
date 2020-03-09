import dayjs from 'dayjs'
import Big from 'big.js'
import router from '@/router'
import store from '@/store'

/**
 * 分页
 * @param data
 * @param page
 * @param rows
 * @returns {Array}
 */
export function pageData (data, page, rows) {
  const beginIndex = (page - 1) * rows
  let endIndex = page * rows
  if (endIndex > data.length) {
    endIndex = data.length
  }
  return beginIndex >= endIndex ? [] : data.slice(beginIndex, endIndex)
}

/**
 * 获取导出列属性
 * @param tableRef
 * @returns {[]}
 */
export function getExportColumns (tableRef) {
  const columns = tableRef.store.states.originColumns
  const columnAttrs = []
  columns.forEach(column => {
    if (column.label || column.property) {
      const width = column.width ? column.width : 100
      if (column.children) {
        column.children.forEach(child => {
          columnAttrs.push({
            columname: column.label + '_' + child.label,
            column: child.property,
            width: Math.ceil(width / 100)
          })
        })
      } else {
        columnAttrs.push({
          columname: column.label,
          column: column.property,
          width: Math.ceil(width / 100)
        })
      }
    }
  })
  return columnAttrs
}

export function addTag (routeName, params) {
  router.push({name, params})
}

export function closeTag (route) {
  if (!route) {
    route = router.currentRoute
  }
  let currentRoute = router.currentRoute
  store.dispatch('tagsView/delView', route).then(({visitedViews}) => {
    if (currentRoute.path === route.path) {
      let latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      }
    }
  })
}

export const defaultDateFormat = 'YYYY-MM-DD'

export function formatDate (date, format = defaultDateFormat) {
  return dayjs(date).format(format)
}

function completeDateString (date) {
  if (typeof date === 'string' && date.length === 7) {
    date += '-01'
  }
  return date
}

export function getMonthEnd (date) {
  date = completeDateString(date)
  return dayjs(date).endOf('month').format(defaultDateFormat)
}

export function getMonthBegin (date) {
  date = completeDateString(date)
  return dayjs(date).startOf('month').format(defaultDateFormat)
}

export function getPreviousYear (date, offset = 1) {
  date = completeDateString(date)
  return dayjs(date).subtract(offset, 'year').format(defaultDateFormat).substring(0, 4)
}

export function getNextYear (date, offset = 1) {
  date = completeDateString(date)
  return dayjs(date).add(offset, 'year').format(defaultDateFormat).substring(0, 4)
}

export function getPreviousPeriod (date, offset = 1) {
  date = completeDateString(date)
  return dayjs(date).subtract(offset, 'month').format(defaultDateFormat).substring(0, 7)
}

export function getNextPeriod (date, offset = 1) {
  date = completeDateString(date)
  return dayjs(date).add(offset, 'month').format(defaultDateFormat).substring(0, 7)
}

export function arrayToMap (array, key, mergeSameKey = false) {
  let map = new Map()
  if (Array.isArray(array)) {
    array.forEach(obj => {
      if (obj) {
        let keyVal = obj[key]
        if (mergeSameKey) {
          if (map.has(keyVal)) {
            map.get(keyVal).push(obj)
          } else {
            map.set(keyVal, [obj])
          }
        } else {
          map.set(keyVal, obj)
        }
      }
    })
  }
  return map
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 除法函数
export function accDiv (arg1, arg2) {
  if (nvlNum(arg2) === 0) {
    return 0
  }
  return Number(new Big(nvlNum(arg1)).div(nvlNum(arg2)))
}
// 乘法函数
export function accMul (arg1, arg2) {
  return Number(new Big(nvlNum(arg1)).mul(nvlNum(arg2)))
}
// 加法函数
export function accAdd (arg1, arg2) {
  return Number(new Big(nvlNum(arg1)).add(nvlNum(arg2)))
}
// 减法函数
export function accSubtr (arg1, arg2) {
  return Number(new Big(nvlNum(arg1)).sub(nvlNum(arg2)))
}
export function nvlNum (value) {
  if (isNaN(value) || value === undefined || value === '' || value === null) {
    return 0
  }
  return value
}

export function calculate (opt, num1, num2, power) {
  if (opt === 'add') {
    return accAdd(num1, num2).toFixed(power)
  } else if (opt === 'sub') {
    return accSubtr(num1, num2).toFixed(power)
  } else if (opt === 'mul') {
    return accMul(num1, num2).toFixed(power)
  } else if (opt === 'div') {
    if (num2 === 0 || nvlNum(num2) === 0) {
      return 0
    }
    return accDiv(num1, num2).toFixed(power)
  }
  return 0
}

export function formatChineseAmount (amount) {
  amount = Number(new Big(new Big(amount).toFixed(2)).mul(100))
  let numberCh = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  let symbol = ['分', '角', '元', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟']
  if (amount === 0) {
    return '零元整'
  }
  if (amount < 0) {
    amount = -amount
  }
  let isInt = amount % 100 === 0
  let amountString = amount.toString()
  let strLen = amountString.length
  let chineseAmount = ''
  let preZero = false
  for (let i = 0; i < strLen; i++) {
    let currentNumber = Number(amountString.charAt(i))
    let symbolIndex = strLen - 1 - i
    if (currentNumber === 0) {
      if (symbolIndex === 2 || (strLen < 11 && symbolIndex === 6) || symbolIndex === 11) {
        chineseAmount += symbol[symbolIndex]
        preZero = false
      } else {
        preZero = true
      }
    } else {
      if (preZero) {
        chineseAmount += numberCh[0]
        preZero = false
      }
      chineseAmount += numberCh[currentNumber] + symbol[symbolIndex]
    }
  }
  if (isInt) {
    chineseAmount += '整'
  }
  return chineseAmount
}

export function formatVoucherNumber (val) {
  if (val !== null && val !== undefined && val !== '') {
    val = parseInt(val)
    if (isNaN(val) || val <= 0) {
      val = '0001'
    } else if (val > 9999) {
      val = '9999'
    } else {
      val = String(val)
      val = val.length >= 4 ? val : new Array(4 - val.length + 1).join('0') + val
    }
  }
  return val
}
// 预警设置,期间类型
export function getIncomeWarningPeriodTypeName (type) {
  switch (type) {
    case 0:
      type = '月度'
      break
    case 1:
      type = '季度'
      break
    case 2:
      type = '年度'
      break
    default:
      type = '连续12月'
      break
  }
  return type
}
