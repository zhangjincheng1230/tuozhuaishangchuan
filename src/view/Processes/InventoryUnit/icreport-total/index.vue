<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div style = "display: inline-flex;">
            <div style="margin-left: 5px">期间：
              <el-popover
                placement="bottom-start"
                title="库存汇总表查询"
                width="390"
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
          <el-button  style="margin-left:10px" @click="print">打印</el-button>
          <el-button  style="margin-left:10px" @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="sortedData"
            highlight-current-row
            @current-change="handleListRowSelect"
            @selection-change="handleListRowSelection"
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
            show-summary
            :summary-method="getSummaries"
            stripe
            border
            height="100%"
            ref="tableRef"
            style="width: 100%">
            <el-table-column label="序号" type="index" fixed width="50"> </el-table-column>
            <el-table-column  prop="spbm" label="存货编码" align="left" fixed width="100">
              <template slot-scope="scope">
              <span @click="lcData(scope.row)"
                      class="spanlink" >{{scope.row.spbm}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="spmc" label="存货名称" header-align="center" align="left"  show-overflow-tooltip  fixed width="120"> </el-table-column>
            <el-table-column prop="spgg" label="规格(型号)" header-align="center" align="left" show-overflow-tooltip   fixed width="120"> </el-table-column>
            <el-table-column prop="jldw" label="计量单位" header-align="center" align="left" width="80"> </el-table-column>
            <el-table-column label="期初" header-align="center">
              <TableColumnPre prop="qcsl" label="数量" :pretype = 3></TableColumnPre>
              <TableColumnPre prop="qcdj" label="单价" :pretype = 2></TableColumnPre>
              <TableColumnPre prop="qcje" label="金额" ></TableColumnPre>
            </el-table-column>
            <el-table-column label="收入" header-align="center">
              <TableColumnPre prop="srsl" label="数量" :pretype = 3></TableColumnPre>
              <TableColumnPre prop="srdj" label="单价" :pretype = 2></TableColumnPre>
              <TableColumnPre prop="srje" label="金额" ></TableColumnPre>
            </el-table-column>
            <el-table-column label="出库" header-align="center">
              <TableColumnPre prop="fcsl" label="数量" :pretype = 3></TableColumnPre>
              <TableColumnPre prop="fcdj" label="单价" :pretype = 2></TableColumnPre>
              <TableColumnPre prop="fcje" label="金额" ></TableColumnPre>
            </el-table-column>
            <el-table-column label="结存" header-align="center">
              <TableColumnPre prop="jcsl" label="数量" :pretype = 3></TableColumnPre>
              <TableColumnPre prop="jcdj" label="单价" :pretype = 2></TableColumnPre>
              <TableColumnPre prop="jcje" label="金额" ></TableColumnPre>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination  :total="total"  :page.sync="pageInfo.page"  :limit.sync="pageInfo.rows"  @pagination="fetchData" ></Pagination>
        </div>
      </div>
      <PrintDataDialog ref="printdialog" :visible.sync="dialogPrintFormVisible" :title="dialogPrintFormTitle"  :nodename="nodename" @getPrint="setPrint"  @confirmPrint="confirmPrint">
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
  name: 'icreport-total',
  components: {
    QueryParam,
    Pagination,
    TableColumnPre,
    PrintDataDialog
  },
  data () {
    return {
      nodename: '库存汇总表',
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
      qrydate: this.$store.getters.getLoginDate,
      dialogPrintFormVisible: false,
      dialogPrintFormTitle: '打印'
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData)
      // return orderBy(this.tableData, v => v.spbm)
    }
  },
  created () {
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  },
  mounted: function mounted () {
    this.fetchData()
  },
  methods: {
    getParam () {
      let param = this.$refs.queryForm.getQueryParam()
      if (param !== false) {
        this.qrydate = param.beginPeriod + '至' + param.endPeriod
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
      this.saveSetting()
      this.queryVisible = false
    },
    fetchData () {
      this.loading = true
      const param = this.getParam()
      this.queryParam = param
      this.$api.InventoryManageApi.IcreportTotal.query(param).then(result => {
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
    lcData (rowdata) {
      if (rowdata) {
        if (!this.$hasPermission('voucher-edit')) {
          return
        }
        this.$router.push({
          name: 'icreport-details',
          params: {
            routerParam: {
              id: 'kchzb',
              pk_inventory: rowdata.pk_sp,
              queryParam: this.queryParam
            }
          }
        })
      }
    },
    setPrint (param) {
      this.$refs.queryForm.queryFormData.xsyye = param.isxsyye
    },
    // 保存设置
    saveSetting () {
      this.$refs.printdialog.saveSettingMsg(this.$refs.queryForm.queryFormData.xsyye)
    },
    print () {
      if (this.tableData && this.tableData.length > 0) {
        this.dialogPrintFormVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
      }
    },
    confirmPrint (printData) {
      if (this.tableData && this.tableData.length > 0) {
        const exportRows = []
        this.tableData.forEach(data => {
          const exportData = Object.assign({}, data)
          exportData.titlePeriod = this.qrydate
          exportData.gs = this.$store.getters.currentCorp.uname
          exportData.isPaging = 'N'
          exportRows.push(exportData)
        })
        let param = {'list': JSON.stringify(exportRows),
          print_curr: false,
          begindate: this.queryParam.beginPeriod + '-01',
          enddate: this.queryParam.endPeriod + '-01',
          xmlbid: this.queryParam.xmlbid,
          isqry: 'Y',
          pk_inventory: this.queryParam.pk_inventory,
          isfenye: this.queryParam.isfenye}
        param = Object.assign(param, printData)
        this.$api.InventoryManageApi.IcreportTotal.print(param)
      } else {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
      }
      this.dialogPrintFormVisible = false
    },
    exportReport () {
      if (this.tableData && this.tableData.length > 0) {
        const exportRows = []
        this.tableData.forEach(data => {
          const exportData = Object.assign({}, data)
          exportData.titlePeriod = this.qrydate
          exportData.gs = this.$store.getters.currentCorp.uname
          exportRows.push(exportData)
        })

        const param = {'list': JSON.stringify(exportRows),
          export_curr: false,
          begindate: this.queryParam.beginPeriod + '-01',
          enddate: this.queryParam.endPeriod + '-01',
          xmlbid: this.queryParam.xmlbid,
          isqry: 'Y',
          pk_inventory: this.queryParam.pk_inventory}
        this.$api.InventoryManageApi.IcreportTotal.expExcel(param)
      } else {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
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
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const excludeInx = [0, 1, 3, 4, 6, 9, 12, 15, 18]
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
        if (index === 5 || index === 8 || index === 11 || index === 14) {
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
