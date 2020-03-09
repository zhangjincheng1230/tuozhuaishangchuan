<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
              placement="bottom-start"
              title="年末结账查询"
              width="450"
              trigger="manual"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-select v-model="queryForm.beginYear" placeholder="请选择" style="width: 150px" @change="selectBeginYear">
                    <el-option
                      v-for="item in this.yearRange"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  -
                  <el-select v-model="queryForm.endYear" placeholder="请选择" style="width: 150px" @change="selectEndYear">
                    <el-option
                      v-for="item in this.yearRange"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                    <el-form-item label="公司：">
                      <el-input
                        placeholder="请选择公司"
                        style="width: 315px"
                        readonly
                        v-model="queryForm.corpNames">
                        <i slot="suffix" style="cursor: pointer"  class="el-icon-search" @click="openCorpDialog"></i>
                      </el-input>
                    </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference" @click="queryVisible = true">
                             {{queryqj}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
        </div>
        <div class="kj-button-group" @click="queryVisible=false">
          <el-button @click="profitJz">利润结转</el-button>
          <el-button @click="fanLiRunJz">反利润结转</el-button>
          <el-button @click="checksettle">结账检查</el-button>
          <el-button @click="settle">结账</el-button>
          <el-button @click="unsettle">反结账</el-button>
          <el-button @click="query">刷新</el-button>
          <el-button @click="print">打印</el-button>
        </div>
      </div>
      <div class="kj-main" @click="queryVisible=false">
        <div class="table-container">
          <el-table
            ref="multipleTable"
            :data="tableData"
            highlight-current-row
            stripe
            border
            v-loading="loading"
            tooltip-effect="dark"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              property="period"
              label="期间"
              header-align="center"
              align="left"
              width="100"
            ></el-table-column>
            <el-table-column
              property="corpname"
              label="公司"
              header-align="center"
              align="left"
              width="450"
            ></el-table-column>
            <el-table-column
              property="pzhasjz"
              label="凭证都已记账"
              :formatter="formatter"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="gdzchasjz"
              label="固定资产已结账"
              :formatter="formatter"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="sykmwye"
              label="期间损益已结转"
              :formatter="formatter"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="vdef10"
              label="利润结转"
              :formatter="formatter"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="qmph"
              label="期末试算平衡"
              :formatter="formatter"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="jzfinish"
              label="结账完成"
              :formatter="formatter"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column label></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 打印对话框 -->
    <nmjz-print-dialog ref="printdialog" :nodename="nodename" @confirmPrint="confirmPrint"></nmjz-print-dialog>
    <CorpDialog :visible.sync="corpDialogVisible" :defaultSelection="queryForm.corpIds" :modal="true" :singleSelect.sync="singleSelect" @selected="handleCorpSelect"></CorpDialog>
  </div>
</template>

<script>
import NmjzPrintDialog from '@/components/jzcl/NmjzPrintDialog'
import CorpDialog from '@/components/reference/CorpDialog'
export default {
  name: 'nmjz',
  components: {
    NmjzPrintDialog,
    CorpDialog
  },
  data () {
    return {
      singleSelect: false,
      corpDialogVisible: false,
      queryVisible: false,
      queryForm: {
        beginYear: this.$store.getters.getLoginDate.substring(0, 4),
        endYear: this.$store.getters.getLoginDate.substring(0, 4),
        corpIds: [this.$store.getters.currentCorp.pk_gs],
        corpNames: this.$store.getters.currentCorp.uname
      },
      loading: false,
      corps: this.$store.getters.corps,
      queryParam: {},
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    this.query()
  },
  computed: {
    // 用于打印设置保存
    nodename () {
      return '年末结账'
    },
    // 时间选择区间
    yearRange () {
      let range = []
      for (let beginRange = parseInt(this.$store.getters.getLoginDate.substring(0, 4)); beginRange <= new Date().getFullYear(); beginRange++) {
        range.push({value: beginRange, label: beginRange})
      }
      return range
    },
    // 用于显示区间
    queryqj () {
      return this.queryForm.beginYear + '~' + this.queryForm.endYear
    }
  },
  methods: {
    handleCorpSelect (corp) {
      this.queryForm.corpIds = corp.map(v => v.pk_gs)
      this.queryForm.corpNames = corp.map(v => v.uname).join(',')
    },
    openCorpDialog () {
      this.corpDialogVisible = true
    },
    // 查询列表
    query () {
      this.loading = true
      this.$api.nmjz.query(this.getQueryPram()).then(result => {
        this.queryVisible = false
        if (result.success === true) {
          this.tableData = result.rows
        } else {
          this.showError(result.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 点击行选中
    rowClick (row) {
      let refsElTable = this.$refs.multipleTable // 获取表格对象
      refsElTable.toggleRowSelection(row)
    },
    // boolean显示转换
    formatter (row, column, cellValue) {
      return (cellValue != null && typeof cellValue !== 'undefined' && (cellValue === '1' || cellValue === '是')) ? '是' : '否'
    },
    // 打开打印框
    print () {
      this.$refs.printdialog.show()
    },
    // 确定打印
    confirmPrint (val) {
      this.checkSum() && this.$api.nmjz.printPdf('年末结账', this.getPrintParam(val))
    },
    // 多选选中的行数组
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 利润结转
    profitJz () {
      this.loading = true
      this.checkSelectSum(true) && this.$api.nmjz.profitJz(this.selectedOneRow()).then(result => {
        if (result.success === true) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: result.msg,
            type: 'success'
          })
        } else {
          this.showError(result.msg)
        }
      }).finally(() => {
        this.query()
        this.loading = false
      })
    },
    // 反利润结转
    fanLiRunJz () {
      this.loading = true
      this.checkSelectSum(true) && this.$api.nmjz.fanLiRunJz(this.selectedOneRow()).then(result => {
        if (result.success === true) {
          this.$message({dangerouslyUseHTMLString: true, message: result.msg, type: 'success'})
        } else {
          this.showError(result.msg)
        }
      }).finally(() => {
        this.query()
        this.loading = false
      })
    },
    // 结账检查
    checksettle () {
      this.loading = true
      this.checkSelectSum(false) && this.$api.nmjz.checksettle(this.selectedRows()).then(result => {
        if (result.success === true) {
          this.tableData = result.rows
        } else {
          this.showError(result.msg)
        }
      }).finally(() => {
        this.query()
        this.loading = false
      })
    },
    // 多行更新
    updateRows (rows) {
      if (rows) {
        this.tableData = this.tableData.map(obj => rows.find(o => o.qmid === obj.qmid) || obj)
      }
    },
    // 异常信息显示
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, message: msg, type: 'error'})
    },
    // 警告信息显示
    showWarn (msg) {
      this.$message({dangerouslyUseHTMLString: true, message: msg, type: 'warning'})
    },
    // 结账
    settle () {
      this.loading = true
      this.checkSelectSum(false) && this.$api.nmjz.settle(this.selectedRows()).then(result => {
        if (result.success === true) {
          if (result.msg === '1') {
            this.$message({
              message: '结账成功！',
              type: 'success'
            })
          } else {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: result.msg,
              type: 'error'
            })
          }
        } else {
          this.showError(result.msg)
        }
      }).finally(() => {
        this.query()
        this.loading = false
      })
    },
    // 反结账
    unsettle () {
      this.loading = true
      this.checkSelectSum(false) && this.$api.nmjz.unsettle(this.selectedRows()).then(result => {
        if (result.success === true) {
          if (result.msg === '1') {
            this.$message({
              message: '反结账成功！',
              type: 'success'
            })
            this.query()
          } else {
            this.showError(result.msg)
          }
        } else {
          this.showError(result.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取选中的当行
    selectedOneRow () {
      return {qmJzVO: JSON.stringify(this.multipleSelection[0])}
    },
    // 检查列表是否有数据
    checkSum () {
      if (this.tableData === null || this.tableData.length === 0) {
        this.showWarn('没有数据可以打印')
        return false
      }
      return true
    },
    // 检查选中的数据
    checkSelectSum (isSingle) {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.showWarn('请选中数据')
        this.loading = false
        return false
      }
      if (isSingle && this.multipleSelection.length > 1) {
        this.showWarn('请单个结转')
        this.loading = false
        return false
      }
      return true
    },
    // 获取选中的所有数据
    selectedRows () {
      return {qmJzVOS: JSON.stringify(this.multipleSelection)}
    },
    // 选择起始年份
    selectBeginYear () {
      if (this.queryForm.beginYear > this.queryForm.endYear) {
        this.queryForm.endYear = this.queryForm.beginYear
      }
    },
    // 选择结束年份
    selectEndYear () {
      if (this.queryForm.beginYear > this.queryForm.endYear) {
        this.queryForm.beginYear = this.queryForm.endYear
      }
    },
    // 获取查询参数
    getQueryPram () {
      this.queryParam.startYear = this.queryForm.beginYear
      this.queryParam.endYear = this.queryForm.endYear
      this.queryParam.begindate = this.queryForm.beginYear + '-12-01'
      this.queryParam.enddate = this.queryForm.endYear + '-12-01'
      this.queryParam.corpslist = this.queryForm.corpIds
      return this.queryParam
    },
    // 获取打印参数
    getPrintParam (val) {
      let printParam = {
        data: JSON.stringify(this.tableData),
        period: this.queryqj
      }
      return Object.assign(printParam, val)
    }
  }
}
</script>
