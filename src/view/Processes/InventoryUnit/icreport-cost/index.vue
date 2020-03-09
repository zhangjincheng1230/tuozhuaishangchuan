<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div style = "display: inline-flex;">
            <div style="margin-left: 5px">期间：
              <el-popover
                placement="bottom-start"
                title="库存成本表查询"
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
          <el-button v-if="isIc" @click="adjustGoods">调整库存</el-button>
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
            <el-table-column label="序号" type="index" width="50"> </el-table-column>
            <el-table-column prop="spbm"  header-align="center" align="left" label="存货编码" width="100"> </el-table-column>
            <el-table-column prop="spmc"   header-align="center" align="left"  label="存货名称" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="gg"  header-align="center" align="left" show-overflow-tooltip label="规格(型号)" width="120"> </el-table-column>
            <el-table-column  prop="jldwmc"   header-align="center" align="left" label="计量单位"  width="80"> </el-table-column>
            <el-table-column prop="splxmc"  header-align="center" align="left" label="存货分类"  width="100"></el-table-column>
            <el-table-column prop="kmmc"  header-align="center" align="left" show-overflow-tooltip label="科目名称" width="100"> </el-table-column>
            <TableColumnPre prop="sl" label="结存数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="dj" label="结存单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="cb" label="结存成本" ></TableColumnPre>
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
  name: 'icreport-cost',
  components: {
    QueryParam,
    Pagination,
    PrintDataDialog,
    TableColumnPre
  },
  data () {
    return {
      nodename: '库存成本表',
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
    },
    isIc: {
      get () {
        if (this.$store.getters.currentCorp.buildic === '1') { // 启用进销存
          if (this.$store.getters.currentCorp.buildicstyle !== 1) {
            return true
          }
        }
        return false
      }
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
        this.qrydate = param.djrqa
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
      this.$api.InventoryManageApi.IcreportCost.queryData(param).then(result => {
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
    adjustGoods () {
      if (this.listCurrentRow) {
      } else {
        this.$message({showClose: true, message: '请选择一条记录进行库存调整！', type: 'warning'})
        return
      }
      let qj = this.queryParam.djrqa.substring(0, 7)
      const beginDate = qj + '-01'
      let routeParam = {routeParam: {begindate: beginDate, enddate: this.queryParam.djrqa, gsname: this.$store.getters.currentCorp.uname, corpIds: this.$store.getters.currentCorp.pk_gs, fzhsxm: this.listCurrentRow.spid, fzhslb: '6', source: 'kccbb'}}
      this.$router.push({name: 'voucher-manage', params: routeParam})
    },
    setPrint (param) {
      this.$refs.queryForm.queryFormData.xsyye = param.isxsyye
    },
    // 保存设置
    saveSetting () {
      this.$refs.printdialog.formDialogData.isxsyye = this.$refs.queryForm.queryFormData.xsyye
      this.$refs.printdialog.saveSettingMsg()
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
          exportData.djrq = this.qrydate
          exportData.gs = this.$store.getters.currentCorp.uname
          exportRows.push(exportData)
        })
        let param = {'list': JSON.stringify(exportRows),
          curr_excel: false,
          djrqa: this.queryParam.djrqa,
          spid: this.queryParam.spid,
          kmmc: this.queryParam.kmmc,
          xsyye: this.queryParam.xsyye}
        param = Object.assign(param, printData)
        this.$api.InventoryManageApi.IcreportCost.printData(param)
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
          exportData.djrq = this.qrydate
          exportData.gs = this.$store.getters.currentCorp.uname
          exportRows.push(exportData)
        })
        const param = {'list': JSON.stringify(exportRows),
          curr_excel: false,
          djrqa: this.queryParam.djrqa,
          spid: this.queryParam.spid,
          kmmc: this.queryParam.kmmc,
          xsyye: this.queryParam.xsyye}
        this.$api.InventoryManageApi.IcreportCost.expExcel(param)
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
      const excludeInx = [0, 1, 3, 4, 5, 6]
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
        if (index === 7) {
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
