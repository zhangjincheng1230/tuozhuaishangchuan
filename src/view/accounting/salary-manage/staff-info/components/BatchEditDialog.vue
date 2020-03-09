<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="450px">
    <el-form ref="formRef" :model="formDialogData"  label-width="160px">
      <el-form-item label="已选择人数" >
        <el-input-number v-model="formDialogData.num" :controls =false :disabled = true style= "width:170px" ></el-input-number>
      </el-form-item>
      <el-form-item label="待修改属性"  prop="atrr">
        <el-select  v-model="formDialogData.atrr" filterable  default-first-option   placeholder="请选择" style= "width:170px" >
          <el-option v-for="item in xgType" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任职受雇从业日期"  v-if="formDialogData.atrr === 'employedate'" prop="employedate">
        <el-date-picker v-model="formDialogData.employedate" value-format="yyyy-MM-dd"  style= "width:170px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="部门" v-if="formDialogData.atrr === 'cdeptid'" prop="cdeptid2">
        <el-select   v-model="formDialogData.cdeptid2"
                     default-first-option placeholder="请选择" style= "width:170px">
          <el-option v-for="item in this.deptData" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id" style= "width:170px">
          </el-option>
        </el-select>
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
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'BatchEditDialog',
  mixins: [MessageUtil, Loading],
  props: ['visible', 'title', 'data'],
  data () {
    return {
      rule: {
        employedate: [{ required: true, message: '请录入离职日期', trigger: 'blur' }],
        cdeptid2: [{ required: true, message: '请录入部门', trigger: 'blur' }]
      },
      formDialogData: {}
    }
  },
  mounted: function mounted () {
    this.getDpetdata()
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
    },
    xgType: {
      get () {
        return AUXILIARY_CONST.BATCH_MODIFY_FIELD
      }
    },
    deptData () {
      return this.$parent.deptData
    }
  },
  methods: {
    dialogSave () {
      let pass = false
      this.$refs.formRef.validate(function (valid) {
        pass = valid
      })

      if (!pass) {
        return
      }
      const rows = this.$parent.listSelectedRows
      if (rows === null || rows.length === 0) {
        this.warnMsg('请选择至少一行数据!')
      }
      const ids = rows.reduce((id, row) => id + ',' + row.id, '')
      if (!ids) {
        this.warnMsg('请选择至少一行数据!')
      }
      this.showLoading('批改保存...')
      const temp = {
        zyids: ids,
        xglx: this.formDialogData.atrr,
        employedate: this.formDialogData.employedate,
        cdeptid1: this.formDialogData.cdeptid2,
        deptname: this.formDialogData.vdeptname
      }
      this.$api.SalaryManageApi.StaffInfo.batchSave(temp).then(result => {
        this.closeLoading()
        this.onDialogClose()
        if (result.success) {
          this.successMsg('批量修改成功!')
          this.$parent.fetchData()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    getDpetdata () {
      this.$api.SalaryManageApi.StaffInfo.queryB({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT,
        pk_corp: this.pk_corp
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            this.deptData = result.rows
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
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
    }
  }
}
</script>
