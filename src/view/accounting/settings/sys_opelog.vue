<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info" style="display: inline-flex;">
          <div>操作日期：
            <el-popover
              placement="bottom-start"
              title="操作日志查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="formParam" label-width="auto">
                <el-form-item label="操作日期：">
                  <el-date-picker
                    v-model="formParam.periodRange"
                    type="daterange"
                    range-separator=" - "
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="操作用户：">
                  <el-select
                    v-model="formParam.opeuser"
                    style="width: 315px">
                    <el-option
                      v-for="item in users"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作类型：">
                  <el-select
                    v-model="formParam.opetype"
                    style="width: 315px">
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作明细：" >
                  <el-input   v-model="formParam.opemsg" style="width: 315px"></el-input>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="fetchData">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{qrydate}}
                  <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="printReport">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            ref="table"
            :data="tableData"
            highlight-current-row
            stripe
            border
            height="100%"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="odate"
              label="操作时间"
              header-align="center"
              show-overflow-tooltip
              width="160">
            </el-table-column>
            <el-table-column
              property="user"
              label="操作用户"
              header-align="center"
              show-overflow-tooltip
              width="120">
            </el-table-column>
            <el-table-column
              property="ip"
              label="ip地址"
              header-align="center"
              show-overflow-tooltip
              width="120">
            </el-table-column>
            <el-table-column
              property="otype"
              label="操作类型"
              header-align="center"
              :formatter="optypeformatter"
              show-overflow-tooltip
              width="120">
            </el-table-column>
            <el-table-column
              property="omsg"
              label="操作说明"
              header-align="center"
              show-overflow-tooltip
              width="335">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="fetchData" ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getExportColumns, formatDate, getMonthBegin, getMonthEnd } from '@/utils'

export default {

  name: 'sys_opelog',
  components: {
    Pagination
  },
  data () {
    let date = new Date()
    return {
      nodename: '操作日志',
      pageInfo: {
        page: 1,
        rows: 100
      },
      total: 0,
      tableData: [],
      users: [],
      types: [],
      loading: false,
      queryVisible: false,
      dialogFormVisible: false,
      currentRow: null,
      formParam: {
        periodRange: [getMonthBegin(date), getMonthEnd(date)],
        begindate: '',
        enddate: '',
        opeuser: '',
        opetype: '',
        opemsg: ''
      }
    }
  },
  computed: {
    qrydate: function () {
      return this.formParam.periodRange
        ? this.formParam.periodRange[0] + ' - ' + this.formParam.periodRange[1]
        : this.formParam.begindate + ' - ' + this.formParam.enddate
    }
  },
  created () {
    this.init()
    this.fetchData()
  },
  mounted () {
  },
  methods: {
    init () {
      this.$api.BasicSettingApi.SysOpeLog.queryOpeUser(
      ).then(result => {
        if (result.success) {
          this.users = result.rows
        } else {
          this.warnMessage(result.msg)
          this.users = []
        }
      })

      this.$api.BasicSettingApi.SysOpeLog.queryType(
      ).then(result => {
        if (result.success) {
          this.types = result.rows
        } else {
          this.warnMessage(result.msg)
          this.types = []
        }
      })
    },
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.SysOpeLog.queryLogs(
        Object.assign(this.getQueryParam(), this.pageInfo)
      ).then(result => {
        this.loading = false
        if (result.success === true) {
          this.successMsg(result.msg)
          this.tableData = result.rows
          this.total = result.total
          this.queryVisible = false
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    getQueryParam () {
      const periodBegin = this.formParam.periodRange[0]
      const periodEnd = this.formParam.periodRange[1]
      return {
        begindate: periodBegin,
        enddate: periodEnd,
        opeuser: this.formParam.opeuser,
        otpye: this.formParam.opetype,
        omsg: this.formParam.opemsg
        // periodRange: this.formParam.periodRange
      }
    },
    printReport () {
      if (this.tableData.length === 0) {
        this.warnMessage('当前界面数据为空！')
        return
      }
      let param = this.getQueryParam()
      this.$api.BasicSettingApi.SysOpeLog.printPdf(this.nodename, {
        strlist: JSON.stringify(this.getExportRows()),
        columns: JSON.stringify(getExportColumns(this.$refs.table)),
        begindate: param.begindate,
        enddate: param.enddate,
        otpye: param.otpye === undefined ? '' : param.otpye,
        opeuser: param.opeuser,
        omsg: param.opemsg
      })
    },
    exportReport () {
      if (this.tableData.length === 0) {
        this.warnMessage('当前界面数据为空！')
        return
      }
      let param = this.getQueryParam()
      this.$api.BasicSettingApi.SysOpeLog.expExcel(this.nodename, {
        begindate: param.begindate,
        enddate: param.enddate,
        otpye: param.otpye === undefined ? '' : param.otpye,
        opeuser: param.opeuser,
        omsg: param.opemsg
      })
    },
    getExportRows () {
      const exportRows = []
      this.tableData.forEach(data => {
        const exportData = Object.assign({}, data)
        exportRows.push(exportData)
      })
      return exportRows
    },
    optypeformatter (row, column, cellValue, index) {
      let name = ''
      cellValue += ''
      if (cellValue) {
        const item = this.types.filter(item => item.id == cellValue)[0]
        if (item) {
          name = item.name
        }
      }
      return name
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    warnMessage (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      })
    }
  }
}
</script>
