// 总账
import {getSubjectRef} from '@/api/models/basic-setting/subject'
import {getType as getAuxiliaryType} from '@/api/models/basic-setting/auxiliary'
import {getSubjectCurrency} from '@/api/models/basic-setting/currency'
import cashFlowApi from '@/api/models/basic-setting/xjll-qc'

const state = {
  // 科目参照数据
  subjectRefData: [],
  // 辅助核算类别
  auxiliaryTypes: [],
  // 科目外币
  subjectCurrency: [],
  currentCodeRule: '',
  cashFlowArchive: null,
  auxiliaryArchiveCacheStatus: {}
}

const getters = {
  // 所有参照用科目
  subjectRef: state => {
    return state.subjectRefData.filter(subj => subj.fc === '否')
  },
  // 所有参照用末级科目
  subSubjectRef: (state, getters) => {
    return getters.subjectRef.filter(subj => subj.yz === '是')
  },
  // 科目map
  subjectMap: (state) => {
    let map = new Map()
    state.subjectRefData.forEach(subject => map.set(subject.id, subject))
    return map
  },
  // 银行科目
  bankSubject: (state, getters) => {
    return state.subjectRefData.filter(subj => subj.yz === '是' && subj.kmbm.startsWith('1002'))
  },
  auxiliaryTypes: state => {
    return state.auxiliaryTypes
  },
  cashFlowArchive: state => {
    return state.cashFlowArchive
  }
}

const actions = {
  fetchSubjectRefData ({commit}) {
    return new Promise((resolve) => {
      getSubjectRef().then(result => {
        if (result.success) {
          commit('setSubjectRefData', result.rows)
          resolve(result.rows)
        }
      })
    })
  },
  fetchAuxiliaryType ({commit}) {
    getAuxiliaryType({
      isfull: 'Y',
      unjl: 'Y'
    }).then(result => {
      if (result.success) {
        commit('setAuxiliaryType', result.rows)
      }
    })
  },
  fetchSubjectCurrency ({commit}) {
    getSubjectCurrency().then(result => {
      if (result.success) {
        commit('setSubjectCurrency', result.rows)
      }
    })
  },
  fetchCashFlowArchive ({commit, state}) {
    if (state.cashFlowArchive === null) {
      cashFlowApi.qryPrjInv().then(res => {
        if (res.success) {
          commit('setCashFlowArchive', res.rows)
        }
      })
    }
  }
}

const mutations = {
  setSubjectRefData (state, data) {
    state.subjectRefData = data
  },
  setCurrentCodeRule (state, codeRule) {
    state.currentCodeRule = codeRule
  },
  setAuxiliaryType (state, data) {
    state.auxiliaryTypes = data
  },
  setSubjectCurrency (state, data) {
    state.subjectCurrency = data
  },
  setCashFlowArchive (state, data) {
    state.cashFlowArchive = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
