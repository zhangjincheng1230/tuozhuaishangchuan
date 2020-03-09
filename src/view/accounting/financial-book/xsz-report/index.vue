<!--序时账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <xszhead ref="xszhead" :page-info="pageInfo"
                   @updateloading="updateloading" @updatetabledata="updatetabledata" @updatetotal="updatetotal"
                   @updatequeryparam="updatequeryparam" ></xszhead>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <xsztale  v-show="bxswbtable == false"  :tabledata="tableData" :loading="loading"></xsztale>
        <xsztablewb v-show="bxswbtable == true" :tabledata="tableData" :loading="loading"></xsztablewb>
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
import xszhead from '@/view/accounting/financial-book/xsz-report/components/head'
import xsztale from '@/view/accounting/financial-book/xsz-report/components/table'
import xsztablewb from '@/view/accounting/financial-book/xsz-report/components/table_wb'
export default {
  name: 'xsz-report',
  components: {
    BackToTop,
    Pagination,
    PrintDialog,
    xszhead,
    xsztablewb,
    xsztale
  },
  data: function () {
    return {
      nodename: '序时账',
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
    updateloading (load) {
      this.loading = load
    },
    fetchData () {
      this.$refs.xszhead.query()
    },
    updatetabledata (data) {
      this.tableData = data
    },
    updatetotal (total) {
      this.total = total
    },
    updatequeryparam (queryparam) {
      this.bxswbtable = queryparam.isxshl
      this.corpname = queryparam.corpName
      const queryparamtemp = Object.assign({}, queryparam)
      Object.keys(queryparamtemp).forEach(function (key) {
        if (typeof (queryparamtemp[key]) === 'undefined') {
          queryparamtemp[key] = ''
        }
      })
      this.queryparam = queryparamtemp
      // this.filterQueryParam()
    },
    print () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.$refs.xszhead.qrydate,
        corpName: this.queryparam.corpobj.uname
      }

      this.$api.xszReport.printPdf(this.nodename, Object.assign(this.queryparam, val, otherprintparam))
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
      this.$api.xszReport.expExcel(this.nodename, Object.assign(this.queryparam, {titleperiod: this.$refs.xszhead.qrydate, corpName: this.queryparam.corpobj.uname}))
    }
  }
}
</script>

<style scoped>

</style>
