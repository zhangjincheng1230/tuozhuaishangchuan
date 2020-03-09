<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="400px">
    <el-form ref="formRef" :model="formDialogData"  :rules="rules" label-width="160px">
      <el-form-item  label="起始期间" prop="from">
      <el-date-picker style="width:125px" v-model="formDialogData.from" type="month"
                      value-format="yyyy-MM" placeholder="选择期间" :picker-options="datePicker()" :editable="false" :clearable="false" ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-top:30px"  label="截止期间" prop="to">
        <el-date-picker style="width:125px" v-model="formDialogData.to" type="month"
                        value-format="yyyy-MM" placeholder="选择期间" :picker-options="datePicker()" :editable="false" :clearable="false"></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size ="small" @click="dialogSave">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'CopyPeroidDialog',
  mixins: [MessageUtil, Loading],
  props: ['visible', 'title', 'data'],
  data () {
    return {
      rules: {
        from: [{ required: true, message: '请录入起始期间', trigger: 'blur' }],
        to: [{ required: true, message: '请录入截止期间', trigger: 'blur' }]
      },
      formDialogData: {}
    }
  },
  mounted: function mounted () {
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    dialogTitle: {
      get () {
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    },
    formData: {
      get () {
        return this.data
      },
      set () {
        this.$emit('update:data', false)
      }
    }
  },
  methods: {
    dialogSave () {
      const self = this
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.showLoading('正在复制...')
          this.$api.SalaryManageApi.SalaryReport.copyByMonth({
            copyFromdate: self.formDialogData.from,
            copyTodate: self.formDialogData.to,
            billtype: self.$parent.billtype,
            pk_corp: self.$parent.$parent.pk_corp,
            auto: 'N'
          }).then(result => {
            this.closeLoading()
            if (result.success) {
              this.successMsg(result.msg)
              self.closeDialog()
              self.$parent.period = self.formDialogData.to
              self.$parent.fetchData()
            } else {
              this.errorMsg(result.msg)
            }
          }).catch(e => {
            this.closeLoading()
          })
        }
      })
    },
    onDialogOpen () {
      const formData = Object.assign({}, this.formData)
      this.formDialogData = formData
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    },
    datePicker () {
      const self = this.$parent
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.$store.getters.currentCorp.bdate
          return period < jzDate.substring(0, 7)
        }
      }
    }
  }
}
</script>
