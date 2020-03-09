<template>
  <div class="app-main">
    <div class="kj-container">
      <div class = "kj-head">
        <div class="query-info">
          <div style = "display: inline-flex;">
            <div style="margin-left: 5px">期间：
              <el-popover
                placement="bottom-start"
                title="毛利率统计表查询"
                width="390"
                popper-class="query-popover"
                v-model="queryVisible">
                <QueryParam ref="queryForm" :isDetailjz ="isDetailjz" @query="fetchData"> </QueryParam>
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
          <el-button @click="print">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
        <BodyTable ref="bodyTable"  :isDetailjz ="isDetailjz" :alltabledata="alltabledata" :loading="loading" :treedata="treedata" @updatetotal="updatetotal" @updatesinglekmname="updatesinglekmname"
                  @updatecurrdata="updatecurrdata"></BodyTable>
    </div>
    <!-- 打印对话框 -->
    <PrintDataDialog ref="printdialog" :visible.sync="dialogPrintFormVisible" :title="dialogPrintFormTitle"  :nodename="nodename" @getPrint="setPrint"  @confirmPrint="confirmPrint"></PrintDataDialog>
  </div>
</template>

<script>
import PrintDataDialog from '../components/PrintDataDialog'
import Pagination from '@/components/Pagination'
import QueryParam from './components/QueryParam'
import BodyTable from './components/BodyTable'
import refreshDataMixin from '@/mixins/refresh-data'
export default {
  name: 'gross-profit',
  mixins: [refreshDataMixin],
  components: {
    Pagination,
    PrintDataDialog,
    QueryParam,
    BodyTable
  },
  data () {
    return {
      nodename: '出入库明细表',
      alltabledata: [],
      qrydate: this.$store.getters.getLoginDate,
      queryVisible: false,
      queryparam: {},
      loading: false,
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      dialogPrintFormVisible: false,
      dialogPrintFormTitle: '打印',
      total: 0,
      treedata: [],
      currtabledata: [],
      chcbjzfs: 0,
      pageInfo: {
        page: 1,
        rows: 1000000
      },
      allprint: false
    }
  },
  created () {
  },
  computed: {
    isDetailjz () {
      return this.chcbjzfs === 1
    },
    currendata () {
      return this.$refs.bodyTable.currentabledata
    }
  },
  mounted () {
    this.initInventoryCBJZ()
  },
  methods: {
    refreshData () {
      this.initInventoryCBJZ()
      this.fetchData('Y')
    },
    initInventoryCBJZ () {
      this.$api.GeneralInventoryApi.InventoryDoc.querySetting().then(result => {
        if (result.success) {
          this.chcbjzfs = result.rows.chcbjzfs
        }
      }).catch(e => {
      })
    },
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
      this.queryVisible = false
    },
    fetchData (unjl) {
      this.loading = true
      this.queryparam = this.getParam()
      this.queryparam.unjl = unjl
      this.$api.GeneralInventoryApi.GrossProfit.query(this.queryparam).then(result => {
        this.loading = false
        this.queryVisible = false
        if (result.success) {
          this.$refs.bodyTable.setDefaultIds()
          this.tableData = result.rows
          this.total = result.total
          this.alltabledata = result.rows === undefined ? [] : result.rows
          this.total = result.total
          this.treedata = result.iccombox === undefined ? [] : result.iccombox
        } else {
          this.$message({showClose: true, message: result.msg, type: 'error'})
        }
      }).catch(e => {
        this.loading = false
      })
    },
    updatetotal (total) {
      this.total = total
    },
    updatesinglekmname (val) {
    },
    updatecurrdata (val) {
      this.currtabledata = val
    },
    setPrint (param) {
    },
    print () {
      if (this.currendata && this.currendata.length > 0) {
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
      if (this.currendata && this.currendata.length > 0) {
        const titlePeriod = this.queryparam.begindate.substring(0, 7) + '至' + this.queryparam.enddate.substring(0, 7)
        const exportRows = []
        this.currendata.forEach(data => {
          const exportData = Object.assign({}, data)
          exportData.titlePeriod = titlePeriod
          exportData.gs = this.$store.getters.currentCorp.uname
          exportData.isPaging = 'N'
          exportRows.push(exportData)
        })
        let param = {
          'list': JSON.stringify(exportRows),
          begindate: this.queryparam.begindate,
          enddate: this.queryparam.enddate,
          classif: this.isDetailjz,
          'isqry': 'Y'
        }
        param = Object.assign(param, printData)
        this.$api.GeneralInventoryApi.GrossProfit.printPdf(param)
      } else {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
      }
      this.dialogPrintFormVisible = false
    },
    filterQueryParam (queryparam) {
      return queryparam
    },
    exportReport () {
      if (this.currendata && this.currendata.length > 0) {
        const titlePeriod = this.queryparam.begindate.substring(0, 7) + '至' + this.queryparam.enddate.substring(0, 7)
        const exportRows = []
        this.currendata.forEach(data => {
          const exportData = Object.assign({}, data)
          exportData.titlePeriod = titlePeriod
          exportData.gs = this.$store.getters.currentCorp.uname
          exportRows.push(exportData)
        })
        const param = {
          'list': JSON.stringify(exportRows),
          begindate: this.queryparam.begindate,
          enddate: this.queryparam.enddate,
          classif: this.isDetailjz,
          'isqry': 'Y'
        }
        this.$api.GeneralInventoryApi.GrossProfit.exportExcel(param)
      } else {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
