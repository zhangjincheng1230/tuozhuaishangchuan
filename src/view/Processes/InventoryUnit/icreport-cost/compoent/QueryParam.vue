<template>
  <div>
  <el-form
    ref="form"
    :model="queryFormData">
    <el-form-item label="截止日期" :label-width="labelWidth">
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="queryFormData.djrqa"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        style="width: 250px"
        :clearable = "false" >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="科目" :label-width="labelWidth">
      <el-select v-model="queryFormData.kmmc" placeholder="请选择" @change="subjectChange" style="width: 250px">
        <el-option label="全部" value=""></el-option>
        <el-option label="原材料" value="原材料"></el-option>
        <el-option label="库存商品" value="库存商品"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="存货档案" :label-width="labelWidth">
      <el-select   v-model="queryFormData.spid"
                   default-first-option placeholder="请选择存货"  ref="invselect" @change="invchange" clearable filterable style= "width:250px">
        <el-option v-for="item in chdata" :key="item.id" :label="item.spmc" :value="item.id" :disabled="item.disabled" style="width:300px">
          <span style="float: left;width:300px">{{ item.fullname }}</span>
        </el-option>
        <template slot="prefix">
          <i @click.stop="openInv" class="el-icon-search"></i>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item style="margin-top:10px;margin-left:85px;">
      <el-checkbox v-model="queryFormData.xsyye">仅显示有余额</el-checkbox>
    </el-form-item>
  </el-form>
  <InventoryDialog :visible.sync="dialogVisible" :queryData="queryData" single-select select-first @selected="handleInvSelect"></InventoryDialog>
  </div>
</template>

<script>
import * as IcbillManageConst from '../../icbill-manage-const'
import InventoryDialog from '@/components/reference/InventoryRefDialog'
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
    chdata () {
      let ch = []
      for (const data of this.invenData) {
        if (data) {
          if (!this.queryFormData.kmmc) {
            ch.push(data)
          } else {
            if (this.queryFormData.kmmc === data.kmmc) {
              ch.push(data)
            }
          }
        }
      }
      return ch
    },
    queryData: {
      get () {
        return {isshow: 'N', kmmc: this.queryFormData.kmmc}
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
      delete param.corpName
      return param
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.queryFormData = this.getDefaultParamData()
    },
    getDefaultParamData () {
      let loginDate = this.$store.getters.getLoginDate
      return {
        djrqa: loginDate,
        kmmc: '',
        spid: '',
        xsyye: false
      }
    },
    subjectChange: function (param) {
      this.queryFormData.spid = ''
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
      this.queryFormData.spid = invData.id
    },
    invchange (value) {
      this.queryFormData.spid = value
    }
  }
}
</script>

<style scoped>

</style>
