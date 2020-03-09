<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                    <queryhead  ref="queryhead" @query="query"> </queryhead>
                    <span class="query-corp" :title="corpName">公司:{{corpName}}</span>
                    <span class="query-corp" :title="fzlbname">项目类别:{{fzlbname}}</span>
                    <span class="query-corp" :title="fzxmname">项目名称:{{fzxmname}}</span>
                </div>
                <div class="kj-button-group">
                    <el-button @click="print">打印</el-button>
                    <el-button @click="excelexport">导出</el-button>
                </div>
            </div>
          <!--table-->
          <bodytable ref="bodytable_ref"  :tabledata="bodytable.tabledata" :loading="bodytable.loading" :formParam="formParam"></bodytable>
        </div>
      <!-- 打印对话框 -->
      <print-dialog ref="printdialog" :enddate ="enddate"
                    :printdatescope="true" :bshowDir="false"
                    :defaultleft="5" :defaulttop="40"
                    :periodrange="periodrange" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>

      <!--导出对话框-->
      <excel-export-dialog ref="excelExportdialog" :excelselTemp ="excelselTemp"  @confirmExcelExport="confirmExcelExport"></excel-export-dialog>
    </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import ExcelExportDialog from '@/components/Report/ExcelDialog'
import bodytable from '@/view/accounting/financial-report/lrb-center-report/components/bodytable'
import queryhead from '@/view/accounting/financial-report/lrb-center-report/components/queryhead'
import { getMonthBegin, getMonthEnd, formatDate } from '@/utils'
export default {
  name: 'lrb-center-report',
  components: {
    PrintDialog,
    queryhead,
    bodytable,
    ExcelExportDialog
  },
  data () {
    return {
      nodename: '分部利润表',
      corpName: this.$store.getters.currentCorp.uname,
      formParam: {},
      bodytable: {
        tabledata: [],
        loading: false
      },
      excelselTemp: [{
        value: 0,
        label: '当前月份EXCEL格式'
      }, {
        value: 1,
        label: '当前年度EXCEL格式'
      }],
      fzlbname: '',
      fzxmname: '',
      corpIds: this.$store.getters.corps,
      periodrange: []
    }
  },
  computed: {
    defaultPeriod () {
      return this.$store.getters.getLoginDate.substr(0, 7)
    },
    enddate () {
      return getMonthEnd(this.formParam.qjq)
    }
  },
  created () {
    // this.query()
  },
  methods: {
    query (formParam) {
      if (formParam.xmmcid == null || formParam.xmmcid.length === 0) {
        this.$message({ showClose: true, message: '辅助项目不能为空', type: 'warning' })
        return
      }
      if (formParam.xmlbid == null || formParam.xmlbid.length === 0) {
        this.$message({ showClose: true, message: '辅助类别不能为空', type: 'warning' })
        return
      }
      this.bodytable.loading = true
      this.formParam = formParam
      this.corpName = this.formParam.corpName
      this.periodrange = [this.formParam.qjq, this.formParam.qjq]
      this.$api.LrbCenterReport.query(this.formParam).then(result => {
        if (result.success) {
          this.$refs.bodytable_ref.setBshowzero(this.formParam.bshowzero)
          this.bodytable.tabledata = result.rows
          this.fzlbname = this.formParam.fzlbobj.name
          this.fzxmname = this.formParam.fzxmobj.name
        } else {
          this.bodytable.tabledata = []
          this.$message({ showClose: true, message: result.msg, type: 'warning' })
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
    excelexport () {
      if (this.bodytable.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.excelExportdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.$refs.queryhead.queryqj,
        corpName: this.formParam.corpobj.uname,
        list: JSON.stringify(this.bodytable.tabledata),
        begindate: getMonthBegin(val.periodrange[0]),
        enddate: getMonthEnd(val.periodrange[1])
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      this.$api.LrbCenterReport.printPdf(filename, Object.assign({}, this.formParam, val, otherprintparam))
    },
    // 确认导出
    confirmExcelExport (excelselect) {
      const excelparam = {
        excelsel: excelselect + '',
        startYear: this.formParam.qjq.substring(0, 4),
        startMonth: this.formParam.qjq.substring(5, 7),
        corpName: this.corpName,
        titleperiod: getMonthEnd(this.formParam.qjq)
      }
      let filename = this.getFileNameFormExcel(excelselect)
      this.$api.LrbCenterReport.expExcel(filename, Object.assign({}, {
        list: JSON.stringify(this.bodytable.tabledata)
      }, this.formParam, excelparam))
    },
    getFileNameFormExcel (excelselect) {
      let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      if (excelselect === 1) {
        let begperiod = ''
        // let endperiod = getMonthEnd(this.formParam.qjq)
        let endperiod = getMonthEnd(this.formParam.qjq.substring(0, 4) + '-12')
        if (this.formParam.qjq.substring(0, 4) === this.formParam.corpobj.bdate.substring(0, 4)) {
          begperiod = getMonthBegin(this.formParam.corpobj.bdate.substring(0, 7))
        } else {
          begperiod = getMonthBegin(this.formParam.qjq.substring(0, 4) + '-01')
        }
        filename = this.nodename + '(' + this.corpName + ')-(' + formatDate(begperiod, 'YYYYMMDD') + '-' + formatDate(endperiod, 'YYYYMMDD') + ')'
      }
      return filename
    }
  }
}
</script>

<style scoped>

</style>
