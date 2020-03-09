<template>
  <div class="app-main">
    <Card v-if="cardShow" :tableHeight="tableHeight" :tableData="tableData" :data="formData"></Card>
    <List v-else></List>
  </div>
</template>

<script>
import List from './components/List'
import Card from './components/Card'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import * as IcbillManageConst from '../icbill-manage-const'
import refreshDataMixin from '@/mixins/refresh-data'
import routeParamMixin from '@/mixins/route-param'
export default {
  name: 'icbill-purchin',
  mixins: [refreshDataMixin, routeParamMixin],
  props: {
    routeParam: {
      type: Object,
      default: null
    }
  },
  components: {
    List,
    Card
  },
  data () {
    return {
      cardShow: false,
      editStatus: false,
      formData: {},
      queryData: {},
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      tableData: [],
      tableHeight: 280,
      fzData: [],
      chData: []
    }
  },

  watch: {
    routeParam: {
      handler (routeParam) {
        if (routeParam) {
          if (routeParam.id) {
            this.cardShow = true
            this.$api.InventoryManageApi.IcbillPurchin.editData({'id_ictrade_h': routeParam.id, 'ignoreCheck': 'Y'}).then(res => {
              if (routeParam.source === 'HP95') {
                if (res.data.pzh) {
                  this.editStatus = false
                } else {
                  this.editStatus = true
                }
              }
              this.formData = res.data
            })
          } else if (routeParam.rqq && routeParam.rqz) {
            this.queryData.dateType = '1'
            this.queryData.dateRange[0] = routeParam.rqq
            this.queryData.dateRange[1] = routeParam.rqz
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.fetchAuxiliaryArchive(AUXILIARY_CONST.AUXILIARY_TYPE.SUPPLIER)
    this.fetchCh()
  },
  methods: {
    chargedeptname () {
      return this.$store.getters.currentCorp.chname === '一般纳税人'
    },
    refreshData () {
      this.fetchAuxiliaryArchive(AUXILIARY_CONST.AUXILIARY_TYPE.CUSTOMER)
      this.fetchCh()
    },
    fetchAuxiliaryArchive (fzid) {
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: fzid
      }).then(res => {
        if (res.rows) {
          this.fzData = res.rows
        }
      })
    },
    fetchCh () {
      this.$api.InventoryManageApi.IcsetInventory.queryBParam({}).then(res => {
        if (res.rows) {
          this.chData = IcbillManageConst.invDataFullName(res.rows)
        }
      })
    },
    openCard (formData) {
      this.formateForm(formData)
      this.setTableHeight(formData)
    },
    formateForm (item) {
      item.iszg = item.iszg === '是' || item.iszg === true
      item.isczg = item.isczg === '是' || item.isczg === true
      item.isrz1 = item.isrz1 === '是' || item.isrz1 === true
      item.fp_style = item.fp_style ? item.fp_style + '' : ''
      item.cbusitype = item.cbusitype ? item.cbusitype : IcbillManageConst.purchInType[1].value
      item.iway = item.iway ? item.iway + '' : ''
      if (item.iszg) {
        item.zgname = '暂估'
      }
      if (item.isczg) {
        item.zgname = '冲销暂估'
      }
    },
    setTableHeight (formData) {
      if (formData.cbusitype) {
        let height = 0
        if (!this.editStatus) {
          height = 40
        }
        if (IcbillManageConst.purchInType[1].value !== formData.cbusitype) {
          this.tableHeight = window.innerHeight - 290 + height
        } else {
          this.tableHeight = window.innerHeight - 385 + height
        }
      }
    }
  }
}
</script>
<style scoped>
  >>>.el-input-number .el-input__inner {
    text-align: right;
  }
</style>
