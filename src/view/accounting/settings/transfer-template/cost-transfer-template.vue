<!--结转成本模板-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="addTemp">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delTemp">删除</el-button>
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
            property="pk_debitaccount_name"
            label="借方科目"
            show-overflow-tooltip
            header-align="center"
            width="150">
          </el-table-column>
          <el-table-column
            property="pk_creditaccount_name"
            label="贷方科目"
            show-overflow-tooltip
            header-align="center"
            width="150">
          </el-table-column>
          <el-table-column
            property="pk_fillaccount_name"
            label="取数科目"
            header-align="center"
            width="150">
          </el-table-column>
          <el-table-column
            v-if="showRatio"
            property="tratio"
            label="结转比例"
            header-align="center"
            align="right"
            width="80">
            <template #default="{row}">
              {{row.tratio ? (row.tratio.toFixed(2) + '%') : ''}}
            </template>
          </el-table-column>
          <el-table-column
            property="acts"
            label="摘要"
            show-overflow-tooltip
            header-align="center"
            width="225">
          </el-table-column>
          <el-table-column
            property="jztype"
            label="结转类型"
            header-align="center"
            :formatter="formatTransferType"
            width="120">
          </el-table-column>
          <el-table-column
            property="bz"
            label="备注"
            header-align="center"
            width="170">
            <template #default="{ row }">
              {{ row.id_corp === '000001' ? '系统预置，不允许修改删除' : '' }}
            </template>
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
        <el-form-item label="借方科目" prop="id_debitaccount">
          <el-select
            v-model="formData.id_debitaccount"
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
        <el-form-item label="贷方科目" prop="id_creditaccount">
          <el-select
            v-model="formData.id_creditaccount"
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
        <el-form-item
          label="取数科目"
          prop="id_fillaccount"
          :rules="formData.jztype === 3 ? rules.sourceSubject : []">
          <el-select
            v-model="formData.id_fillaccount"
            filterable
            clearable
            style="width: 100%">
            <el-option
              v-for="item in subjectRef"
              :key="item.id"
              :label="item.codename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showRatio" label="结转比例" prop="tratio">
          <el-input-number
            v-model="formData.tratio"
            :precision="2"
            :min="0"
            :max="100"
            :controls="false"
            class="percent-number"
            style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="摘要" prop="acts">
          <el-input
            v-model.trim="formData.acts"
            style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item label="结转类型" prop="jztype">
          <el-select
            v-model="formData.jztype"
            style="width: 100%">
            <el-option
              v-for="item in transferTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
// 结转类型
const TRANSFER_TYPE = [
  {
    value: 1,
    label: '材料成本结转'
  },
  {
    value: 2,
    label: '完工产品成本结转'
  },
  {
    value: 3,
    label: '销售成本结转'
  }
]
export default {
  name: 'cost-transfer-template',
  data () {
    return {
      loading: true,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      dialogTitle: '',
      formData: {},
      transferTypes: TRANSFER_TYPE,
      rules: {
        id_debitaccount: [
          {required: true, message: '请选择借方科目', trigger: 'blur'}
        ],
        id_creditaccount: [
          {required: true, message: '请选择贷方科目', trigger: 'blur'}
        ],
        sourceSubject: [
          {required: true, message: '请选择取数科目', trigger: 'blur'}
        ],
        tratio: [
          {required: true, message: '请输入结转比例', trigger: 'blur'}
        ],
        acts: [
          {required: true, message: '请输入摘要', trigger: 'blur'},
          {min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
        ],
        jztype: [
          {required: true, message: '请选择结转类型', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    inventoryModuleEnabled () {
      return this.$store.getters.inventoryModuleEnabled
    },
    // 库存老模式
    isInventoryOldMode () {
      let isOld = false
      if (this.inventoryModuleEnabled && this.loginCorp && this.loginCorp.buildicstyle !== '1') {
        isOld = true
      }
      return isOld
    },
    subjectRef () {
      // 老版库存选择末级科目
      return this.isInventoryOldMode ? this.$store.getters.subSubjectRef : this.$store.getters.subjectRef
    },
    defaultTemplate () {
      const defaultTemp = {
        acts: '商品销售成本结转',
        tratio: 100,
        jztype: 3
      }
      this.subjectRef.forEach(subj => {
        if (subj.kmbm === '1405') {
          defaultTemp.id_creditaccount = subj.id
        } else if (subj.kmbm === '600101' || subj.kmbm === '6001001') {
          defaultTemp.id_fillaccount = subj.id
        } else if (subj.kmbm === '640101' || subj.kmbm === '6401001') {
          defaultTemp.id_debitaccount = subj.id
        } else if (subj.kmbm === '500101' || subj.kmbm === '5001001') {
          defaultTemp.id_fillaccount = subj.id
        } else if (subj.kmbm === '540101' || subj.kmbm === '5401001') {
          defaultTemp.id_debitaccount = subj.id
        }
      })
      return defaultTemp
    },
    loginCorp () {
      return this.$store.getters.getLoginCorp
    },
    // 显示结转比例
    showRatio () {
      let showRatio = false
      if (this.loginCorp && this.loginCorp.costforwardstyle === 1) {
        showRatio = true
      }
      return showRatio
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.TransferTemplate.getCostTransferTemplate().then(result => {
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
    formatTransferType (row, column, cellValue) {
      if (cellValue !== undefined) {
        return TRANSFER_TYPE.find(type => type.value === cellValue).label
      }
    },
    handleRowSelect (val) {
      this.selectedRow = val
    },
    addTemp () {
      this.dialogTitle = '新增'
      this.formData = JSON.parse(JSON.stringify(this.defaultTemplate))
      this.dialogVisible = true
    },
    delTemp () {
      if (this.selectedRow) {
        if (this.selectedRow.id_corp === '000001') {
          this.$message({
            showClose: true,
            message: '预置数据不可删除！',
            type: 'warning'
          })
          return
        }
        this.$confirm('确定删除?', '提示', {
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.BasicSettingApi.TransferTemplate.deleteCostTransferTemplate({
            id_corp_costtransfer: this.selectedRow.id_corp_costtransfer,
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
        if (this.selectedRow.id_corp === '000001') {
          this.$message({
            showClose: true,
            message: '预置数据不可修改！',
            type: 'warning'
          })
          return
        }
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
          const saveApi = this.formData.id_corp_costtransfer
            ? this.$api.BasicSettingApi.TransferTemplate.updateCostTransferTemplate
            : this.$api.BasicSettingApi.TransferTemplate.saveCostTransferTemplate
          saveApi(this.formData).then(result => {
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
