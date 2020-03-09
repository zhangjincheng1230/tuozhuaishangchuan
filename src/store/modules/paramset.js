// 参数十设置
import {query} from '@/api/models/basic-setting/param-setting'

const state = {
  // 参数设置数组
  paramsSetData: []
}

const getters = {
  paramSettingMap: state => {
    let map = new Map()
    state.paramsSetData.forEach(data => map.set(data.pbm, data))
    return map
  },
  // 单价精度
  pricePre: state => {
    const pvo = state.paramsSetData.filter(param => param.pbm === 'dzf010')
    return getParamValue(pvo)
  },
  // 数量精度
  numPre: state => {
    const pvo = state.paramsSetData.filter(param => param.pbm === 'dzf009')
    return getParamValue(pvo)
  },
  // 汇率精度
  huilvPre: state => {
    const pvo = state.paramsSetData.filter(param => param.pbm === 'dzf011')
    return getParamValue(pvo)
  },
  // 凭证摘要显示模板
  showTemplateInAbstract: state => {
    const pvo = state.paramsSetData.find(param => param.pbm === 'dzf002')
    return pvo && pvo.pdvalue === 0
  }
}

function getParamValue (pvo) {
  let value = 4
  if (pvo) {
    if (pvo[0]) {
      const arr = pvo[0].pvalue ? pvo[0].pvalue.split(';') : []
      if (arr && arr.length > 0 && pvo[0].pdvalue) {
        value = parseInt(arr[pvo[0].pdvalue])
      }
    }
  }
  return value
}

const actions = {
  fetchParamSet ({commit}) {
    query().then(result => {
      if (result.success) {
        commit('setParamsSetData', result.rows)
      }
    })
  }
}

const mutations = {
  setParamsSetData (state, data) {
    state.paramsSetData = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
