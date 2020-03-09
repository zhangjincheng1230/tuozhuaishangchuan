<!--现金/银行日记账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <selfhead ref="selfhead" :page-info="pageInfo" @query="query" ></selfhead>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <tablebwb  :tabledata="tableData" :loading="loading"></tablebwb>
        <!--<tablebwb  v-show="bxswbtable == false"  :tabledata="tableData" :loading="loading"></tablebwb>-->
        <!--<tablewb v-show="bxswbtable == true" :tabledata="tableData" :loading="loading"></tablewb>-->
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="fetchData" :pageSizes.sync="pageInfo.pageSizes"  ></Pagination>
        </div>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <print-dialog ref="printdialog" :enddate ="queryparam.enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import Pagination from '@/components/Pagination/index'
import PrintDialog from '@/components/Report/PrintDialog'
import selfhead from '@/view/accounting/financial-book/xjyhrjz-report/components/head'
import tablebwb from '@/view/accounting/financial-book/xjyhrjz-report/components/table_bwb'
import tablewb from '@/view/accounting/financial-book/xjyhrjz-report/components/table_wb'
export default {
  name: 'xjyhrjz-report',
  components: {
    BackToTop,
    Pagination,
    PrintDialog,
    selfhead,
    tablewb,
    tablebwb
  },
  data: function () {
    return {
      nodename: '现金/银行日记账',
      bxswbtable: false,
      tableData: [],
      loading: false,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      queryparam: {},
      corpname: ''
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
      this.$api.xjyhrjzReport.query(Object.assign(this.queryparam, this.pageInfo)).then(result => {
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
        } else {
          this.$message({showClose: true, message: result.msg, type: 'warning'})
          this.tableData = []
          this.total = 0
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    fetchData () {
      this.$refs.selfhead.query()
    },
    print () {
      if (this.tableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.$refs.selfhead.qrydate,
        corpName: this.queryparam.corpobj.uname
      }
      this.$api.xjyhrjzReport.printPdf(this.nodename, Object.assign(this.queryparam, val, otherprintparam))
    },
    filterQueryParam (queryparam) {
      return queryparam
    },
    exportReport () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      const qrydate = this.queryparam.periodRange[0] + '至' + this.queryparam.periodRange[1]
      this.$api.xjyhrjzReport.expExcel(this.nodename, Object.assign(this.queryparam, {titleperiod: qrydate, corpName: this.queryparam.corpobj.uname}))
    }
  }
}
</script>

<style scoped>

</style>
