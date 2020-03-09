<template>
  <div>
  <el-form
    ref="form"
    :model="queryFormData">
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
        style="width: 250px">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="存货" :label-width="labelWidth">
      <el-select   v-model="queryFormData.pk_inventory"
                   default-first-option placeholder="请选择存货" clearable filterable ref="invselect" @change="invchange" style= "width:250px">
        <el-option v-for="item in invenData" :key="item.id" :label="item.spmc" :value="item.id" :disabled="item.disabled" style="width:300px">
          <span style="float: left;width:300px">{{ item.fullname }}</span>
        </el-option>
        <template slot="prefix">
          <i @click.stop="openInv" class="el-icon-search"></i>
        </template>
      </el-select>
    </el-form-item>
  </el-form>
  <InventoryDialog :visible.sync="dialogVisible" :queryData="queryData" single-select select-first @selected="handleInvSelect"></InventoryDialog>
  </div>
</template>

<script>
import { getMonthBegin, getMonthEnd } from '@/utils'
import InventoryDialog from '@/components/reference/InventoryRefDialog'
import * as IcbillManageConst from '../../icbill-manage-const'
import refreshDataMixin from '@/mixins/refresh-data'
export default {
  name: 'QueryForm',
  mixins: [refreshDataMixin],
  components: {
    InventoryDialog
  },
  data () {
    let param = this.getDefaultParamData()
    return {
      queryFormData: param,
      invenData: [],
      labelWidth: '85px',
      pickerOptions: this.datePicker(),
      dialogVisible: false
    }
  },
  computed: {
    queryData: {
      get () {
        return {isshow: 'N'}
      }
    }
  },
  mounted () {
    this.fetchCh()
  },
  methods: {
    refreshData () {
      this.fetchCh()
    },
    getQueryParam () {
      let param = { ...this.queryFormData }
      delete param.dateRange
      delete param.corpName
      if (this.queryFormData.dateRange === null) {
        this.$message.warning('请选择日期')
        return false
      }
      param.begindate = this.queryFormData.dateRange[0]
      param.enddate = this.queryFormData.dateRange[1]
      return param
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.queryFormData = this.getDefaultParamData()
    },
    getDefaultParamData () {
      let loginDate = this.$store.getters.getLoginDate
      return {
        dateRange: [getMonthBegin(loginDate), getMonthEnd(loginDate)],
        pk_inventory: ''
      }
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
