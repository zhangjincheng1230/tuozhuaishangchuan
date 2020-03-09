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
                  <el-switch v-model="columnOrder" :active-value="'on'" :inactive-value="'off'" @change="saveSettingMsg"></el-switch>
                  {{ columnOrder === 'on' ? '"本月金额"': '"本年累计金额"'}}列在前&nbsp&nbsp
                  <el-button @click="print">打印</el-button>
                    <el-button @click="excelexport">导出</el-button>
                </div>
            </div>
          <bodytable ref="bodytable_ref" v-if="columnOrder === 'on'" :tabledata="bodytable.tabledata" :loading="bodytable.loading"
                     :formParam="formParam"></bodytable>
          <bodytablebn ref="bodytablebn_ref" v-else :tabledata="bodytable.tabledata" :loading="bodytable.loading"
                        :formParam="formParam"></bodytablebn>
        </div>
      <!-- 打印对话框 -->
      <print-dialog ref="printdialog" :enddate ="enddate" :periodrange="periodrange"
                    :printdatescope="true" :bshowDir="false"
                    :defaultleft="'5'" :defaulttop="'40'"
                    :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
      <!--导出对话框-->
      <excel-export-dialog ref="excelExportdialog" :excelselTemp ="excelselTemp"  @confirmExcelExport="confirmExcelExport"></excel-export-dialog>
    </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import ExcelExportDialog from '@/components/Report/ExcelDialog'
import queryhead from '@/view/accounting/financial-report/lrb-report/components/queryhead'
import bodytable from '@/view/accounting/financial-report/lrb-report/components/bodytable'
import bodytablebn from '@/view/accounting/financial-report/lrb-report/components/bodytable_bn'

import { getMonthBegin, getMonthEnd, formatDate } from '@/utils'
export default {
  name: 'lrb-report',
  components: {
    PrintDialog,
    ExcelExportDialog,
    queryhead,
    bodytable,
    bodytablebn
  },
  data () {
    return {
      nodename: '利润表',
      formParam: { },
      bodytable: {
        tabledata: [],
        loading: false
      },
      corpName: this.$store.getters.currentCorp.uname,
      excelselTemp: [{
        value: 0,
        label: '当前月份EXCEL格式'
      }, {
        value: 1,
        label: '当前年度EXCEL格式'
      }],
      periodrange: [],
      columnOrder: 'on' // 滑块
    }
  },
  computed: {
    enddate () {
      return getMonthEnd(this.formParam.qjq)
    }
  },
  created () {
    // 查询设置
    this.querySettingMsg()
  },
  methods: {
    // 保存设置
    saveSettingMsg () {
      const param = {
        nodename: this.nodename,
        print_setting1: JSON.stringify({'columnOrder': this.columnOrder}),
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        corpids: this.$store.getters.currentCorp.pk_gs,
        updatecolumn: 'print_setting1'
      }
      this.$api.printSetting.saveMulColumn(param).then(result => {
      }).catch(e => {
      })
    },
    // 查询报表设置
    querySettingMsg () {
      this.$api.printSetting.printQuerySetting(this.nodename, this.$store.getters.currentCorp.pk_gs).then(result => {
        if (result.success) {
          let printsetting = null
          let printsetting1 = null
          if (result.rows) {
            if (result.rows.print_setting) {
              printsetting = JSON.parse(result.rows.print_setting)
            }
            if (result.rows.print_setting1) {
              printsetting1 = JSON.parse(result.rows.print_setting1)
            }
          }
          if (printsetting1) {
            this.columnOrder = printsetting1['columnOrder']
          } else if (printsetting) { // 处理历史数据
            this.columnOrder = printsetting['columnOrder']
          }
        } else {
        }
      }).catch(e => {
      })
    },
    // 查询
    query (formParam) {
      this.bodytable.loading = true
      this.formParam = formParam
      this.corpName = this.formParam.corpName
      this.periodrange = [this.formParam.qjq, this.formParam.qjq]
      this.$api.LrbReport.query(this.formParam).then(result => {
        if (result.success) {
          if (this.columnOrder === 'on') {
            this.$refs.bodytable_ref.setBshowzero(this.formParam.bshowzero)
          } else {
            this.$refs.bodytablebn_ref.setBshowzero(this.formParam.bshowzero)
          }
          this.bodytable.tabledata = result.rows
        } else {
          this.bodytable.tabledata = []
          this.$message({showClose: true, message: result.msg, type: 'warning'})
        }
        this.bodytable.loading = false
      }).catch(e => {
      })
    },
    // 打印
    print () {
      if (this.bodytable.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    // 确认打印
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.$refs.queryhead.queryqj,
        corpName: this.formParam.corpobj.uname,
        list: JSON.stringify(this.bodytable.tabledata),
        begindate: getMonthBegin(val.periodrange[0]),
        enddate: getMonthEnd(val.periodrange[1]),
        columnOrder: this.columnOrder
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      this.$api.LrbReport.printPdf(filename, Object.assign({}, this.formParam, val, otherprintparam))
    },
    // 导出
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
        startYear: this.formParam.qjq.substring(0, 4),
        startMonth: this.formParam.qjq.substring(5, 7),
        begindate: this.formParam.qjq + '-01',
        corpName: this.corpName,
        titleperiod: this.formParam.qjq,
        columnOrder: this.columnOrder,
        bshowzero: this.formParam.bshowzero
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      if (excelselect === 1) {
        let begperiod = ''
        let endperiod = getMonthEnd(this.formParam.qjq.substring(0, 4) + '-12')
        if (this.formParam.qjq.substring(0, 4) === this.formParam.corpobj.bdate.substring(0, 4)) {
          begperiod = getMonthBegin(this.formParam.corpobj.bdate.substring(0, 7))
        } else {
          begperiod = getMonthBegin(this.formParam.qjq.substring(0, 4) + '-01')
        }
        filename = this.nodename + '(' + this.corpName + ')-(' + formatDate(begperiod, 'YYYYMMDD') + '-' + formatDate(endperiod, 'YYYYMMDD') + ')'
      }
      this.$api.LrbReport.expExcel(filename, Object.assign({
        list: JSON.stringify(this.bodytable.tabledata)
      }, this.formParam, excelparam))
    }
  }
}
</script>

<style scoped>

</style>
