<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                  <!--查询对话框-->
                  <queryhead ref="queryhead" @query="query" :routerParam="routerParam"></queryhead>
                  <span class="query-corp" :title="corpName">公司:{{corpName}}</span>
                  <div class="warning_tip" v-show="blancemsg">
                    <div style="overflow: hidden;margin: 0;padding: 0;">
                      <span ><img src="../../../../assets/img/warning.png"></span>
                      <p>
                        <a href="javascript:" style = "padding-right:8px" @click="showSsph" >资产负债表不平衡，点击查看详情！</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="kj-button-group">
                    <el-button @click="print">打印</el-button>
                    <el-dropdown style="margin-left: 10px">
                      <el-button size="mini">导出<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="excelexport">标准格式</el-dropdown-item>
                        <el-dropdown-item v-show="$store.getters.currentCorp.ctype === '00000100AA10000000000BMD' || $store.getters.currentCorp.ctype === '00000100AA10000000000BMF'" @click.native="excelexportSj">税局格式</el-dropdown-item>
                        <el-dropdown-item v-show="$store.getters.currentCorp.ctype === '00000100AA10000000000BMD'" @click.native="excelexportEn">英文格式</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <bodytable ref="bodytable" class = "kj-main" :tabledata="bodytable.tabledata" :loading="bodytable.loading" :formParam="formParam"  ></bodytable>
        </div>
      <!-- 打印对话框 -->
      <print-dialog ref="printdialog" :enddate ="enddate" :periodrange="periodrange" :printdatescope="true" :bshowDir="false"
                    :defaultleft="5" :defaulttop="40"
                    :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>

      <!--导出对话框-->
      <exceldialog ref="exceldialog" :isQua.sync="isQua" :corpType.sync="corpType" :type.sync="isSj"  :is-en="isEn"
                   :visible.sync="exceldilogvisible" @confirmExcelExport="confirmExcelExport"></exceldialog>

      <SSphdialog ref="ssphdialog" :zcfzjyx="zcfzjyx" :msglist="ssphmsg"></SSphdialog>
    </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import queryhead from '@/view/accounting/financial-report/zcfz-report/components/queryhead'
import bodytable from '@/view/accounting/financial-report/zcfz-report/components/bodytable'
import exceldialog from '@/view/accounting/financial-report/zcfz-report/components/exceldialog'
import SSphdialog from '@/view/accounting/financial-report/zcfz-report/components/SsphDialog'
import { getMonthBegin, getMonthEnd, formatDate } from '@/utils'
export default {
  name: 'zcfz-report',
  components: {
    SSphdialog,
    PrintDialog,
    queryhead,
    bodytable,
    exceldialog
  },
  data () {
    return {
      isSj: false,
      isEn: false,
      exceldilogvisible: false,
      nodename: '资产负债表',
      corpName: this.$store.getters.currentCorp.uname,
      formParam: {
        qjq: ''
      },
      bodytable: {
        tabledata: [],
        loading: false
      },
      zcfzjyx: null,
      ssphmsg: null,
      blancemsg: null,
      periodrange: []
    }
  },
  props: {
    routerParam: {}
  },
  computed: {
    isQua () {
      if (this.formParam.qjq !== '') {
        let month = this.formParam.qjq.substr(5, 7)
        if (month === '03' || month === '06' || month === '09' || month === '12') {
          return true
        }
      }
      return false
    },
    defaultPeriod () {
      return this.$store.getters.getLoginDate.substr(0, 7)
    },
    enddate () {
      return getMonthEnd(this.formParam.qjq)
    },
    corpType () {
      return this.formParam.hasOwnProperty('corpobj') ? this.formParam.corpobj.ctype : this.$store.getters.currentCorp.ctype
    }
  },
  created () {
    // this.query()
  },
  methods: {
    showSsph () {
      this.$refs.ssphdialog.show()
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    print () {
      if (this.bodytable.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    excelexport () {
      this.isSj = false
      this.isEn = false
      this.exceldilogvisible = true
    },
    excelexportSj () {
      this.isSj = true
      this.isEn = false
      console.log('isQua-------------->', this.isQua)
      this.exceldilogvisible = true
    },
    excelexportEn () {
      this.isSj = false
      this.isEn = true
      this.exceldilogvisible = true
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
      this.$api.zcfzReport.printPdf(filename, Object.assign({}, this.formParam, val, otherprintparam))
    },
    // 确认导出
    confirmExcelExport (formParam) {
      const exportloading = this.$loading({
        lock: true,
        text: '导出中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.isEn) {
        this.$api.zcfzReport.excelExcelEn(this.getExportParam(formParam), function () {
          exportloading.close()
        })
      } else {
        let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
        if (!this.isSj) {
          filename = this.getFileNameFromExcel(formParam)
        }
        this.isSj ? this.$api.zcfzReport.expExcelSj(this.getExportParam(formParam), function () {
          exportloading.close()
        }) : this.$api.zcfzReport.excelExcel(filename, this.getExportParam(formParam), function () {
          exportloading.close()
        })
      }
    },
    // 获取文件名称
    getFileNameFromExcel (formParam) {
      if (formParam.excelsel === '1') { // 按年导出
        let begperiod = ''
        let endperiod = this.formParam.qjq.substring(0, 4) + '-12-31'
        if (this.formParam.qjq.substring(0, 4) === this.formParam.corpobj.bdate.substring(0, 4)) {
          begperiod = getMonthBegin(this.formParam.corpobj.bdate.substring(0, 7))
        } else {
          begperiod = getMonthBegin(this.formParam.qjq.substring(0, 4) + '-01')
        }
        return this.nodename + '(' + this.corpName + ')-(' + formatDate(begperiod, 'YYYYMMDD') + '-' + formatDate(endperiod, 'YYYYMMDD') + ')'
      } else {
        return this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      }
    },
    getExportParam (formParam) {
      let exportParam = {
        list: JSON.stringify(this.bodytable.tabledata),
        period: this.formParam.qjq,
        corpName: this.corpName,
        corpIds: this.formParam.corpIds,
        corpType: this.corpType,
        begindate: this.formParam.qjq + '-01',
        bshowzero: this.formParam.bshowzero
      }
      return Object.assign({}, formParam, exportParam)
    },
    query (formParam) {
      this.bodytable.loading = true
      this.formParam = formParam
      this.corpName = this.formParam.corpName
      this.periodrange = [this.formParam.qjq, this.formParam.qjq]
      this.$api.zcfzReport.query(this.formParam).then(result => {
        if (result.success) {
          this.bodytable.tabledata = result.rows
          this.$refs.bodytable.setBshowzero(this.formParam.bshowzero)
          if (!result.blancemsg) {
            this.zcfzjyx = result.zcfz_jyx
            this.blancemsg = !result.blancemsg
            this.ssphmsg = result.msglist
          } else {
            this.blancemsg = null
          }
        } else {
          this.bodytable.tabledata = []
          this.$message({showClose: true, message: result.msg, type: 'warning'})
        }
        this.bodytable.loading = false
      }).catch(e => {
      })
    }
  }
}
</script>

<style scoped>
  .warning_tip {
    position:absolute;
    left:40%;
    border-radius: 0.4em;
    background: #fff;
    border: 1px solid #ff525f;
    padding-left: 10px;
  }
  .warning_tip span {
    float: left;
    padding-top: 2px;
    line-height: 15px
  }
  .warning_tip img {
    margin: 4px 10px 4px 0;
  }
  .warning_tip p {
    float: left;
    line-height: 30px;
    font-size: 14px;
  }
  a {
    text-decoration: none;
    color: #ff525f;
  }
</style>
