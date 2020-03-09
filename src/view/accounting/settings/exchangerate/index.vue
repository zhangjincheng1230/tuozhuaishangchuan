<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="addRow">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delRow">删除</el-button>
          <!--<el-button @click="refresh">刷新</el-button>-->
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
              :show-overflow-tooltip="true"
              width="50">
            </el-table-column>
            <el-table-column
              property="encyname"
              label="币种"
              header-align="center"
              :show-overflow-tooltip="true"
              width="100">
            </el-table-column>
            <el-table-column
              property="cmode"
              label="折算模式"
              header-align="center"
              :formatter="formatter"
              :show-overflow-tooltip="true"
              width="150">
            </el-table-column>
            <el-table-column
              property="erate"
              label="汇率"
              header-align="center"
              align="right"
              :formatter = "vxeformatterHuilv"
              :show-overflow-tooltip="true"
              width="100">
            </el-table-column>
            <el-table-column
              property="cratename"
              label="创建人"
              header-align="center"
              :show-overflow-tooltip="true"
              width="100">
            </el-table-column>
            <el-table-column
              property="ctime"
              label="创建时间"
              header-align="center"
              :show-overflow-tooltip="true"
              width="180">
            </el-table-column>
            <el-table-column
              property="momo"
              label="备注"
              header-align="center"
              :show-overflow-tooltip="true"
              width="300">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="fetchData" ></Pagination>
        </div>
      </div>
    </div>
    <ExRateDialog :visible.sync="dialogFormVisible"
                  :erData="formData" :allRows="tableData"
                  @save="onSaved"></ExRateDialog>
  </div>
</template>
<style scoped>

</style>

<script>
import ExRateDialog from './components/ExRateDialog'
import Pagination from '@/components/Pagination'

export default {
  name: 'exchangerate',
  components: {
    ExRateDialog,
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
      formData: {},
      huilvprecision: this.$store.getters.huilvPre
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.ExchangeRate.queryExRate().then(result => {
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
    checkRow (op) {
      if (!this.currentRow) {
        this.showMsg('请选择一条记录！', 'warning')
        return false
      }
      if (this.currentRow.encyname === '人民币') { // this.currentRow.pk_cur === '00000100AA10000000008YJ6'
        this.showMsg(`预置数据不能${op === 'edit' ? '修改' : '删除'}！`, 'warning')
        return false
      }
      return true
    },
    addRow () {
      this.formData = {}
      this.dialogFormVisible = true
    },
    editRow () {
      if (!this.checkRow('edit')) {
        return
      }
      this.formData = this.currentRow
      this.dialogFormVisible = true
    },
    delRow () {
      if (!this.checkRow('delete')) {
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
        const pkid = this.currentRow.id_rate
        this.$api.BasicSettingApi.ExchangeRate.deleteExRate(this.currentRow).then(result => {
          if (result.success) {
            this.showMsg('删除成功!', 'success')
            const index = this.tableData.findIndex(row => row.id_rate === pkid)
            if (index > -1) {
              this.tableData.splice(index, 1)
            }
          } else {
            this.showMsg(result.msg, 'error')
          }
        })
      })
    },
    formatter (row, column) {
      return row.cmode === 0 ? '原币×汇率＝本位币' : '原币÷汇率＝本位币'
    },
    handleRowSelect (val) {
      this.currentRow = val
    },
    showMsg (msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      })
    },
    vxeformatterHuilv (row, column, cellValue, index) {
      if (cellValue) {
        return this.$options.filters.forThousands(cellValue, this.huilvprecision)
      }
      return ''
    },
    onSaved (data) {
      // 对话框保存后，后台刷新或UI端刷新均可
      // 改为后台刷新，要不"创建人"刷不出来
      this.fetchData()
      /*
      // UI端刷新
      if (this.formData.id_rate) {
        const index = this.tableData.findIndex(row => row.id_rate === this.formData.id_rate)
        if (index > -1) {
          this.$set(this.tableData, index, data)
        }
      } else {
        this.tableData.push(data)
      }
      */
      this.$message.success('保存成功!')
    }
  }
}
</script>
