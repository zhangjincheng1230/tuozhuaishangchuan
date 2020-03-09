<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="editRow">修改</el-button>
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
            :default-sort = "{prop: 'pbm', order: 'ascending'}"
            stripe
            border
            height="100%"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="pbm"
              label="参数编码"
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              property="pname"
              label="参数名称"
              header-align="center"
              width="300">
            </el-table-column>
            <el-table-column
              property="pvalue"
              label="取值范围"
              header-align="center"
              width="300">
            </el-table-column>
            <el-table-column
              property="pdvalue"
              label="默认值"
              header-align="center"
              :formatter = "formatterdata1"
              width="200">
            </el-table-column>
            <el-table-column
              property="plevel"
              label="参数级别"
              header-align="center"
              :formatter = "formatterdata2"
              width="100">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <ParamSettingDialog :visible.sync="dialogFormVisible"
                      :paramsetting="formData"
                      @save="onSaved"></ParamSettingDialog>
    </div>
  </div>
</template>

<script>
import ParamSettingDialog from './components/ParamSettingDialog'

export default {
  name: 'param-setting',
  components: { ParamSettingDialog },
  data () {
    return {
      loading: true,
      tableData: [],
      dialogFormVisible: false,
      formData: {},
      currentRow: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.ParamSetting.query().then(result => {
        this.loading = false
        if (result.rows && result.rows.length > 0) {
          this.tableData = result.rows
          // this.total = result.total
        }
      }).catch(e => {
        this.loading = false
      })
    },
    handleRowSelect (val) {
      this.currentRow = val
    },
    editRow () {
      if (this.currentRow) {
        this.dialogFormVisible = true
        this.formData = this.currentRow
      } else {
        this.$message({
          showClose: true,
          message: '请先选择一行！',
          type: 'warning'
        })
      }
    },
    formatterdata1 (row, column, cellValue, index) {
      if (row.pvalue) {
        return row.pvalue.split(';')[cellValue]
      }
      return ''
    },
    formatterdata2 (row, column, cellValue, index) {
      if (cellValue === 0) {
        return '集团'
      } else if (cellValue === 1) {
        return '会计公司'
      } else if (cellValue === 2) {
        return '小企业'
      }
    },
    onSaved () {
      this.fetchData()
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
    }
  }
}
</script>

<style scoped>

</style>
