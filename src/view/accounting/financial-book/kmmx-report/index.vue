<!--科目明细账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <selfhead :routerParam.sync="routerParam" ref="selfhead" @query="query" ></selfhead>
          <span style = "display:inline-block;margin-left: 20px" v-show="singlekmname!=null && singlekmname.length>0">名称:{{singlekmname}}</span>
        </div>
        <div class="kj-button-group">
          <el-dropdown @command="printSelect" >
            <el-button @click="print" >
              打印当前<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="printall">打印全部</el-dropdown-item>
              <el-dropdown-item command="printcover">打印封皮</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="excelAll">
            <el-button @click="exportReport" >
              导出当前<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="excelall">导出全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <tablebwb  ref="tablebwb" :key="'tablebwb'" :nodename="nodename" :routerParam.sync="routerParam" v-if="!bxswbtable"  :alltabledata="alltableData" :treedata="treedata"  :loading="loading" @updatesinglekmname="updatesinglekmname"></tablebwb>
      <tablewb ref="tablewb" :key="'tablewb'" :nodename="nodename"  :routerParam.sync="routerParam" v-if="bxswbtable" :alltabledata="alltableData" :treedata="treedata" :loading="loading"></tablewb>
    </div>
    <print-dialog ref="printdialog" :enddate ="queryparam.enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
    <print-cover-dialog ref="printCoverdialog" :nodename="nodename" :corpid="queryparam.corpIds"
                        @confirmPrint="confirmPrintCover" :corpname="corpname"></print-cover-dialog>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import PrintDialog from '@/components/Report/PrintDialog'
import selfhead from '@/view/accounting/financial-book/kmmx-report/components/head'
import tablebwb from '@/view/accounting/financial-book/kmmx-report/components/table_bwb'
import tablewb from '@/view/accounting/financial-book/kmmx-report/components/table_wb'
import PrintCoverDialog from '@/components/Report/PrintCoverDialog'
export default {
  name: 'kmmx-report',
  props: {
    routerParam: {
      type: Object
    }
  },
  components: {
    PrintCoverDialog,
    BackToTop,
    PrintDialog,
    selfhead,
    tablewb,
    tablebwb
  },
  data: function () {
    return {
      nodename: '科目明细账',
      bxswbtable: false,
      alltableData: [],
      treedata: [],
      loading: false,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      queryparam: {
      },
      corpname: '',
      singlekmname: '',
      printselect: '',
      dialogVisible: false // 打印封皮，公司选择对话框
    }
  },
  methods: {
    query (formParam) {
      this.queryparam = formParam
      this.loading = true
      if (this.queryparam.pk_currency && this.queryparam.pk_currency !== 'zhbwb' && this.queryparam.pk_currency !== '00000100AA10000000000BKT') {
        this.bxswbtable = true
      } else {
        this.bxswbtable = false
      }
      this.corpname = this.queryparam.corpobj.uname
      this.$api.kmmxReport.query(Object.assign(this.queryparam)).then(result => {
        this.loading = false
        if (result.success) {
          if (this.bxswbtable === false) {
            this.$refs.tablebwb.setDefaultIds()
          } else {
            this.$refs.tablewb.setDefaultIds()
          }

          this.alltableData = result.rows
          this.total = result.total
          this.treedata = result.righttree
        } else {
          this.$message({showClose: true, message: result.msg, type: 'warning'})
          this.alltableData = []
          this.total = 0
          this.treedata = []
        }
      }).catch(e => {
        this.loading = false
      })
    },
    updatesinglekmname (value) {
      this.singlekmname = value
    },
    print () {
      if (this.alltableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.printselect = 'print_curr'
      this.$refs.printdialog.show()
    },
    printSelect (tt) {
      if (tt === 'printall') {
        this.printselect = 'print_all'
        this.printAll()
      } else if (tt === 'printcover') {
        this.printselect = 'print_cover'
        this.printCover()
      }
    },
    printAll () {
      if (this.alltableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    // 确定打印封皮
    confirmPrintCover (val) {
      const otherprintparam = {

      }
      this.$api.kmmxReport.printCoverPdf(this.nodename, Object.assign(val, otherprintparam))
    },
    printCover () {
      if (this.alltableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printCoverdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.$refs.selfhead.qrydate,
        corpName: this.queryparam.corpobj.uname,
        currkmbm: this.printselect === 'print_all' ? 'all' : this.getSelectids()
      }
      this.$api.kmmxReport.printPdf(this.nodename, Object.assign(this.queryparam, val, otherprintparam))
    },
    getExportRows () {
      const titlePeriod = this.queryparam.periodRange[0] + '至' + this.queryparam.periodRange[1]
      const exportRows = []
      this.alltableData.forEach(data => {
        const exportData = Object.assign({}, data)
        exportData.titlePeriod = titlePeriod
        exportData.gs = this.corpname
        exportRows.push(exportData)
      })
      return exportRows
    },
    filterQueryParam (queryparam) {
      return queryparam
    },
    // 导出全部
    excelAll () {
      if (this.alltableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      const qrydate = this.queryparam.periodRange[0] + '至' + this.queryparam.periodRange[0]
      this.$api.kmmxReport.expExcel(this.nodename, Object.assign(this.queryparam, {titleperiod: qrydate, corpName: this.queryparam.corpobj.uname, currkmbm: 'all'}))
    },
    // 导出当前
    exportReport () {
      if (this.alltableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      const currselectstr = this.getSelectids()
      const qrydate = this.queryparam.periodRange[0] + '至' + this.queryparam.periodRange[0]
      this.$api.kmmxReport.expExcel(this.nodename, Object.assign(this.queryparam, {titleperiod: qrydate, corpName: this.queryparam.corpobj.uname, currkmbm: currselectstr}))
    },
    getSelectids () {
      let currselectids = null
      if (this.bxswbtable) {
        currselectids = this.$refs.tablewb.currselectids
        if (currselectids == null || currselectids.length === 0) {
          currselectids = [this.$refs.tablewb.defaultcurrid]
        }
      } else {
        currselectids = this.$refs.tablebwb.currselectids
        if (currselectids == null || currselectids.length === 0) {
          currselectids = [this.$refs.tablebwb.defaultcurrid]
        }
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

</style>
