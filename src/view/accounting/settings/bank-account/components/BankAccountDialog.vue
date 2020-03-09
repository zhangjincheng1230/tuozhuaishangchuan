<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @open="onDialogOpen"
             @opened="onDialogOpened"
             @close="onDialogClose"
             @closed="onDialogClosed"
             width="450px">
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-form-item label="银行编码" prop="bkcode" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.bkcode" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="银行名称" prop="bkname" :label-width="formLabelWidth">
        <el-input
          ref="nameInput"
          v-model.trim="formData.bkname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="银行账号" prop="bkaccout" :label-width="formLabelWidth">
        <el-input v-model.trim="formData.bkaccout" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="关联科目" prop="accname_id" :label-width="formLabelWidth">
        <el-select
          v-model="formData.accname_id"
          :disabled="this.subject !== null"
          @change="onSubjectChange"
          style="width: 100%">
          <el-option
            v-for="subj in bankSubject"
            :key="subj.id"
            :label="subj.kmbm + '_' + subj.kmmc"
            :value="subj.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveAccount">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'BankAccountDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    account: {
      type: Object,
      default () {
        return {}
      }
    },
    subject: {
      type: Object,
      default: null
    }
  },
  data () {
    const checkInputString = (rule, value, callback) => {
      if (value && value.match(/[^0-9a-zA-Z]/)) {
        callback(new Error('只能输入字母或数字'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      formLabelWidth: '90px',
      rules: {
        bkcode: [
          { required: true, message: '请输入银行编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
          { validator: checkInputString, trigger: 'blur' }
        ],
        bkname: [
          { required: true, message: '请输入银行名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        bkaccout: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { min: 1, max: 28, message: '长度在 1 到 28 个字符', trigger: 'blur' },
          { validator: checkInputString, trigger: 'blur' }
        ],
        accname_id: [
          { required: true, message: '请选择关联科目', trigger: 'change' }
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
      return this.account && this.account.id
    },
    title () {
      return this.isEdit ? '修改银行账户' : '新增银行账户'
    },
    bankSubject () {
      return this.subject ? [this.subject] : this.$store.getters.bankSubject
    }
  },
  methods: {
    getNewCode () {
      this.$api.BasicSettingApi.BankAccount.getBankAccountCode().then(result => {
        this.formData.bkcode = result.data
      })
    },
    onSubjectChange (subjId) {
      if (subjId) {
        const subj = this.bankSubject.find(subj => subj.id === subjId)
        if (subj) {
          this.formData.accname = subj.kmmc
        }
      }
    },
    saveAccount () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.BankAccount.saveBankAccount(this.formData).then(result => {
            if (result.success) {
              this.$emit('save', result.rows)
              this.closeDialog()
            } else {
              this.$message({
                showClose: true,
                message: '保存失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    onDialogOpen () {
      let formData = Object.assign({}, this.account)
      if (this.isEdit) {
        delete formData.code
        delete formData.name
        this.formData = formData
      } else {
        if (!formData.bkcode) {
          formData.bkcode = '001'
        }
        this.formData = formData
        this.getNewCode()
      }
    },
    onDialogOpened () {
      if (!this.isEdit) {
        this.$refs.nameInput.focus()
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
    }
  }
}
</script>
