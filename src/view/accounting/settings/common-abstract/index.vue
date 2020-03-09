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
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="code"
              label="编号"
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              property="name"
              label="名称"
              header-align="center"
              width="200">
            </el-table-column>
            <el-table-column
              property="memo"
              label="备注"
              header-align="center"
              width="180">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="fetchData" ></Pagination>
        </div>
      </div>
      <AbstractDialog :visible.sync="dialogFormVisible"
                      :abstract="formData"
                      @save="onSaved"></AbstractDialog>
    </div>
  </div>
</template>

<script>
import AbstractDialog from './components/AbstractDialog'
import Pagination from '@/components/Pagination'

export default {
  name: 'common-abstract',
  components: {
    AbstractDialog,
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
      this.$api.BasicSettingApi.Abstract.queryAbstract().then(result => {
        this.loading = false
        if (result.success) {
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
    handleRowSelect (val) {
      this.currentRow = val
    },
    openDialog () {
      this.formData = {}
      this.dialogFormVisible = true
    },
    delRow () {
      if (this.currentRow) {
        if (this.currentRow.corp != this.$store.getters.currentCorp.pk_gs) {
          this.$message({
            showClose: true,
            message: '预置数据不可删除',
            type: 'warning'
          })
          return
        }

        this.$confirm('确定要删除此记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          const pabsid = this.currentRow.pabsid
          this.$api.BasicSettingApi.Abstract.deleteAbstract({bavo: this.currentRow}).then(result => {
            if (result.success) {
              this.successMsg('删除成功!')
              const index = this.tableData.findIndex(row => row.pabsid === pabsid)
              if (index > -1) {
                this.tableData.splice(index, 1)
              }
            } else {
              this.errorMsg(result.msg)
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
    editRow () {
      if (this.currentRow) {
        if (this.currentRow.corp == this.$store.getters.currentCorp.pk_gs) {
          this.formData = this.currentRow
          this.dialogFormVisible = true
        } else {
          this.$message({
            showClose: true,
            message: '预置数据不可修改',
            type: 'warning'
          })
        }

      } else {
        this.$message({
          showClose: true,
          message: '请选择一行数据修改',
          type: 'warning'
        })
      }
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    },
    onSaved () {
      this.fetchData()
    },
    refresh () {
      this.fetchData()
    }
  }
}
</script>

<style scoped>

</style>
