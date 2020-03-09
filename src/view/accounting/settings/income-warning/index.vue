<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="openDialog">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delRow">删除</el-button>
          <el-button @click="refresh">刷新</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
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
              header-align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="xmmc"
              label="项目名称"
              show-overflow-tooltip
              header-align="center"
              width="200">
            </el-table-column>
            <el-table-column
              property="kmbm"
              label="科目编码"
              show-overflow-tooltip
              header-align="center"
              width="150">
            </el-table-column>
            <el-table-column
              property="km"
              label="取数科目"
              show-overflow-tooltip
              header-align="center"
              width="200">
            </el-table-column>
            <el-table-column
              property="srsx"
              label="预警上线(元)"
              header-align="center"
              :formatter="formatMny"
              show-overflow-tooltip
              align="right"
              width="150">
            </el-table-column>
            <el-table-column
              property="yjz"
              label="预警值"
              header-align="center"
              :formatter="formatMny"
              show-overflow-tooltip
              align="right"
              width="150">
            </el-table-column>
            <el-table-column
              property="period_type"
              label="预警周期"
              header-align="center"
              show-overflow-tooltip
              width="100">
              <template #default="scope">
                  {{ scope.row.period_type === 0 ? '月度' : scope.row.period_type === 1 ? '季度' : scope.row.period_type === 2 ? '年度' : '连续12月'  }}
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
    <IncomeWarningDialog :visible.sync="dialogFormVisible"
                       :account="formData"
                       @save="onSaved"
                       @refresh="fetchData"></IncomeWarningDialog>
  </div>
</template>

<script>
import IncomeWarningDialog from './components/IncomeWarningDialog'
import Pagination from '@/components/Pagination'
import mixin from './components/mixins/mixins'

export default {
  name: 'income-warning',
  components: {
    IncomeWarningDialog,
    Pagination
  },
  mixins: [mixin],
  data () {
    return {
      loading: true,
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      currentRow: null,
      formData: {}
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    if (this.$route.query.action !== undefined) {
      this.openDialog()
    }
  },
  methods: {
    formatMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.IncomeWarning.query({
      }).then(result => {
        this.loading = false
        if (result.rows && result.rows.length > 0) {
          this.tableData = result.rows
          this.total = result.total
        } else {
          this.tableData = []
          this.total = 0
        }
      }).catch(e => {
        this.loading = false
      })
    },
    refresh () {
      this.fetchData()
    },
    handleRowSelect (val) {
      this.currentRow = val
    },
    openDialog () {
      this.formData = {}
      this.dialogFormVisible = true
    },
    editRow () {
      if (this.currentRow) {
        this.formData = Object.assign({}, this.currentRow)
        if (this.formData.pk_accsubj) {
          this.formData.subjs = this.formData.pk_accsubj
        }
        this.dialogFormVisible = true
        if (this.formData.flg === '是') {
          this.formData.editStatus = true
        } else {
          this.formData.editStatus = false
        }
      } else {
        this.warnMsg('请先选择一行！')
      }
    },
    onSaved (data) {
      // if (this.formData.pk_sryj) {
      //   const index = this.tableData.findIndex(row => row.pk_sryj === this.formData.pk_sryj)
      //   if (index > -1) {
      //     this.$set(this.tableData, index, data)
      //   }
      // } else {
      //   this.tableData.push(data)
      // }
      this.glIncomewarning()
      // this.successMsg('保存成功!')
    },
    delRow () {
      if (this.currentRow) {
        this.$confirm('确定要删除此记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          const id = this.currentRow.pk_sryj
          this.$api.BasicSettingApi.IncomeWarning.del({
            pk_sryj: id,
            corpid: this.currentRow.corpid
          }).then(result => {
            if (result.success) {
              this.successMsg('删除成功!')
              const index = this.tableData.findIndex(row => row.pk_sryj === id)
              if (index > -1) {
                this.tableData.splice(index, 1)
              }
            } else {
              this.errorMsg(result.msg)
            }
          })
        })
      } else {
        this.warnMsg('请选择要删除的数据')
      }
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    warnMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>
