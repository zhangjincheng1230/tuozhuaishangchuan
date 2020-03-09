<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                   <!--查询对话框-->
                   <queryhead ref="queryhead" @query="query"></queryhead>
                    <span class="query-corp" :title="corpName">公司:{{corpName}}</span>
                  <div style="margin-left:15px">

                  </div>
                </div>
                <div class="kj-button-group">
                  <el-switch v-model="isshowcurrquar"  :active-value="'Y'" :inactive-value="'N'" @change="saveSettingMsg"></el-switch>
                  显示当前季度 &nbsp&nbsp
                    <el-button @click="print">打印</el-button>
                    <el-button @click="excelexport">导出</el-button>
                </div>
            </div>
          <bodytable ref="bodytable_ref" :tabledata="bodytable.tabledata" :loading="bodytable.loading"
                     :jd="formParam.jd" :xscurrjd="isshowcurrquar === 'Y'" class="kj-main"></bodytable>
        </div>
      <!-- 打印对话框 -->
      <print-dialog ref="printdialog" :enddate ="enddate" :bshowDir="false"
                    :defaultleft="5" :defaulttop="40"
                    :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
      <!--导出对话框-->
      <excel-export-dialog ref="excelExportdialog" :excelselTemp ="excelselTemp"  @confirmExcelExport="confirmExcelExport"></excel-export-dialog>
    </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import ExcelExportDialog from '@/components/Report/ExcelDialog'
import bodytable from '@/view/accounting/financial-report/lrbjb-report/component/bodytable'
import queryhead from '@/view/accounting/financial-report/lrbjb-report/component/queryhead'
import { getMonthBegin, getMonthEnd } from '@/utils'

export default {
  name: 'lrbjb-report',
  components: {
    PrintDialog,
    bodytable,
    queryhead,
    ExcelExportDialog
  },
  data () {
    return {
      nodename: '利润表季报',
      corpName: this.$store.getters.currentCorp.uname,
      bodytable: {
        tabledata: [],
        loading: false
      },
      excelselTemp: [{
        value: 0,
        label: '当前季度EXCEL格式'
      }],
      formParam: { },
      isshowcurrquar: 'N',
      periodrange: []
    }
  },
  computed: {
    defaultPeriod () {
      return this.$store.getters.getLoginDate.substr(0, 7)
    },
    enddate () {
      return getMonthEnd(this.formParam.year + '-' + this.formParam.jd)
    }
  },
  created () {
    this.querySettingMsg()
  },
  watch: {
  },
  methods: {
    // 保存设置
    saveSettingMsg () {
      const param = {
        nodename: this.nodename,
        print_setting1: JSON.stringify({'isshowcurrquar': this.isshowcurrquar}),
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
            this.isshowcurrquar = printsetting1['isshowcurrquar']
          } else if (printsetting) { // 处理历史数据
            this.isshowcurrquar = printsetting['isshowcurrquar']
          }
        } else {
        }
      }).catch(e => {
      })
    },
    query (formParam) {
      this.bodytable.loading = true
      this.formParam = formParam
      this.corpName = this.formParam.corpName
      this.$api.lrbjbReport.query(this.formParam).then(result => {
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
        currjd: this.isshowcurrquar === 'Y' ? this.formParam.jd : ''
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + this.$refs.queryhead.queryqj
      this.$api.lrbjbReport.printPdf(filename, Object.assign({}, this.formParam, val, otherprintparam))
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
        currjd: this.isshowcurrquar === 'Y' ? this.formParam.jd : '',
        corpName: this.corpName,
        titleperiod: this.$refs.queryhead.queryqj
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + this.$refs.queryhead.queryqj
      this.$api.lrbjbReport.expExcel(filename, Object.assign({}, {
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
