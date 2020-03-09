<template>
  <div class="app-main">
    <div class="kj-container">
      <div class = "kj-head">
        <div class="query-info">
          <!--查询对话框-->
          <queryhead ref="queryhead" @query="query"></queryhead>
          <span class="query-corp" :title="corpName">公司:{{corpName}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="excelexport">导出</el-button>
          <el-button @click="linkXjllQc">现金流量期初</el-button>
        </div>
      </div>
      <bodytable ref="bodytable_ref" :tabledata="bodytable.tabledata" :loading="bodytable.loading" :jd="formParam.jd"  class="kj-main"></bodytable>
    </div>
    <!-- 打印对话框 -->
    <print-dialog ref="printdialog" :enddate ="enddate" :bshowDir="false"
                  :defaultleft="5" :defaulttop="40"
                  :periodrange="periodRange" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
    <!--导出对话框-->
    <excel-export-dialog ref="excelExportdialog" :excelselTemp ="excelselTemp"  @confirmExcelExport="confirmExcelExport"></excel-export-dialog>
  </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import ExcelExportDialog from '@/components/Report/ExcelDialog'
import bodytable from '@/view/accounting/financial-report/xjlljb-report/component/bodytable'
import queryhead from '@/view/accounting/financial-report/xjlljb-report/component/queryhead'
import { getMonthEnd } from '@/utils'
export default {
  name: 'xjlljb-report',
  components: {
    PrintDialog,
    bodytable,
    queryhead,
    ExcelExportDialog
  },
  data () {
    return {
      nodename: '现金流量季报',
      corpName: this.$store.getters.currentCorp.uname,
      bodytable: {
        tabledata: [],
        loading: false
      },
      defaultPeriod: this.$store.getters.getLoginDate.substr(0, 7),
      formParam: { },
      periodRange: [],
      excelselTemp: [{
        value: 0,
        label: '当前季度EXCEL格式'
      }]
    }
  },
  computed: {
    // defaultPeriod () {
    //   return this.$store.getters.getLoginDate.substr(0, 7)
    // },
    enddate () {
      return getMonthEnd(this.formParam.year + '-' + this.formParam.jd)
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
    // 现金流量期初
    linkXjllQc () {
      this.$router.push({
        name: 'xjll-qc',
        params: {
        }
      })
    },
    query (formParam) {
      this.bodytable.loading = true
      this.formParam = formParam
      this.corpName = this.formParam.corpName
      this.$api.xjlljbReport.query(this.formParam).then(result => {
        if (result.success) {
          this.$refs.bodytable_ref.setBshowzero(this.formParam.bshowzero)
          this.bodytable.tabledata = result.rows
        } else {
          this.bodytable.tabledata = []
          this.$message({showClose: true, message: result.msg, type: 'warning'})
        }
        this.bodytable.loading = false
      }).catch(e => {
      })
    },
    print () {
      if (this.bodytable.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.$refs.queryhead.queryqj,
        corpName: this.formParam.corpobj.uname,
        list: JSON.stringify(this.bodytable.tabledata),
        currjd: this.switchval ? this.formParam.jd : ''
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + this.$refs.queryhead.queryqj
      this.$api.xjlljbReport.printPdf(filename, Object.assign({}, this.formParam, val, otherprintparam))
    },
    excelexport () {
      if (this.bodytable.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.excelExportdialog.show()
    },
    // 确认导出
    confirmExcelExport (excelselect) {
      const excelparam = {
        excelsel: excelselect + '',
        corpName: this.corpName,
        titleperiod: this.$refs.queryhead.queryqj
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + this.$refs.queryhead.queryqj
      this.$api.xjlljbReport.expExcel(filename, Object.assign({}, {
        list: JSON.stringify(this.bodytable.tabledata)
      }, this.formParam, excelparam))
    },
    getExportRows () {
    }
  }
}
</script>

<style scoped>
</style>
