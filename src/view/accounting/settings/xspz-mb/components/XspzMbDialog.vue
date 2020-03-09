<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="450px"
  >
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-form-item label="应收或现金科目" prop="ysxjkm_id" :label-width="formLabelWidth">
        <el-select v-model="formData.ysxjkm_id" filterable placeholder="请选择" style="width: 100%">
          <el-option
            v-for="subj in subjectRefData"
            :key="subj.id"
            :label="subj.kmbm + '_' + subj.kmmc"
            :value="subj.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收入类科目" prop="srlkm_id" :label-width="formLabelWidth">
        <el-select v-model="formData.srlkm_id" filterable placeholder="请选择" style="width: 100%">
          <el-option
            v-for="subj in subjectRefData"
            :key="subj.id"
            :label="subj.kmbm + '_' + subj.kmmc"
            :value="subj.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应交税费科目" prop="yjsfkm_id" :label-width="formLabelWidth">
        <el-select v-model="formData.yjsfkm_id" filterable placeholder="请选择" style="width: 100%">
          <el-option
            v-for="subj in subjectRefData"
            :key="subj.id"
            :label="subj.kmbm + '_' + subj.kmmc"
            :value="subj.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摘要" prop="memo" :label-width="formLabelWidth">
        <el-input v-model="formData.memo" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'XspzMbDialog',
  props: ['visible', 'currentRow'],
  data () {
    return {
      formData: {},
      formLabelWidth: '120px',
      rules: {
        ysxjkm_id: [
          { required: true, message: '请选择应收或现金科目', trigger: 'change' }
        ],
        srlkm_id: [
          { required: true, message: '请选择收入类科目', trigger: 'change' }
        ],
        yjsfkm_id: [
          { required: true, message: '请选择应交税费科目', trigger: 'change' }
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
      return this.currentRow && this.currentRow.pk_xssrtemplate
    },
    title () {
      return this.isEdit ? '修改' : '新增'
    },
    subjectRefData () {
      return this.$store.state.accounting.subjectRefData
    }
  },
  methods: {
    save () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$api.BasicSettingApi.XspzMb.saveXspzMb(this.formData).then(result => {
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
      console.log(this.currentRow)
      if (this.isEdit) {
        const formData = Object.assign({}, this.currentRow)
        this.formData = formData
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
