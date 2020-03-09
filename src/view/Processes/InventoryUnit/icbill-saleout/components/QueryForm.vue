<template>
  <div>
    <el-form
      ref="form"
      :model="queryFormData"
      style="width: 426px">
      <el-form-item label="日期" :label-width="labelWidth">
        <el-date-picker
          :picker-options="pickerOptions"
          v-model="queryFormData.dateRange"
          type="daterange"
          unlink-panels
          :clearable="false"
          @change="queryFormData.dateType = '1'"
          range-separator="至"
          value-format="yyyy-MM-dd"
          style="width: 315px">
        </el-date-picker>
        <template #label>
          <el-radio v-model="queryFormData.dateType" label="1">日期</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="期间" :label-width="labelWidth">
        <el-date-picker
          :picker-options="pickerOptions"
          v-model="queryFormData.periodRange"
          type="monthrange"
          unlink-panels
          :clearable="false"
          @change="queryFormData.dateType = '2'"
          range-separator="至"
          value-format="yyyy-MM"
          style="width: 315px">
        </el-date-picker>
        <template #label>
          <el-radio v-model="queryFormData.dateType" label="2">期间</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="出库类型" :label-width="labelWidth">
        <el-select v-model="queryFormData.cbusitype" filterable style="width: 150px">
          <el-option  v-for="item in cbusitypedata" :key="item.label"  :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单据号" :label-width="labelWidth">
        <el-input v-model="queryFormData.djh1" style="width: 150px"></el-input>
        <label>-</label>
        <el-input v-model="queryFormData.djh2" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="客户" :label-width="labelWidth">
        <el-select   v-model="queryFormData.qcorpid"
                     default-first-option placeholder="请选择客户" clearable filterable style= "width:314px">
          <el-option v-for="item in fzData" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id" style="width:300px">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存货" :label-width="labelWidth">
        <el-select   v-model="queryFormData.qinvid"
                     default-first-option placeholder="请选择存货" ref="invselect" @change="invchange" clearable filterable style= "width:314px">
          <el-option v-for="item in invenData" :key="item.id" :label="item.spmc" :value="item.id" :disabled="item.disabled" style="width:300px">
            <span style="float: left;width:300px">{{ item.fullname }}</span>
          </el-option>
          <template slot="prefix">
            <i @click.stop="openInv" class="el-icon-search"></i>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" :label-width="labelWidth">
        <el-input-number  v-model="queryFormData.mny1" :precision="2" :controls="false" style="width: 150px"></el-input-number>
        <label>-</label>
        <el-input-number  v-model="queryFormData.mny2" :precision="2" :controls="false" style="width: 150px"></el-input-number>
      </el-form-item>
    </el-form>
    <InventoryDialog :visible.sync="dialogVisible" :queryData="queryData" single-select select-first @selected="handleInvSelect"></InventoryDialog>
  </div>
</template>

<script>
import { getMonthBegin, getMonthEnd } from '@/utils'
import InventoryDialog from '@/components/reference/InventoryRefDialog'
import * as IcbillManageConst from '../../icbill-manage-const'

export default {
  name: 'QueryForm',
  components: {
    InventoryDialog
  },
  props: {
    formData: {
      type: Object,
      default: null
    }
  },
  data () {
    let param
    if (this.formData === null) {
      param = this.getDefaultParamData()
    } else {
      param = { ...this.formData }
    }
    return {
      queryFormData: param,
      dialogVisible: false,
      labelWidth: '85px',
      cbusitypedata: IcbillManageConst.saleOutType,
      pickerOptions: this.datePicker()
    }
  },
  computed: {
    queryData: {
      get () {
        return {isshow: 'N'}
      }
    },
    invenData () {
      return this.$parent.$parent.$parent.chData
    },
    fzData () {
      return this.$parent.$parent.$parent.fzData
    }
  },
  mounted () {
  },
  methods: {
    getQueryParam () {
      let param = { ...this.queryFormData }
      delete param.dateRange
      delete param.periodRange
      delete param.corpName
      if (this.queryFormData.dateType === '1') {
        if (this.queryFormData.dateRange === null) {
          this.$message.warning('请选择日期')
          return false
        }
        param.begindate = this.queryFormData.dateRange[0]
        param.enddate = this.queryFormData.dateRange[1]
      } else {
        if (this.queryFormData.periodRange === null) {
          this.$message.warning('请选择期间')
          return false
        }
        param.begindate = null
        param.enddate = null
        param.beginPeriod = this.queryFormData.periodRange[0]
        param.endPeriod = this.queryFormData.periodRange[1]
        param.startYear = this.queryFormData.periodRange[0].substring(0, 4)
        param.startMonth = this.queryFormData.periodRange[0].substring(5, 7)
        param.endYear = this.queryFormData.periodRange[1].substring(0, 4)
        param.endMonth = this.queryFormData.periodRange[1].substring(5, 7)
      }
      return param
    },
    loadQueryParam (param) {
      if (param.begindate && param.enddate) {
        param.dateRange = [ param.begindate, param.enddate ]
        param.dateType = '1'
      } else if (param.beginPeriod && param.endPeriod) {
        param.periodRange = [ param.beginPeriod, param.endPeriod ]
        param.dateType = '2'
      }
      let defaultParam = this.getDefaultParamData()
      Object.assign(defaultParam, param)
      this.queryFormData = defaultParam
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.queryFormData = this.getDefaultParamData()
    },
    getDefaultParamData () {
      let loginDate = this.$store.getters.getLoginDate
      let loginPeriod = loginDate.substring(0, 7)
      return {
        dateRange: [getMonthBegin(loginDate), getMonthEnd(loginDate)],
        periodRange: [loginPeriod, loginPeriod],
        dateType: '1',
        iszg: '',
        qinvid: '',
        cbusitype: ''
      }
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
    openInv () {
      this.$refs.invselect.handleClose()
      this.dialogVisible = true
    },
    handleInvSelect (invData) {
      this.queryFormData.qinvid = invData.id
    },
    invchange (value) {
      this.queryFormData.qinvid = value
    }
  }
}
</script>

<style scoped>

</style>
