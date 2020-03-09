<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="openDialog">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delRow">删除</el-button>
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
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="bkcode"
              label="银行编码"
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              property="bkname"
              label="银行名称"
              header-align="center"
              width="200">
            </el-table-column>
            <el-table-column
              property="bkaccout"
              label="银行账号"
              header-align="center"
              width="180">
            </el-table-column>
            <el-table-column
              property="accname"
              label="关联科目"
              header-align="center"
              width="180">
            </el-table-column>
            <el-table-column
              property="bkstatus"
              label="状态"
              header-align="center"
              width="150">
              <template #default="scope">
                {{ scope.row.state === 1 ? '停用' : '启用' }}
              </template>
            </el-table-column>
            <el-table-column
              property="caozuo"
              label="操作"
              align="center"
              width="150">
              <template #default="scope">
                <el-button  v-if="scope.row.state === 1"
                            @click="enableAccount(scope.row.id, scope.$index)"
                            type="small" style="color: #2acb42; border: 1px solid #2acb42;">启用</el-button>
                <el-button v-else @click="disableAccount(scope.row.id, scope.$index)"
                           type="small" style="color: #ff6159; border: 1px solid #ff6159;">停用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="fetchData" ></Pagination>
        </div>
      </div>
    </div>
    <BankAccountDialog :visible.sync="dialogFormVisible"
                       :account="formData"
                       @save="onSaved"></BankAccountDialog>
  </div>
</template>

<script>
import BankAccountDialog from './components/BankAccountDialog'
import Pagination from '@/components/Pagination'

export default {
  name: 'bank-account',
  components: {
    BankAccountDialog,
    Pagination
  },
  data () {
    return {
      loading: true,
      pageInfo: {
        page: 1,
        rows: 10
      },
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
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.BankAccount.queryBankAccount({
        isnhsty: '',
        ...this.pageInfo
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
        }
      }).catch(e => {
        this.loading = false
      })
    },
    enableAccount (id, index) {
      this.$api.BasicSettingApi.BankAccount.enableBankAccount({ id }).then(result => {
        if (result.success) {
          this.$message.success('启用成功!')
          this.tableData[index].state = 0
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    disableAccount (id, index) {
      this.$api.BasicSettingApi.BankAccount.disableBankAccount({ id }).then(result => {
        if (result.success) {
          this.$message.success('停用成功!')
          this.tableData[index].state = 1
        } else {
          this.$message.error(result.msg)
        }
      })
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
        this.dialogFormVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要编辑的银行账户',
          type: 'warning'
        })
      }
    },
    onSaved (data) {
      if (this.formData.id) {
        const index = this.tableData.findIndex(row => row.id === this.formData.id)
        if (index > -1) {
          this.$set(this.tableData, index, data)
        }
      } else {
        this.tableData.push(data)
      }
      this.$message.success('保存成功!')
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
          const id = this.currentRow.id
          this.$api.BasicSettingApi.BankAccount.deleteBankAccount({
            id: id,
            corpid: this.currentRow.corpid
          }).then(result => {
            if (result.success) {
              this.$message.success('删除成功!')
              const index = this.tableData.findIndex(row => row.id === id)
              if (index > -1) {
                this.tableData.splice(index, 1)
              }
            } else {
              this.$message.error(result.msg)
            }
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择要删除的银行账户',
          type: 'warning'
        })
      }
    }
  }
}
</script>
