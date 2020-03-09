<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div style = "display: inline-flex;">
            <div style="margin-left: 5px">期间：
              <el-popover
                placement="bottom-start"
                title="查询"
                width="450"
                popper-class="query-popover"
                v-model="queryVisible">
                <QueryParam ref="queryForm"> </QueryParam>
                <div class="query-footer">
                  <div class="kj-button-group">
                    <el-button @click="queryVisible = false">取消</el-button>
                    <el-button @click="clearQueryForm">清除</el-button>
                    <el-button type="primary" @click="query">确定</el-button>
                  </div>
                </div>
                <span class="query-period" slot="reference">
               {{qrydate}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
              </el-popover>
            </div>
            <span class="query-corp" :title="this.$store.getters.currentCorp.uname">公司： {{ this.$store.getters.currentCorp.uname }}</span>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="fetchData">刷新</el-button>
          <el-button  style="margin-left:10px" @click="exportReport">导出</el-button>
          <el-button  style="margin-left:10px" @click="print">打印</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="sortedData"
            highlight-current-row
            @current-change="handleListRowSelect"
            @selection-change="handleListRowSelection"
            :row-class-name="tableRowClassName"
            @row-click="dblclickRow"
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
            show-summary
            :summary-method="getSummaries"
            stripe
            border
            height="100%"
            ref="refTable"
            style="width: 100%">
            <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column property="kmmc"  label="科目" header-align="center" align="left" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column  property="invname" label="存货" header-align="center" align="left"  width="150" show-overflow-tooltip></el-table-column>
            <el-table-column  property="zy"  label="摘要" header-align="center" align="left" width="130" show-overflow-tooltip ></el-table-column>
            <el-table-column property="invspec" label="规格(型号)" header-align="center" align="left" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column  property="measure"  label="计量单位"  header-align="center" align="left"  width="80" ></el-table-column>
            <el-table-column property="ddate"  label="单据日期" header-align="center" align="left" width="100" ></el-table-column>
            <TableColumnPre prop="num" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="cost" label="成本" ></TableColumnPre>
            <el-table-column property="pzh"  label="凭证号" header-align="center" align="left" width="80" >
              <template slot-scope="scope" v-if="scope.row.pzh">
                记<span @click="linkVou(scope.row)"
                        class="spanlink" >{{scope.row.pzh}}</span>
              </template>
            </el-table-column>
            <el-table-column  property="memo" label="备注"  header-align="center" align="left" width="150" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination  :total="total"  :page.sync="pageInfo.page"  :limit.sync="pageInfo.rows"  @pagination="fetchData" ></Pagination>
        </div>
      </div>
      <PrintDataDialog ref="printdialog" :visible.sync="dialogPrintFormVisible" :title="dialogPrintFormTitle"  :nodename="nodename" @confirmPrint="confirmPrint">
      </PrintDataDialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import TableColumnPre from '@/components/TableColumnPre/index'
import QueryParam from './compoent/QueryParam'
import PrintDataDialog from '../component/PrintDataDialog'
import * as MsgUtil from '../../msg-util'
import { orderBy } from 'natural-orderby'
import { accAdd } from '@/utils'
export default {
  name: 'icbill-tradeout',
  components: {
    QueryParam,
    Pagination,
    PrintDataDialog,
    TableColumnPre
  },
  data () {
    return {
      nodename: '出库单',
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      loginDate: this.$store.getters.getLoginDate,
      loading: false,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      tableData: [],
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      queryParam: {},
      queryVisible: false,
      qrydate: '请录入查询条件',
      dialogPrintFormVisible: false,
      dialogPrintFormTitle: '打印'
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.invcode)
    }
  },
  created () {
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.refTable.doLayout()
    })
  },
  mounted: function mounted () {
    this.fetchData()
  },
  methods: {
    getParam () {
      let param = this.$refs.queryForm.getQueryParam()
      if (param !== false) {
        this.qrydate = param.begindate + '至' + param.enddate
        Object.assign(param, this.pageInfo)
      }
      delete param.pageSizes
      return param
    },
    clearQueryForm () {
      return this.$refs.queryForm.resetForm()
    },
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    fetchData () {
      this.loading = true
      const param = this.getParam()
      this.queryParam = param
      this.$api.InventoryManageApi.IcbillTradeout.query(param).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    linkVou (row) {
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: row.id_voucher
        }
      })
    },
    print () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.dialogPrintFormVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '未选中任何数据，请至少选择一行数据！',
          type: 'warning'
        })
      }
    },
    confirmPrint (printData) {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let exportRows = []
        this.listSelectedRows.forEach(data => {
          const exportData = Object.assign({}, data)
          exportData.titlePeriod = this.qrydate
          exportData.gs = this.$store.getters.currentCorp.uname
          exportRows.push(exportData)
        })
        exportRows = orderBy(exportRows, v => v.index)
        let param = {'list': JSON.stringify(exportRows)}
        param = Object.assign(param, printData)
        this.$api.InventoryManageApi.IcbillTradeout.print(param)
      } else {
        this.$message({
          showClose: true,
          message: '未选中任何数据，请至少选择一行数据！',
          type: 'warning'
        })
      }
      this.dialogPrintFormVisible = false
    },
    exportReport () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let exportRows = []
        this.listSelectedRows.forEach(data => {
          const exportData = Object.assign({}, data)
          exportData.dbilldate = exportData.ddate
          exportData.vcorpname = this.$store.getters.currentCorp.uname
          exportData.nnum = exportData.num
          exportData.ncost = exportData.cost
          exportRows.push(exportData)
        })
        exportRows = orderBy(exportRows, v => v.index)
        const param = {'list': JSON.stringify(exportRows)}
        this.$api.InventoryManageApi.IcbillTradeout.expExcel(param)
      } else {
        this.$message({
          showClose: true,
          message: '未选中任何数据，请至少选择一行数据！',
          type: 'warning'
        })
      }
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    tableRowClassName (row, index) {
      row.row.index = row.rowIndex
    },
    dblclickRow (row) {
      this.$refs.refTable.toggleRowSelection(row)
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const excludeInx = [0, 1, 3, 4, 5, 6, 10, 11]
      columns.forEach((column, index) => {
        if (excludeInx.includes(index)) {
          return
        }
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
        }
      })
      sums.forEach((sum, index) => {
        let npre = 2
        if (index === 8) {
          npre = this.$store.getters.numPre
        }
        if (typeof sum === 'number') {
          sums[index] = this.$options.filters.forThousands(sum, npre)
        }
      })
      return sums
    }
  }
}
</script>

<style scoped>
</style>
