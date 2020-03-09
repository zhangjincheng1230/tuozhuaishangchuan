<template>
  <div>
    <el-form ref="form" :model="queryFormData"  :label-width="labelWidth">
      <el-form-item label="期间">
        <el-date-picker
          v-model="queryFormData.periodRange"
          type="monthrange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          value-format="yyyy-MM"
          :picker-options="pickerOptions"
          :clearable = "false"
          style="width: 250px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="存货类别" v-if="showDetail">
        <el-select
          v-model="queryFormData.xmlbid"
          :clearable = "true"
          filterable
          default-first-option
          style="width: 250px">
          <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id"  :disabled="item.disabled" style="width: 250px">
            <span style="float: left">{{ item.codefullname }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存货档案">
        <el-select
          v-model="queryFormData.pk_inventory"
          :clearable = "true"
          filterable
          default-first-option
          ref="invselect"
          style="width: 250px">
          <el-option v-for="item in chdata" :key="item.id" :label="item.fullname" :value="item.id" style="width: 250px">
          </el-option>
          <template slot="prefix">
            <i @click.stop="openInv" class="el-icon-search"></i>
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <FzhsInvenDialog :visible.sync="dialogVisible" :queryData="queryData" single-select select-first @selected="handleInvSelect"></FzhsInvenDialog>
  </div>
</template>

<script>
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import FzhsInvenDialog from '@/components/reference/FzhsInvenDialog'
import { getMonthEnd } from '@/utils'
import * as InventoryManageConst from '../../general-inventory-const'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
export default {
  name: 'QueryParam',
  mixins: [refreshDataMixin, MessageUtil],
  props: {
    isDetailjz: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FzhsInvenDialog
  },
  data () {
    let param = this.getDefaultParamData()
    return {
      queryFormData: param,
      labelWidth: '85px',
      pickerOptions: this.datePicker(),
      invdata: [],
      qcdate: '',
      kmclassdata: [],
      dialogVisible: false
    }
  },
  computed: {
    showDetail: {
      get () {
        return this.isDetailjz
        // return true
      },
      set () {
        this.$emit('update:isDetailjz', false)
      }
    },
    kmdata () {
      const kmRefData = this.$store.state.accounting.subjectRefData
      for (const data of kmRefData) {
        if (data) {
          if (data.yz !== '是') {
            data.disabled = true
          } else {
            data.disabled = false
          }
        }
      }
      return kmRefData.filter(item => this.kmclassdata.includes(item.kmbm))
    },
    chdata () {
      let ch = []
      for (const data of this.invdata) {
        if (data) {
          if (!this.queryFormData.xmlbid) {
            ch.push(data)
          } else {
            if (this.queryFormData.xmlbid === data.kmclassify) {
              ch.push(data)
            }
          }
        }
      }
      return ch
    },
    queryData: {
      get () {
        return {isshow: this.showDetail, kmid: this.queryFormData.xmlbid}
      }
    }
  },
  mounted () {
    this.getInvData()
    this.kmclassifydata()
    this.getQcDate()
  },
  watch: {
    'queryFormData.xmlbid' (val) {
      this.queryFormData.pk_inventory = ''
    }
  },
  methods: {
    refreshData () {
      this.getInvData()
    },
    getQueryParam () {
      const queryParam = {}
      queryParam.begindate = this.queryFormData.periodRange[0] + '-01'
      queryParam.enddate = getMonthEnd(this.queryFormData.periodRange[1] + '-01')
      queryParam.beginPeriod = this.queryFormData.periodRange[0]
      queryParam.endPeriod = this.queryFormData.periodRange[1]
      queryParam.pk_inventory = this.queryFormData.pk_inventory
      queryParam.xmlbid = this.queryFormData.xmlbid
      queryParam.currsp = 'all'
      return queryParam
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.queryFormData = this.getDefaultParamData()
    },
    getDefaultParamData () {
      let loginDate = this.$store.getters.getLoginDate
      let loginPeriod = loginDate.substring(0, 7)
      if (this.qcdate) {
        loginPeriod = this.qcdate.substring(0, 7)
      }
      return {
        periodRange: [loginPeriod, loginPeriod],
        xmlbid: '',
        pk_inventory: ''
      }
    },
    kmclassifydata () {
      this.$api.GeneralInventoryApi.InventoryDoc.getKmclassify().then(result => {
        if (result.success) {
          this.kmclassdata = result.rows
        }
      }).catch(e => {
      })
      return null
    },
    datePicker () {
      const self = this
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.qcdate
          if (jzDate) {
            return period < jzDate.substring(0, 7)
          } else {
            return false
          }
        }
      }
    },
    query () {
      this.$emit('query')
    },
    getQcDate () {
      this.$api.GeneralInventoryApi.InventoryInit.getQcDate({'unjl': 'Y'}).then(result => {
        if (result.success) {
          this.qcdate = result.data
          if (this.qcdate) {
            if (this.$store.getters.getLoginDate < this.qcdate) {
              this.queryFormData.periodRange = [this.qcdate.substring(0, 7), this.qcdate.substring(0, 7)]
            }
          }
          this.query()
        }
      }).catch(e => {
      })
    },
    getInvData () {
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            this.invdata = InventoryManageConst.invDataFullName(result.rows)
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    openInv () {
      this.$refs.invselect.handleClose()
      this.dialogVisible = true
    },
    handleInvSelect (invData) {
      this.queryFormData.pk_inventory = invData.id
    },
    invchange (value) {
      this.queryFormData.pk_inventory = value
    }
  }
}
</script>

<style scoped>

</style>
