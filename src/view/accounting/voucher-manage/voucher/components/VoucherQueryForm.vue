<template>
  <div>
    <el-form
      ref="form"
      :model="queryFormData"
      style="width: 426px">
      <el-form-item label="日期：" :label-width="labelWidth">
        <el-date-picker
          v-model="queryFormData.dateRange"
          type="daterange"
          :clearable="false"
          @change="queryFormData.dateType = '1'"
          range-separator="至"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          unlink-panels
          style="width: 315px">
        </el-date-picker>
        <template #label>
          <el-radio v-model="queryFormData.dateType" label="1">日期：</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="期间：" :label-width="labelWidth">
        <el-date-picker
          v-model="queryFormData.periodRange"
          type="monthrange"
          :clearable="false"
          @change="queryFormData.dateType = '2'"
          range-separator="至"
          value-format="yyyy-MM"
          :picker-options="monthPickerOptions"
          unlink-panels
          style="width: 315px">
        </el-date-picker>
        <template #label>
          <el-radio v-model="queryFormData.dateType" label="2">期间：</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="凭证号：" :label-width="labelWidth">
        <el-input v-model="queryFormData.pzh" @blur="formatVoucherNumber('pzh')" style="width: 150px"></el-input>
        <label>-</label>
        <el-input v-model="queryFormData.pzh2" @blur="formatVoucherNumber('pzh2')" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="状态：" :label-width="labelWidth">
        <el-select
          v-model="queryFormData.pz_status"
          filterable
          style="width: 130px">
          <el-option
            v-for="item in statusRef"
            :key="item.value"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
        <label style="margin-left: 10px;">科目</label>
        <el-select
          v-model="queryFormData.vname"
          filterable
          clearable
          style="width: 140px">
          <el-option
            v-for="item in subjectRef"
            :key="item.id"
            :value="item.kmbm"
            :label="item.codename">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="辅助类别：" :label-width="labelWidth">
        <el-select
          v-model="queryFormData.fzhslb"
          clearable
          style="width: 315px">
          <el-option
            v-for="item in auxiliaryTypes"
            :key="item.id"
            :value="item.code"
            :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="辅助项目：" :label-width="labelWidth">
        <el-select
          v-model="queryFormData.fzhsxm"
          clearable
          filterable
          style="width: 315px">
          <el-option
            v-for="item in auxiliaryArchiveRef"
            :key="item.id"
            :value="item.id"
            :label="item.code ? item.code + '_' + item.name : item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额：" :label-width="labelWidth">
        <el-input-number
          v-model="queryFormData.mny1"
          :precision="2" :controls="false" style="width: 150px"></el-input-number>
        <label>-</label>
        <el-input-number
          v-model="queryFormData.mny2"
          :precision="2" :controls="false" style="width: 150px"></el-input-number>
      </el-form-item>
      <el-form-item label="" :label-width="labelWidth">
        <el-checkbox
          label="现金流量有误凭证"
          v-model="queryFormData.is_error_cash"
          style="width: 120px"></el-checkbox>
        <el-checkbox
          label="申报表税项有误凭证"
          v-model="queryFormData.is_error_tax"></el-checkbox>
      </el-form-item>
      <el-form-item label="公司：" :label-width="labelWidth">
        <el-input
          v-model="queryFormData.corpName"
          :readonly="true" style="width: 315px;">
          <template #suffix>
            <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="dialogVisible = true"></i>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <CorpDialog
      :visible.sync="dialogVisible"
      @selected="handleCorpSelect"></CorpDialog>
  </div>
</template>

<script>
import { getMonthBegin, getMonthEnd, formatVoucherNumber } from '@/utils'
import CorpDialog from '@/components/reference/CorpDialog'
import datePickerMixin from '@/mixins/date-picker'

export default {
  name: 'VoucherQueryForm',
  mixins: [datePickerMixin],
  props: {
    periodRange: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      queryFormData: this.getDefaultParamData(),
      labelWidth: '85px',
      dialogVisible: false,
      statusRef: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '暂存态',
          value: -1
        },
        {
          label: '未审核',
          value: 8
        },
        {
          label: '已审核',
          value: 1
        },
        {
          label: '未记账',
          value: 11
        },
        {
          label: '已记账',
          value: 12
        }
      ],
      auxiliaryArchiveData: {}
    }
  },
  computed: {
    auxiliaryTypes () {
      let data = [{
        id: null,
        code: null,
        name: '全部'
      }]
      return data.concat(this.$store.state.accounting.auxiliaryTypes)
    },
    subjectRef () {
      return this.$store.getters.subjectRef
    },
    auxiliaryArchiveRef () {
      const type = this.queryFormData.fzhslb
      let data = []
      if (data && this.auxiliaryArchiveData[type]) {
        data.push({
          id: null,
          code: '',
          name: '全部'
        })
        data = data.concat(this.auxiliaryArchiveData[type])
      }
      return data
    }
  },
  watch: {
    'queryFormData.fzhslb' (val) {
      if (val) {
        if (this.auxiliaryArchiveData[val] === undefined) {
          this.fetchAuxiliaryArchive(val)
        }
      }
      this.queryFormData.fzhsxm = null
    },
    periodRange () {
      this.queryFormData.periodRange = this.periodRange
      this.queryFormData.dateType = '2'
    }
  },
  components: {
    CorpDialog
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
        param.beginPeriod = this.queryFormData.periodRange[0]
        param.endPeriod = this.queryFormData.periodRange[1]
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
        dateType: '2',
        pz_status: 0,
        is_error_cash: false,
        is_error_tax: false,
        fzhslb: null,
        fzhsxm: null
      }
    },
    fetchAuxiliaryArchive (type) {
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: this.auxiliaryTypes.find(item => item.code === type).id
      }).then(res => {
        if (res.rows) {
          this.$set(this.auxiliaryArchiveData, type, res.rows)
        } else {
          this.$set(this.auxiliaryArchiveData, type, null)
        }
      })
    },
    formatVoucherNumber (field) {
      let val = this.queryFormData[field]
      this.queryFormData[field] = formatVoucherNumber(val)
    },
    handleCorpSelect (corps) {
      let corpNames = []
      let corpIds = []
      corps.forEach(corp => {
        corpNames.push(corp.uname)
        corpIds.push(corp.pk_gs)
      })
      this.queryFormData.corpName = corpNames.join(',')
      this.queryFormData.pk_corp = corpIds.join(',')
    }
  }
}
</script>

<style scoped>

</style>
