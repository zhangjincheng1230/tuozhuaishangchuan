<!--财务概要信息表-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group"
             style="float: left; white-space: nowrap">
          期间:
          <span class="left-icon" @click="previous()"></span>
          <el-popover
            placement="bottom-start"
            title="财务概要信息查询"
            width="390"
            popper-class="query-popover"
            show-close="true"
            v-model="visible">
            <button type="button" aria-label="Close" @click="visible = false" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
            <el-form ref="queryForm" :model="queryForm" label-width="60px" label-position="left">
              <el-form-item label="日期:">
                <el-col :span="18">
                  <el-date-picker type="month" value-format="yyyy-MM" :picker-options="monthPickerOptions" placeholder="选择日期" v-model="queryForm.qjq" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="公司:">
                <el-col :span="18">
                  <el-select v-model="queryForm.corpIds" filterable placeholder="请选择" style="width: 100%" @change="changeCorp">
                    <el-option
                      v-for="corp in corps"
                      :key="corp.pk_gs"
                      :label="corp.uname"
                      :value="corp.pk_gs"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="">
                <el-checkbox v-model="queryForm.check">包含未记账凭证</el-checkbox>
              </el-form-item>

            </el-form>
            <div style="text-align: right; margin: 0">
              <el-button @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="query()">确定</el-button>
            </div>
            <el-button slot="reference">
              {{ queryForm.qjq }}
            </el-button>
          </el-popover>
          <span class="right-icon" @click="next()"></span>
          公司: {{corpName}}
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="excelexport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container" style = "height:100%">
          <el-table
            ref="table"
            :data="tableData"
            :span-method="spanMethod"
            highlight-current-row
            v-loading="loading"
            element-loading-text="数据加载中，请稍候..."
            element-loading-spinner="el-icon-loading"
            stripe
            border
            :cell-style="myCellStyle"
            height="100%"
            style="width: 100%" >
            <el-table-column
              property="hs"
              label="行次"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="70">
            </el-table-column>
            <el-table-column
              property="xmfl"
              label="项目分类"
              show-overflow-tooltip
              header-align="center"
              width="150">
            </el-table-column>
            <el-table-column
              property="xm"
              label="项目"
              show-overflow-tooltip
              header-align="center"
              width="150">
            </el-table-column>
            <el-table-column
              label="本年累计金额"
              align="center">
              <el-table-column
                property="bnljje"
                label="金额"
                header-align="center"
                align="right"
                width="120">
                <template slot-scope="scope">
                  <div :style="isShowColor(scope.row.bnljje)">{{ formatMny(scope.row, null, scope.row.bnljje, scope.$index) }}</div>
                </template>
              </el-table-column>
              <el-table-column
                property="bnljbl"
                label="同比变化"
                header-align="center"
                align="right"
                width="120">
                <template slot-scope="scope">
                  <div :style="isShowColor(scope.row.bnljbl)">{{ formatBl(scope.row, null, scope.row.bnljbl, scope.$index) }}</div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="本期金额"
              align="center">
              <el-table-column
                property="byje"
                label="金额"
                header-align="center"
                align="right"
                width="120">
                <template slot-scope="scope">
                  <div :style="isShowColor(scope.row.byje)">{{ formatMny(scope.row, null, scope.row.byje, scope.$index) }}</div>
                </template>
              </el-table-column>
              <el-table-column
                property="bybl"
                label="同比变化"
                header-align="center"
                align="right"
                width="120">
                <template slot-scope="scope">
                  <div :style="isShowColor(scope.row.bybl)">{{ formatBl(scope.row, null, scope.row.bybl, scope.$index) }}</div>
                </template>
              </el-table-column>
              <el-table-column
                property="byhb"
                label="环比变化"
                header-align="center"
                align="right"
                width="120">
                <template slot-scope="scope">
                  <div :style="isShowColor(scope.row.byhb)">{{ formatBl(scope.row, null, scope.row.byhb, scope.$index) }}</div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top />
    </el-tooltip>
    <!-- 打印对话框-->
    <print-dialog ref="printdialog" :printTempRef="printTempRef" :enddate ="queryForm.begindate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>

  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import { getExportColumns, formatDate } from '@/utils'
import { mapGetters } from 'vuex'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'cwgy-report',
  mixins: [datePickerMixin],
  components: {
    BackToTop,
    PrintDialog
  },
  data () {
    return {
      nodename: '财务概要信息',
      visible: false,
      corpName: '',
      queryForm: {
        begindate: this.$store.getters.getLoginDate,
        qjq: this.$store.getters.getLoginDate.substr(0, 7),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        check: true
      },
      tableData: [],

      printTempRef: [
        { value: '1', label: 'A4纸模板' },
        { value: '2', label: 'B5纸模板' }
      ]
    }
  },
  created () {
    this.init()
    this.fetchData()
  },
  computed: {
    ...mapGetters(['corps', 'currentCorp', 'getCorp'])
  },
  methods: {
    myCellStyle (data, n, v) {
      if (data.rowIndex === 28 && (data.columnIndex === 3 || data.columnIndex === 5)) {
        return 'text-align:left'
      }
    },
    isShowColor (value) {
      if (value < 0) {
        return 'color:red'
      }
    },
    changeCorp (value) {
      const corp = this.getCorp(value)
    },
    init () {
      this.queryForm.corpIds = this.currentCorp.pk_gs
    },
    query () {
      this.visible = false
      this.fetchData()
    },
    previous () {
      const period = this.getCorp(this.queryForm.corpIds).bdate.substring(0, 7)
      if (period >= this.queryForm.qjq) {
        this.showWarnMessage('查询日期不能在建账日期前')
        return
      }
      const date = new Date(this.queryForm.qjq)
      date.setMonth(date.getMonth() - 1)
      this.queryForm.qjq = formatDate(date, 'YYYY-MM')
      this.fetchData()
    },
    next () {
      const date = new Date(this.queryForm.qjq)
      date.setMonth(date.getMonth() + 1)
      this.queryForm.qjq = formatDate(date, 'YYYY-MM')
      this.fetchData()
    },
    getQueryParam () {
      this.queryParam = {}
      this.queryParam.corpIds = this.queryForm.corpIds
      this.queryParam.begindate = this.queryForm.qjq + '-01'
      this.queryParam.ishasjz = this.queryForm.check ? 'N' : 'Y'
      return this.queryParam
    },
    fetchData () {
      const corp = this.getCorp(this.queryForm.corpIds)
      this.corpName = corp.uname
      this.loading = true
      this.$api.cwgyReport.query(this.getQueryParam()).then(result => {
        this.loading = false
        if (result.success === true) {
          this.tableData = result.rows
        } else {
          this.showWarnMessage(result.msg)
          this.tableData = []
        }
      }).catch(() => {
        this.loading = false
      })
    },
    print () {
      if (this.tableData.length === 0) {
        this.showWarnMessage('当前界面数据为空！')
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      this.$api.cwgyReport.printPdf('财务概要信息', this.getPrintParam(val))
    },
    getPrintParam (val) {
      let printparam = {
        corpName: this.corpName,
        titleperiod: this.queryForm.qjq,
        list: JSON.stringify(this.tableData)
      }
      return Object.assign(printparam, val)
    },
    excelexport () {
      if (this.tableData.length === 0) {
        this.showWarnMessage('当前界面数据为空！')
        return
      }
      this.$api.cwgyReport.expExcel('财务概要信息-' + this.queryForm.qjq, this.getPrintParam())
    },
    formatMny (row, column, cellValue, index) {
      if (cellValue == null || cellValue == 0) {
        return ''
      }
      cellValue = this.$options.filters.forThousands(cellValue)
      if (index === 2 || index === 6 || index === 17 || index === 18 ||
                    index === 19 || index === 20 || index === 21 || index === 22 || index === 23 ||
                    index === 24 || index === 25 || index === 26) {
        if (cellValue) {
          cellValue = cellValue + '%'
        }
      }
      if (row.rowspan === 4 && !row.xm) {
        let vv = parseInt(cellValue)
        if (vv === 100) {
          return '销项发票'
        } else if (vv === 101) {
          return '进项发票'
        }
      }

      return cellValue
    },
    formatBl (row, column, cellValue) {
      if (cellValue == null || cellValue == 0) {
        return ''
      }
      cellValue = this.$options.filters.forThousands(cellValue)
      if (cellValue) {
        cellValue = cellValue + '%'
      }
      return cellValue
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      let rowspan = row.rowspan
      let colspan = row.colspan

      if (colspan === 7 && columnIndex === 0) { // 空白行
        return {
          rowspan: 1,
          colspan: colspan
        }
      }

      if ((columnIndex === 0 || columnIndex === 1)) { // 第一、二列
        return {
          rowspan: rowspan,
          colspan: 1
        }
      }

      if (colspan) {
        if (colspan === 4 && columnIndex === 3) {
          return {
            rowspan: 1,
            colspan: colspan
          }
        }
        if (colspan === 2) {
          if (columnIndex === 3 || columnIndex === 5) {
            return {
              rowspan: 1,
              colspan: colspan
            }
          } else if (columnIndex === 4 || columnIndex === 6) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    },

    showWarnMessage (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      })
    }
  }
}
</script>
<style scoped>
  .el-button--medium{
    padding: 7px 20px;
  }
  /*.left-icon{*/
  /*  font: 12px/1.5 \5b8b\4f53;*/
  /*  color: #555;*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*  font-family: Microsoft YaHei;*/
  /*  display: inline-block;*/
  /*  height: 30px;*/
  /*  line-height: 30px;*/
  /*  cursor: pointer;*/
  /*  width: 20px;*/
  /*  vertical-align: middle;*/
  /*  font-size: 14px;*/
  /*  background: url(../images/left.png) no-repeat #657071;*/
  /*  background-position: 6px 10px;*/
  /*  border-top-left-radius: 5px;*/
  /*  border-bottom-left-radius: 5px;*/
  /*}*/
  /*.right-icon{*/
  /*  font: 12px/1.5 \5b8b\4f53;*/
  /*  color: #555;*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*  font-family: Microsoft YaHei;*/
  /*  display: inline-block;*/
  /*  height: 30px;*/
  /*  line-height: 30px;*/
  /*  cursor: pointer;*/
  /*  width: 20px;*/
  /*  vertical-align: middle;*/
  /*  font-size: 14px;*/
  /*  background: url(../images/right.png) no-repeat #657071;*/
  /*  background-position: 8px 10px;*/
  /*  border-top-right-radius: 5px;*/
  /*  border-bottom-right-radius: 5px;*/
  /*}*/
</style>
