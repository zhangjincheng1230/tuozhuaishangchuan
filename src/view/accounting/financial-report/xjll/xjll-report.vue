<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                    <div style = "margin-right: 10px">期间:
                      <span class="left-icon" @click="previous()"></span>
                        <el-popover
                        placement="bottom-start"
                        title = "现金流量查询"
                        width = "390"
                        popper-class = "query-popover"
                        v-model="queryVisible">
                            <el-form ref="form" :model="formParam" label-width="auto">
                                <el-form-item label="期间:">
                                    <el-date-picker
                                     v-model="formParam.qjq"
                                     value-format="yyyy-MM"
                                     :picker-options="monthPickerOptions"
                                    type="month"
                                    style="width:315px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="公司:" >
                                    <el-select
                                      filterable
                                    v-model="formParam.corpIds"
                                    style="width:315px">
                                        <el-option v-for="item in corpIds"
                                                :key="item.pk_gs"
                                                :value="item.pk_gs"
                                                :label="item.uname"
                                                style = "width:315px">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                              <el-form-item>
                                <el-checkbox v-model="formParam.bshowzero" true-label="Y" false-label="N">金额为0显示0</el-checkbox>
                              </el-form-item>
                            </el-form>
                            <div class="query-footer">
                                <div class="kj-button-group">
                                    <el-button @click="queryVisible = false">取消</el-button>
                                    <el-button type="primary"  @click="query">确定</el-button>
                                </div>
                            </div>
                            <span class="query-period" slot="reference">
                                {{queryqj}}
                            </span>
                        </el-popover>
                      <span class="right-icon" @click="next()"></span>
                    </div>
                    <span class="query-corp" :title="corpName">公司:{{corpName}}</span>
                    <div style="margin-left:15px">

                    </div>
                    <div class="warning_tip"  style="z-index:99" v-show="showxjllph">
                      <div style="overflow: hidden">
                        <span><img src="../../../../assets/img/warning.png"></span>
                        <a href="javascript:" style = "padding-right:8px" @click="showXjllPh" >现金流量表不平衡，点击查看详情！</a>
                      </div>
                    </div>
                </div>
                <div class="kj-button-group">
                  <el-switch v-model="columnOrder"  :active-value="'on'" :inactive-value="'off'" @change="saveSettingMsg"></el-switch>
                  {{ columnOrder === 'on' ? '"本月金额"': '"本年累计金额"'}}列在前&nbsp&nbsp
                    <el-button @click="linkxjllmx(currdata)">联查明细</el-button>
                    <el-button @click="print">打印</el-button>
                    <el-button @click="excelexport">导出</el-button>
                    <el-button @click="linkXjllQc">现金流量期初</el-button>
                </div>
            </div>
            <div class = "kj-main">
                <el-table
                       ref ="tableref"
                        @current-change="handleCurrData"
                        :data="tabledata"
                        highlight-current-row
                        v-loading="loading"
                        element-loading-text="数据加载中，请稍候..."
                        element-loading-spinner="el-icon-loading"
                        stripe
                        border
                        height="100%"
                        style="width: 100%"
                >
                   <!-- <el-table-column
                            label="序号"
                            type="index"
                            align="center"
                            width="50">
                    </el-table-column>-->
                    <el-table-column
                            property="xm"
                            label="项目"
                            header-align="center"
                            width="370"
                    ></el-table-column>
                    <el-table-column
                            property="hc"
                            label="行次"
                            header-align="center"
                            align="center"
                            width="50"
                    ></el-table-column>
                    <el-table-column
                            :property="columnOrder === 'on' ? 'bqje':'sqje'"
                            :label="columnOrder === 'on' ? '本月金额' : '本年累计金额'"
                            header-align="center"
                            align="right"
                            width="120"
                            :formatter="repformny"
                            show-overflow-tooltip
                    >
                      <template slot-scope="scope" >
                        <el-link v-if="columnOrder === 'on'" @click.stop.prevent="linkxjllmx(scope.row)">{{scope.row.bqje | forThousands(2, bshowzero === 'Y')}}</el-link>
                        <span v-else> {{scope.row.sqje | forThousands(2, bshowzero === 'Y')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                            :property="columnOrder === 'off' ? 'bqje':'sqje'"
                            :label="columnOrder === 'off' ? '本月金额' : '本年累计金额'"
                            header-align="center"
                            align="right"
                            width="120"
                            :formatter="repformny"
                            show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <el-link  v-if="columnOrder === 'off'" @click.stop.prevent="linkxjllmx(scope.row)">{{scope.row.bqje | forThousands(2, bshowzero === 'Y')}}</el-link>
                        <span v-else>{{scope.row.sqje | forThousands(2, bshowzero === 'Y')}}</span>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
      <!-- 打印对话框 -->
      <print-dialog ref="printdialog" :enddate ="enddate"
                    :printdatescope="true" :bshowDir="false"
                    :defaultleft="5" :defaulttop="20"
                    :periodrange="periodrange" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>

      <!--导出对话框-->
      <excel-export-dialog ref="excelExportdialog" :excelselTemp ="excelselTemp"  @confirmExcelExport="confirmExcelExport"></excel-export-dialog>

      <!--现金流量明细-->
      <xjllmx-dialog ref="xjllmxdialog"></xjllmx-dialog>

      <!--现金流量平衡-->
      <xjll-ph-dialog ref="xjllphdialog" :xjllJyx="xjll_jyx"></xjll-ph-dialog>
    </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import ExcelExportDialog from '@/components/Report/ExcelDialog'
import { getMonthBegin, getMonthEnd, formatDate } from '@/utils'
import xjllmxDialog from '@/view/accounting/financial-report/xjll/components/xjllmxDialog'
import XjllPhDialog from '@/view/accounting/financial-report/xjll/components/XjllPhDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'xjll-report',
  mixins: [datePickerMixin],
  components: {
    PrintDialog,
    ExcelExportDialog,
    xjllmxDialog,
    XjllPhDialog
  },
  data () {
    return {
      nodename: '现金流量表',
      corpName: this.$store.getters.currentCorp.uname,
      queryVisible: false,
      formParam: {
        qjq: this.$store.getters.getLoginDate.substr(0, 7),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        bshowzero: 'N' // 金额为0 显示为0
      },
      bshowzero: 'N' ,// 金额为0 显示为0
      queryqj: '',
      tabledata: [],
      currdata: null,
      loading: false,
      corpIds: this.$store.getters.corps,
      periodrange: [],
      exceldilogvisible: false,
      excelselTemp: [{
        value: 0,
        label: '当前月份EXCEL格式'
      }, {
        value: 1,
        label: '当前年度EXCEL格式'
      }],
      columnOrder: 'on',
      showxjllph: false,
      xjll_jyx: {}
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
    this.querySettingMsg()
    this.query()
  },
  methods: {
    // 现金流量期初
    linkXjllQc () {
      if (!this.$hasPermission('xjll-qc')) {
        return
      }
      this.$router.push({
        name: 'xjll-qc',
        params: {
        }
      })
    },
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
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 2, this.bshowzero === 'Y')
    },
    print () {
      if (this.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    excelexport () {
      if (this.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.excelExportdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.queryqj,
        corpName: this.corpName,
        list: JSON.stringify(this.tabledata),
        begindate: getMonthBegin(val.periodrange[0]),
        enddate: getMonthEnd(val.periodrange[1]),
        columnOrder: this.columnOrder
      }
      let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      this.$api.XjllReport.printPdf(filename, Object.assign({}, this.formParam, val, otherprintparam))
    },
    // 确认导出
    confirmExcelExport (excelselect) {
      const excelparam = {
        excelsel: excelselect + '',
        startYear: this.formParam.qjq.substring(0, 4),
        startMonth: this.formParam.qjq.substring(5, 7),
        corpName: this.corpName,
        titleperiod: this.formParam.qjq,
        columnOrder: this.columnOrder
      }
      let filename = this.getFileNameFormExcel(excelselect)
      this.$api.XjllReport.expExcel(filename, Object.assign({}, {
        list: JSON.stringify(this.tabledata)
      }, this.formParam, excelparam))
    },
    getFileNameFormExcel (excelselect) {
      let filename = this.nodename + '(' + this.corpName + ')-' + formatDate(getMonthEnd(this.formParam.qjq), 'YYYYMMDD')
      if (excelselect === 1) {
        let begperiod = ''
        let endperiod = getMonthEnd(this.formParam.qjq.substring(0, 4) + '-12')
        let obj = {}
        obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.pk_gs === this.formParam.corpIds// 筛选出匹配数据
        })
        if (this.formParam.qjq.substring(0, 4) === obj.bdate.substring(0, 4)) {
          begperiod = getMonthBegin(obj.bdate.substring(0, 7))
        } else {
          begperiod = getMonthBegin(this.formParam.qjq.substring(0, 4) + '-01')
        }
        filename = this.nodename + '(' + this.corpName + ')-(' + formatDate(begperiod, 'YYYYMMDD') + '-' + formatDate(endperiod, 'YYYYMMDD') + ')'
      }
      return filename
    },
    selectGet (vId) { // 下拉框选中事件 ,这个vId也就是value值
      let obj = {}
      obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.pk_gs === vId// 筛选出匹配数据
      })
      return obj.uname
    },
    query () {
      this.loading = true
      this.queryqj = this.formParam.qjq
      this.corpName = this.selectGet(this.formParam.corpIds)
      this.periodrange = [this.formParam.qjq, this.formParam.qjq]
      this.$api.XjllReport.query(this.formParam).then(result => {
        if (result.success) {
          this.bshowzero = this.formParam.bshowzero
          this.tabledata = result.rows
          this.showxjllph = !result.blancemsg
          if (!result.blancemsg) {
            this.xjll_jyx = result.xjll_jyx
          } else {
            this.xjll_jyx = {}
          }
        } else {
          this.bodytable.tabledata = []
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'warning'
          })
        }
        this.queryVisible = false
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    // 联查现金流量明细
    linkxjllmx (currdata) {
      let data = currdata
      const param = {
        corpIds: this.formParam.corpIds,
        qjq: this.formParam.qjq,
        hc: data ? data.hc : ''
      }
      this.$api.XjllReport.linkXjllMx(param).then(result => {
        if (result.success) {
          this.$refs.xjllmxdialog.show(result.rows, this.corpName, this.formParam.qjq, this.formParam.corpIds)
        } else {
          this.$message({ showClose: true, message: result.msg, ype: 'warning' })
        }
      }).catch(e => {
      })
    },
    handleCurrData (val) {
      this.currdata = val
    },
    // 显示现金流量平衡
    showXjllPh () {
      this.$refs.xjllphdialog.show()
    },
    previous () {
      const period = this.$store.getters.getCorp(this.formParam.corpIds).bdate.substring(0, 7)
      if (period >= this.formParam.qjq) {
        this.$message({
          showClose: true,
          message: '查询日期不能在建账日期前',
          type: 'warning'
        })
        return
      }
      const date = new Date(this.formParam.qjq)
      date.setMonth(date.getMonth() - 1)
      this.formParam.qjq = formatDate(date, 'YYYY-MM')
      this.query()
    },
    next () {
      const date = new Date(this.formParam.qjq)
      date.setMonth(date.getMonth() + 1)
      this.formParam.qjq = formatDate(date, 'YYYY-MM')
      this.query()
    }
  }
}
</script>
<style lang="less">
  @import "../styles/report.less";
</style>
<style scoped>
  .warning_tip {
    position:absolute;
    left:40%;
    border-radius: 0.4em;
    background: #fff;
    border: 1px solid #ff525f;
    padding-left: 10px;
  }
  a {
    text-decoration: none;
    color: #ff525f;
  }
</style>
