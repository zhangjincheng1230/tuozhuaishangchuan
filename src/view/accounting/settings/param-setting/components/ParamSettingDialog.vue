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
      <el-form-item label="参数编码" prop="pbm" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.pbm" autocomplete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="参数名称" prop="pname" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.pname" autocomplete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="设定值" prop="pdvalue" :label-width="formLabelWidth">
          <el-select v-model.trim="formData.pdvalue" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in pdvalueoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveParamSetting">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ParamSettingDialog',
  props: ['visible', 'paramsetting'],
  data () {
    return {
      formData: {},
      formLabelWidth: '90px',
      rules: {
        pdvalue: [
          { required: true }
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
    title () {
      return '修改参数设置'
    },
    pdvalueoptions () {
      if (this.paramsetting.pvalue) {
        const arr = this.paramsetting.pvalue.split(';')
        const obj = arr.map((item, index) => {
          // eslint-disable-next-line no-undef
          return { label: item, value: index }
        })
        return obj
      }
      return []
    }
  },
  methods: {
    saveParamSetting () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.ParamSetting.onSave({setvo: this.formData}).then(result => {
            if (result.success) {
              this.$emit('save', result.rows)
              this.$store.dispatch('fetchParamSet')
              this.closeDialog()
              this.successMsg(result.msg)
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
      if (this.paramsetting) {
        const formData = Object.assign({}, this.paramsetting)
        this.formData = formData
      } else {
        this.formData = {}
      }
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formData.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    }
  }
}
</script>
