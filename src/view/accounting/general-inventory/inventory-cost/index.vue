<template>
  <div class="app-main">
    <div class="kj-container">
      <div class = "kj-head">
        <div class="query-info">
          <div style = "display: inline-flex;">
            <div style="margin-left: 5px">期间：
              <el-popover
                placement="bottom-start"
                title="库存成本表查询"
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
          <el-button @click="showzg">暂估</el-button>
          <el-button @click="adjustGoods">成本调整</el-button>
          <el-button @click="printAll">打印</el-button>
          <el-button @click="excelAll">导出</el-button>
        </div>
      </div>
        <BodyTable ref="bodyTable"  :isDetailjz ="isDetailjz" :alltabledata="alltabledata" :loading="loading" :treedata="treedata" @updatetotal="updatetotal" @updatesinglekmname="updatesinglekmname"
                  @updatecurrdata="updatecurrdata"></BodyTable>
    </div>
    <!-- 打印对话框 -->
    <PrintDataDialog ref="printdialog" :visible.sync="dialogPrintFormVisible" :title="dialogPrintFormTitle"  :nodename="nodename" @getPrint="setPrint"  @confirmPrint="confirmPrint"></PrintDataDialog>
    <ZgDialog :visible.sync="dialogVisible" :title="dialogTitle" :data="formData"></ZgDialog>
  </div>
</template>

<script>
import PrintDataDialog from '../components/PrintDataDialog'
import Pagination from '@/components/Pagination'
import QueryParam from './components/QueryParam'
import BodyTable from './components/BodyTable'
import ZgDialog from './components/ZgDialog'
import refreshDataMixin from '@/mixins/refresh-data'
export default {
  name: 'inventory-cost',
  mixins: [refreshDataMixin],
  components: {
    Pagination,
    PrintDataDialog,
    QueryParam,
    BodyTable,
    ZgDialog
  },
  data () {
    return {
      nodename: '库存成本表',
      alltabledata: [],
      qrydate: this.$store.getters.getLoginDate,
      queryparam: {},
      queryVisible: false,
      formData: {},
      loading: false,
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      dialogVisible: false,
      dialogTitle: '暂估',
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
      this.$api.GeneralInventoryApi.InventoryCost.query(this.queryparam).then(result => {
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
    showzg () {
      const params = {
        begindate: this.queryparam.begindate,
        enddate: this.queryparam.enddate,
        pk_inventory: this.queryparam.pk_inventory } // 是否需要更新缓存
      this.$api.GeneralInventoryApi.InventoryCost.showzg(params).then(result => {
        if (result.success) {
          if (result.rows != null && result.rows.length > 0) { // 暂估数据
            this.formData.zgcorpname = result.rows[0].gsname
            this.formData.zgqijianname = result.rows[0].period
            this.formData.rows = result.rows
            this.dialogVisible = true
          } else {
            this.$message({showClose: true, message: '没有暂估数据', type: 'warning'})
          }
        } else {
          this.$message({showClose: true, message: result.msg, type: 'error'})
        }
      }).catch(e => {
      })
    },
    adjustGoods () {
      const params = {period: this.queryparam.enddate.substring(0, 7)}
      this.$api.GeneralInventoryApi.InventoryCost.adjustKc(params).then(result => {
        if (result.success && result.head.id) {
          if (!this.$hasPermission('voucher-edit')) {
            return
          }
          this.$router.push({name: 'voucher-edit', params: {id: result.head.id}})
        } else {
          this.$message({showClose: true, message: result.msg, type: 'error'})
        }
      }).catch(e => {
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
    printCurr () {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.allprint = false
      this.dialogPrintFormVisible = true
    },
    printAll () {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.allprint = true
      this.dialogPrintFormVisible = true
    },
    confirmPrint (printData) {
      let param = this.getParam()
      let currsp = ''
      if (this.allprint) {
        currsp = 'all'
      } else {
        currsp = this.getSelectids()
      }
      param = Object.assign(param, printData)
      this.$api.GeneralInventoryApi.InventoryCost.printPdf(Object.assign(param, {titlePeriod: this.qrydate, gs: this.corpName, currsp: currsp}))
      this.dialogPrintFormVisible = false
    },
    // 导出全部
    excelAll () {
      this.expExcel('all')
    },
    // 导出当前
    excelCurr () {
      this.expExcel(this.getSelectids())
    },
    expExcel (currsp) {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      const param = this.getParam()
      this.$api.GeneralInventoryApi.InventoryCost.exportExcel(Object.assign(param, {titlePeriod: this.qrydate, gs: this.corpName, currsp: currsp}))
    },
    getSelectids () {
      let currselectids = this.$refs.bodyTable.currselectids
      if (currselectids === null || currselectids.length === 0) {
        currselectids = [this.$refs.bodyTable.defaultcurrid]
      }
      let currselectstr = ''
      if (currselectids && currselectids.length > 0) {
        currselectstr = currselectids.join(',')
      }
      return currselectstr
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
