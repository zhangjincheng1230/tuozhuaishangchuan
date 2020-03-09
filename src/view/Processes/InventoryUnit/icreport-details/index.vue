<template>
  <div class="app-main">
    <div class="kj-container">
      <div class = "kj-head">
        <div class="query-info">
          <div style = "display: inline-flex;">
            <div style="margin-left: 5px">期间：
              <el-popover
                placement="bottom-start"
                title="库存明细账查询"
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
          <el-dropdown @command="printAll">
            <el-button @click="printCurr">
              打印当前<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="printall">打印全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="excelAll">
            <el-button @click="excelCurr" >
              导出当前<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="excelall">导出全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
        <BodyTable ref="bodyTable"  :alltabledata="alltabledata" :loading="loading" :treedata="treedata" @updatetotal="updatetotal" @updatesinglekmname="updatesinglekmname"
                  @updatecurrdata="updatecurrdata"></BodyTable>
    </div>
    <!-- 打印对话框 -->
    <PrintDataDialog ref="printdialog" :visible.sync="dialogPrintFormVisible" :title="dialogPrintFormTitle"  :nodename="nodename" @getPrint="setPrint"  @confirmPrint="confirmPrint"></PrintDataDialog>
  </div>
</template>

<script>
import PrintDataDialog from '../component/PrintDataDialog'
import Pagination from '@/components/Pagination'
import QueryParam from './components/QueryParam'
import BodyTable from './components/BodyTable'
export default {
  name: 'icreport-details',
  components: {
    Pagination,
    PrintDataDialog,
    QueryParam,
    BodyTable
  },
  props: {
    routerParam: {
      type: Object
    }
  },
  data () {
    return {
      nodename: '库存明细账',
      alltabledata: [],
      qrydate: this.$store.getters.getLoginDate,
      queryVisible: false,
      loading: false,
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      dialogPrintFormVisible: false,
      dialogPrintFormTitle: '打印',
      total: 0,
      treedata: [],
      currtabledata: [],
      pageInfo: {
        page: 1,
        rows: 1000000
      },
      issinglekmsel: 'false',
      allprint: false
    }
  },
  created () {
  },
  watch: {
    routerParam: {
      handler (data) {
        if (data) {
          if (!this.$_.isEmpty(this.$refs.queryForm)) {
            this.init()
            this.fetchData()
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
    this.fetchData()
  },
  computed: {
  },
  methods: {
    init () {
      if (!this.$_.isEmpty(this.routerParam)) {
        if (this.routerParam.hasOwnProperty('id') && this.routerParam.id === 'kchzb') {
          this.$refs.queryForm.queryFormData.pk_inventory = this.routerParam.pk_inventory
          this.$refs.queryForm.queryFormData.periodRange[0] = this.routerParam.queryParam.beginPeriod
          this.$refs.queryForm.queryFormData.periodRange[1] = this.routerParam.queryParam.endPeriod
        }
      }
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
    fetchData () {
      this.loading = true
      const param = this.getParam()
      this.$api.InventoryManageApi.IcreportDetails.queryData(param).then(result => {
        this.loading = false
        this.queryVisible = false
        if (result.success) {
          this.$refs.bodyTable.setDefaultIds(this.$refs.bodyTable.currselectids)
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
      this.$api.InventoryManageApi.IcreportDetails.printRows(Object.assign(param, {titlePeriod: this.qrydate, gs: this.corpName, currsp: currsp}))
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
      this.$api.InventoryManageApi.IcreportDetails.expExcel(Object.assign(param, {titlePeriod: this.qrydate, gs: this.corpName, currsp: currsp}))
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
