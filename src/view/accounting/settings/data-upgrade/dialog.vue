<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onDialogClose"
    width="450px"
  >
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-form-item label="科目级次" prop="newcoderule" label-width="120px">
        <el-select
          v-model="formData.newcoderule"
          filterable
          placeholder="请选择"
          @change="changRule"
          style="width: 100%"
        >
          <el-option
            v-for="codeRule in codeRules"
            :key="codeRule.value"
            :label="codeRule.label"
            :value="codeRule.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo" label-width="120px">
        <el-input
          v-model="formData.memo"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { CODERULE } from '@/constants/subject'

export default {
  name: 'DataUpgradeDialog',
  props: ['visible'],
  data () {
    return {
      formData: {
        memo: '',
        newcoderule: ''
      },
      codeRules: CODERULE,
      rules: {
        newcoderule: [
          { required: true, message: '请选择科目级次', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    currentCodeRule: {
      get () {
        return this.$store.state.accounting.currentCodeRule
      },
      set (newCodeRule) {
        this.$store.commit('setCurrentCodeRule', newCodeRule)
      }
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    title () {
      return '修改会计科目编码规则'
    }
  },
  created () {
    this.queryCurrentCodeRule()
  },
  methods: {
    changRule (val) {
      if (this.validateForm()) {
        this.formData.newcoderule = val
      } else {
        this.formData.newcoderule = ''
      }
    },
    queryCurrentCodeRule () {
      this.$api.BasicSettingApi.dataUpgrade.queryCurrentCodeRule({
        pk_corp: this.$store.getters.getLoginCorpId
      }).then(reponse => {
        if (reponse.success === true) {
          this.currentCodeRule = reponse.msg
          this.formData.newcoderule = reponse.msg
        }
      })
    },
    validateForm () {
      let newIndex = this.codeRules.findIndex(obj => obj.value === this.formData.newcoderule)
      let currIndex = this.codeRules.findIndex(obj => obj.value === this.currentCodeRule)
      if (newIndex === currIndex) {
        this.$message({
          message: '编码规则没有发生改变',
          type: 'warning'
        })
        return false
      }
      if (newIndex < currIndex) {
        this.$message({
          message: '新编码规则需要大于旧编码规则',
          type: 'warning'
        })
        return false
      }
      return true
    },
    save () {
      this.$refs.formData.validate(valid => {
        if (valid && this.validateForm()) {
          this.$api.BasicSettingApi.dataUpgrade.save(this.formData).then(result => {
            if (result.success) {
              this.currentCodeRule = this.formData.newcoderule
              this.closeDialog()
              this.$emit('load')
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
    onDialogClose () {
      this.closeDialog()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>
