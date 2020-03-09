<!--汇兑损益模板-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="addTemp">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delTemp">删除</el-button>
          <el-button @click="fetchData">刷新</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          :data="tableData"
          highlight-current-row
          @current-change="handleRowSelect"
          v-loading="loading"
          element-loading-text="数据加载中，请稍候..."
          element-loading-spinner="el-icon-loading"
          stripe
          border
          height="100%"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            property="accname"
            label="汇兑收益科目"
            header-align="center"
            width="200">
            <template #default="{ row }">
              {{ row.acccd + '_' + row.accname }}
            </template>
          </el-table-column>
          <el-table-column
            property="outaccname"
            label="汇兑损失科目"
            header-align="center"
            width="200">
            <template #default="{ row }">
              {{ row.outcd + '_' + row.outaccname }}
            </template>
          </el-table-column>
          <el-table-column
            property="mark"
            label="摘要"
            header-align="center"
            width="200">
          </el-table-column>
          <el-table-column
            property="coporname"
            label="录入人"
            header-align="center"
            width="90">
          </el-table-column>
          <el-table-column
            property="dopdate"
            label="录入时间"
            header-align="center"
            width="90">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @closed="onDialogClosed"
               width="450px">
      <el-form
        :model="formData"
        :rules="rules"
        label-width="auto"
        ref="formRef">
        <el-form-item label="汇兑收益科目" prop="corpacc_id">
          <el-select
            v-model="formData.corpacc_id"
            @change="selectGainSubject"
            filterable
            style="width: 100%">
            <el-option
              v-for="item in subjectRef"
              :key="item.id"
              :label="item.codename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇兑损失科目" prop="outacc_id">
          <el-select
            v-model="formData.outacc_id"
            @change="selectLossSubject"
            filterable
            style="width: 100%">
            <el-option
              v-for="item in subjectRef"
              :key="item.id"
              :label="item.codename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="mark">
          <el-input
            v-model.trim="formData.mark"
            style="width: 100%">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTemp">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'exchange-gains-and-losses-template',
  data () {
    return {
      loading: true,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      dialogTitle: '',
      formData: {},
      rules: {
        corpacc_id: [
          { required: true, message: '请选择汇兑收益科目', trigger: 'blur' }
        ],
        outacc_id: [
          { required: true, message: '请选择汇兑损失科目', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '请输入摘要', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    subjectRef () {
      return this.$store.getters.subSubjectRef
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.TransferTemplate.queryExchangeTemplate().then(result => {
        this.loading = false
        if (result.rows) {
          this.tableData = result.rows
        } else {
          this.tableData = []
        }
      }).catch(e => {
        this.loading = false
      })
    },
    handleRowSelect (val) {
      this.selectedRow = val
    },
    addTemp () {
      if (this.tableData.length > 0) {
        this.$message({
          showClose: true,
          message: '本公司已存在汇兑损益模板，不能新增',
          type: 'warning'
        })
        return
      }
      this.dialogTitle = '新增'
      this.formData = {}
      this.dialogVisible = true
    },
    selectGainSubject (val) {
      this.formData.acccd = this.subjectRef.find(subj => subj.id === val).kmbm
    },
    selectLossSubject (val) {
      this.formData.outcd = this.subjectRef.find(subj => subj.id === val).kmbm
    },
    delTemp () {
      if (this.selectedRow) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.BasicSettingApi.TransferTemplate.deleteExchangeTemplate({
            remtt_id: this.selectedRow.remtt_id,
            id_corp: this.selectedRow.id_corp
          }).then(result => {
            if (result.success) {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择要删除的数据',
          type: 'warning'
        })
      }
    },
    copyTemp () {
      this.dialogVisible = true
    },
    editRow () {
      if (this.selectedRow) {
        this.dialogTitle = '修改'
        this.formData = JSON.parse(JSON.stringify(this.selectedRow))
        this.dialogVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要编辑的数据',
          type: 'warning'
        })
      }
    },
    saveTemp () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.TransferTemplate.saveExchangeTemplate(this.formData).then(result => {
            if (result.success) {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'success'
              })
              this.dialogVisible = false
              this.fetchData()
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
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
