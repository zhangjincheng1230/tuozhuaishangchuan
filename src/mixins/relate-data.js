/**
 * 失活状态监听关联数据的变化, 激活时刷新页面数据
 * 默认监听凭证、期末处理变化、公司信息
 * 需设置刷新方法, 默认刷新方法为reFetchData
 */
import {RELATE_DATE_TYPE} from '@/constants'

export default {
  data () {
    return {
      // 监听数据类型
      relateDataType: [RELATE_DATE_TYPE.voucher, RELATE_DATE_TYPE.period_close, RELATE_DATE_TYPE.companyinfo],
      // 刷新数据方法
      reFetchMethod: 'reFetchData',
      registeredRelateDataType: [],
      needReFetchData: false,
      hasReFetchMethod: false
    }
  },
  computed: {},
  methods: {
    watchRelateData () {
      if (this._inactive === true) {
        this.needReFetchData = true
      }
    }
  },
  created () {
    let reFetchMethod = this[this.reFetchMethod]
    if (typeof reFetchMethod === 'function') {
      this.hasReFetchMethod = true
      this.relateDataType.forEach(type => {
        this.$bus.on(type, this.watchRelateData)
        this.registeredRelateDataType.push(type)
      })
    }
  },
  activated () {
    if (this.needReFetchData && this.hasReFetchMethod) {
      this[this.reFetchMethod].apply(this)
      this.needReFetchData = false
    }
  },
  beforeDestroy () {
    this.registeredRelateDataType.forEach(data => {
      this.$bus.off(data, this.watchRelateData)
    })
  }
}
