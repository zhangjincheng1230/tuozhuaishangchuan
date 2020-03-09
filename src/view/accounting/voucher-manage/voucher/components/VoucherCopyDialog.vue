<template>
  <el-dialog title="复制"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             v-loading="loading"
             :element-loading-text="loadingText"
             :element-loading-spinner="loadingSpinner"
             @open="onDialogOpen"
             width="450px">
    <el-form ref="formRef" label-width="auto">
      <el-form-item label="复制期间" v-if="vouchers === null">
        <el-date-picker
          v-model="sourcePeriod"
          :clearable="false"
          type="month"
          value-format="yyyy-MM"
          :picker-options="monthPickerOptions"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="目标期间">
        <el-date-picker
          v-model="targetPeriod"
          @change="onTargetPeriodChange"
          :clearable="false"
          type="month"
          value-format="yyyy-MM"
          :picker-options="monthPickerOptions"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="目标凭证日期取值">
      </el-form-item>
      <div>
        <el-radio v-model="targetDateType" label="1">对应日期</el-radio>
        <el-radio v-model="targetDateType" label="2">指定日期</el-radio>
        <el-date-picker
          v-model="targetDate"
          :clearable="false"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          style="width: 150px;">
        </el-date-picker>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="copyVoucher">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getNextPeriod, getMonthEnd } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
import loadingMixin from '@/mixins/loading'

export default {
  name: 'VoucherCopyDialog',
  mixins: [datePickerMixin, loadingMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vouchers: {
      type: Array,
      default: null
    },
    period: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      sourcePeriod: '',
      targetPeriod: '',
      targetDate: '',
      targetDateType: '1',
      rules: {}
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    }
  },
  created () {
  },
  methods: {
    onDialogOpen () {
      this.sourcePeriod = this.period
      this.targetPeriod = getNextPeriod(this.period)
      this.onTargetPeriodChange(this.targetPeriod)
    },
    copyVoucher () {
      let param = {
        targetPeriod: this.targetPeriod
      }
      if (this.targetDateType === '2') {
        param.targetDate = this.targetDate
      }
      if (this.vouchers !== null) {
        param.sourceVoucher = this.vouchers
      } else {
        param.sourcePeriod = this.sourcePeriod
      }
      this.doCopyVoucher(param)
    },
    doCopyVoucher (param) {
      this.showLoading('复制中...')
      this.$api.Voucher.copy(param).then(res => {
        this.closeLoading()
        if (res.status === -150) {
          this.$confirm('损益结转已完成，复制后请重新结转损益！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            param.force = 'Y'
            this.doCopyVoucher(param)
          })
        } else if (res.success) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: res.msg.indexOf('复制失败') > -1 ? 'warning' : 'success',
            dangerouslyUseHTMLString: true
          })
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    onTargetPeriodChange (period) {
      this.targetDate = getMonthEnd(period)
    }
  }
}
</script>
<style scoped>
  >>> .el-radio {
    margin-right: 15px;
  }
</style>
