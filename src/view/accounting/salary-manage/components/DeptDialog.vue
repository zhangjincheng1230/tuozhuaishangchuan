<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="450px"
    append-to-body>
    <el-form ref="formRef" :model="formDialogData" :rules="rules"  label-width="160px">
      <el-form-item  label="部门编码"  prop="code">
        <el-input size ="small" v-model="formDialogData.code"  style= "width:170px"></el-input>
      </el-form-item>
      <el-form-item  label="部门名称" prop="name">
        <el-input size ="small" v-model="formDialogData.name" style= "width:170px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small" @click="onDialogClose">取 消</el-button>
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
  name: 'DeptDialog',
  mixins: [MessageUtil, Loading],
  props: ['visible', 'title', 'data', 'indexRow'],
  data () {
    return {
      formDialogData: {},
      rules: {
        code: [{ required: true, message: '请录入部门编码', trigger: 'blur' }],
        name: [{ required: true, message: '请录入部门名称', trigger: 'blur' }]
      }
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
      }
    },
    row: {
      get () {
        return this.indexRow
      }
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
      this.formDialogData.pid = AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT
      const edit = 'add'
      const temp = {
        ...this.formDialogData,
        type: edit,
        pk_corp: this.$parent.$parent.pk_corp,
        sourcename: '部门',
        pid: AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT
      }
      this.showLoading('部门保存...')
      this.$api.SalaryManageApi.StaffInfo.onSave(temp).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg(result.msg)
          this.closeDialog()
          this.$emit('save', result.data, this.row)
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
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
