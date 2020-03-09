import {REFRESH_DATA} from '@/constants'
export default {
  data () {
    return {
      reFetchMethod: REFRESH_DATA.refreshData
    }
  },
  computed: {},
  methods: {
    reLoadData () {
      // if (this._inactive === true) {
      let reFetchMethod = this[this.reFetchMethod]
      if (typeof reFetchMethod === 'function') {
        this[this.reFetchMethod].apply(this)
      }
    }
    // }
  },
  created () {
    this.$bus.on(REFRESH_DATA.refreshData, this.reLoadData)
  },
  beforeDestroy () {
    this.$bus.off(REFRESH_DATA.refreshData, this.reLoadData)
  }
}
