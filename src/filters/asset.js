// set function parseTime,formatTime to filter
// export { parseTime, formatTime } from '../libs/utils'
import {ZJ_TYPE, ASSET_PROP, SUBJECT_PROP} from '@/constants/asset'
const assetMixin = {
  filters: {
    formatZjfs: function (val) {
      for (const t of ZJ_TYPE) {
        if (t.value === val) {
          return t.label
        }
      }
    },
    formatZcSx: function (val) {
      for (const t of ASSET_PROP) {
        if (t.value === val) {
          return t.label
        }
      }
      // return '全部'
      return ''
    },
    formatKmsx: function (val) {
      for (const t of SUBJECT_PROP) {
        if (t.value === val) {
          return t.label
        }
      }
    }
  },
  methods: {
    getZcsxName (val) {
      for (const t of ASSET_PROP) {
        if (t.value === val || (t.value + '' === val)) {
          return t.label
        }
      }
      return ''
    }
  }
}
export default assetMixin
