<template>
  <div>
  <el-form
    ref="form"
    :model="queryFormData">
    <el-form-item label="期间" :label-width="labelWidth">
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="queryFormData.periodRange"
        type="monthrange"
        unlink-panels
        :clearable="false"
        range-separator="至"
        value-format="yyyy-MM"
        style="width: 250px">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="存货分类" :label-width="labelWidth">
      <el-select   v-model="queryFormData.xmlbid"
                   default-first-option placeholder="请选择存货分类" filterable @change="subjectChange" style= "width:250px">
        <el-option v-for="item in invenFlData" :key="item.invcls_id" :label="item.cd+' / '+item.nm" :value="item.invcls_id" :disabled="item.disabled" style="width:300px">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="存货档案" :label-width="labelWidth">
      <el-select   v-model="queryFormData.pk_inventory"
                   default-first-option placeholder="请选择存货" ref="invselect" @change="invchange"  filterable clearable style= "width:250px">
        <el-option v-for="item in chdata" :key="item.id" :label="item.spmc" :value="item.id" :disabled="item.disabled" style="width:300px">
          <span style="float: left;width:300px">{{ item.fullname }}</span>
        </el-option>
        <template slot="prefix">
          <i @click.stop="openInv" class="el-icon-search"></i>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item style="margin-top:10px;margin-left:85px">
      <el-checkbox v-model="queryFormData.ishowfs" >无发生期间不显示</el-checkbox>
    </el-form-item>
  </el-form>
  <InventoryDialog :visible.sync="dialogVisible" :queryData="queryData" single-select select-first @selected="handleInvSelect"></InventoryDialog>
  </div>
</template>

<script>
import * as IcbillManageConst from '../../icbill-manage-const'
import InventoryDialog from '@/components/reference/InventoryRefDialog'
import refreshDataMixin from '@/mixins/refresh-data'
import { orderBy } from 'natural-orderby'
export default {
  name: 'QueryParam',
  mixins: [refreshDataMixin],
  components: {
    InventoryDialog
  },
  data () {
    let param = this.getDefaultParamData()
    return {
      queryFormData: param,
      invenData: [],
      invenFlData: [],
      labelWidth: '85px',
      pickerOptions: this.datePicker(),
      dialogVisible: false
    }
  },
  computed: {
    chdata () {
      let ch = []
      for (const data of this.invenData) {
        if (data) {
          if (!this.queryFormData.xmlbid) {
            ch.push(data)
          } else if (this.queryFormData.xmlbid === 'all') {
            ch.push(data)
          } else if (this.queryFormData.xmlbid === 'noclass') {
            if (!data.splxid) {
              ch.push(data)
            }
          } else {
            if (this.queryFormData.xmlbid === data.splxid) {
              ch.push(data)
            }
          }
        }
      }
      return ch
    },
    queryData: {
      get () {
        return {isshow: 'N', pk_invclassify: this.queryFormData.xmlbid}
      }
    }
  },
  mounted () {
    this.fetchCh()
    this.fetchSpfl()
  },
  methods: {
    refreshData () {
      this.fetchCh()
      this.fetchSpfl()
    },
    getQueryParam () {
      let param = { ...this.queryFormData }
      delete param.corpName
      delete param.periodRange
      param.begindate = this.queryFormData.periodRange[0] + '-01'
      param.enddate = this.queryFormData.periodRange[1] + '-01'
      param.beginPeriod = this.queryFormData.periodRange[0]
      param.endPeriod = this.queryFormData.periodRange[1]
      param.startYear = this.queryFormData.periodRange[0].substring(0, 4)
      param.startMonth = this.queryFormData.periodRange[0].substring(5, 7)
      param.endYear = this.queryFormData.periodRange[1].substring(0, 4)
      param.endMonth = this.queryFormData.periodRange[1].substring(5, 7)
      param.currsp = 'all'
      return param
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.queryFormData = this.getDefaultParamData()
    },
    getDefaultParamData () {
      let loginDate = this.$store.getters.getLoginDate
      let loginPeriod = loginDate.substring(0, 7)
      return {
        periodRange: [loginPeriod, loginPeriod],
        xmlbid: 'all',
        pk_inventory: ''
      }
    },
    subjectChange: function (param) {
      this.queryFormData.pk_inventory = ''
    },
    fetchCh () {
      this.$api.InventoryManageApi.IcsetInventory.queryBParam({}).then(res => {
        if (res.rows) {
          this.invenData = IcbillManageConst.invDataFullName(res.rows)
        }
      })
    },
    datePicker () {
      const self = this
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.$store.getters.currentCorp.bdate
          return period < jzDate.substring(0, 7)
        }
      }
    },
    fetchSpfl () {
      this.$api.InventoryManageApi.IcsetClassfy.queryInv({}).then(res => {
        if (res.success) {
          this.invenFlData = []
          this.invenFlData.push({invcls_id: 'all', cd: '全部', nm: '全部'})
          this.invenFlData.push({invcls_id: 'noclass', cd: '无分类', nm: '无分类'})
          const rows = orderBy(res.rows, v => v.cd)
          for (let item of rows) {
            this.invenFlData.push(item)
          }
        } else {
          this.invenFlData = []
          this.invenFlData.push({invcls_id: 'all', cd: '全部', nm: '全部'})
        }
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
