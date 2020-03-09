<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             @open="onDialogOpen"
             @close="onDialogClose"
             @closed="onDialogClosed"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             width="450px">
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-form-item label="编码" prop="code" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.code" autocomplete="off" ref='code' autofocus = "true"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.name" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.memo" autocomplete="off" ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveAbstract" ref='commit'>保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'AbstractDialog',
  props: ['visible', 'abstract'],
  data () {
    return {
      formData: {},
      formLabelWidth: '90px',
      rules: {
        code: [
          { required: true, message: '请输入摘要编码', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入摘要名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        memo: [
          { required: false, message: '请输入备注信息', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
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
    isEdit () {
      return this.abstract && this.abstract.pabsid
    },
    title () {
      return this.isEdit ? '修改常用摘要' : '新增常用摘要'
    }
  },
  methods: {
    onNext (index, event) {
      event.target.blur()
      if (index === 1) {
        this.$refs.name.focus()
      } else if (index === 2) {
        this.$refs.memo.focus()
      } else if (index === 3) {
        this.$refs.commit.focus()
      }
    },
    saveAbstract () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.Abstract.saveAbstract({bDabstractsVO: this.formData}).then(result => {
            if (result.success) {
              this.$emit('save', result.rows)
              this.closeDialog()
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    onDialogOpen () {
      if (this.isEdit) {
        const formData = Object.assign({}, this.abstract)
        this.formData = formData
      } else {
        this.formData = {}
      }
      this.$nextTick(() => {
        this.$refs.code.focus()
      })
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formData.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>
