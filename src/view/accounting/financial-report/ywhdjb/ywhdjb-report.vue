<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                    <div style = "margin-right: 10px">期间:
                      <span class="left-icon" @click="previous()"></span>
                        <el-popover
                                placement="bottom-start"
                                title = "业务活动季报查询"
                                width = "390"
                                popper-class = "query-popover"
                                v-model="queryVisible">
                            <el-form ref="form" :model="formParam" label-width="auto">
                              <el-form-item label="期间:">
                                <el-date-picker
                                  v-model="formParam.year"
                                  style="width: 150px;float:left"
                                  :clearable="false"
                                  value-format="yyyy"
                                  :picker-options="yearPickerOptions"
                                  type="year"
                                  placeholder="选择年">
                                </el-date-picker>
                                <el-select
                                  v-model="formParam.jd"
                                  value-key="id"
                                  style="margin-left:15px;width: 150px;float:left">
                                  <el-option
                                    v-for="item in months"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                                <el-form-item label="公司:" >
                                    <el-select filterable
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
                </div>
                <div class="kj-button-group">
                    <el-button @click="print">打印</el-button>
                    <el-button @click="confirmExcelExport">导出</el-button>
                </div>
            </div>
            <div class = "kj-main">
                <el-table
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
                    <el-table-column
                            label="序号"
                            type="index"
                            align="center"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            property="xm"
                            label="项目"
                            header-align="center"
                            width="260"
                    ></el-table-column>
                    <el-table-column
                            property="hs"
                            label="行次"
                            header-align="center"
                            align="center"
                            width="50"
                    ></el-table-column>
                    <el-table-column
                            label="本月数"
                            header-align="center"
                            width="200"
                    >
                        <el-table-column
                                property="monfxdx"
                                label="非限定性"
                                header-align="center"
                                align="right"
                                width="120"
                                show-overflow-tooltip
                                :formatter="repformny"
                        ></el-table-column>
                        <el-table-column
                                property="monxdx"
                                label="限定性"
                                header-align="center"
                                align="right"
                                width="120"
                                show-overflow-tooltip
                                :formatter="repformny"
                        ></el-table-column>
                        <el-table-column
                                property="monhj"
                                label="合计"
                                header-align="center"
                                align="right"
                                width="100"
                                :formatter="repformny"
                        ></el-table-column>
                    </el-table-column>
                    <el-table-column
                            label="本年累计数"
                            header-align="center"
                            width="200"
                    >
                        <el-table-column
                                property="yearfxdx"
                                label="非限定性"
                                header-align="center"
                                align="right"
                                width="120"
                                show-overflow-tooltip
                                :formatter="repformny"
                        ></el-table-column>
                        <el-table-column
                                property="yearxdx"
                                label="限定性"
                                header-align="center"
                                align="right"
                                width="120"
                                show-overflow-tooltip
                                :formatter="repformny"
                        ></el-table-column>
                        <el-table-column
                                property="yearhj"
                                label="合计"
                                header-align="center"
                                align="right"
                                width="120"
                                show-overflow-tooltip
                                :formatter="repformny"
                        ></el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
      <!-- 打印对话框 -->
      <print-dialog ref="printdialog"  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
    </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'ywhdjb-report',
  mixins: [datePickerMixin],
  components: {
    PrintDialog
  },
  data () {
    return {
      nodename: '业务活动季报',
      corpName: this.$store.getters.currentCorp.uname,
      queryVisible: false,
      formParam: {
        begindate: this.$store.getters.getLoginDate,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        year: this.$store.getters.getLoginDate.substr(0, 4),
        jd: this.selectQuarterValue(this.$store.getters.getLoginDate.substr(5, 7)),
        bshowzero: 'N' // 金额为0 显示为0
      },
      bshowzero: 'N', // 金额为0 显示为0
      queryqj: this.$store.getters.getLoginDate.substr(0, 7),
      tabledata: [],
      loading: false,
      corpIds: this.$store.getters.corps,
      years: [
        {
          id: '2019',
          name: '2019'
        },
        {
          id: '2018',
          name: '2018'
        }
      ],
      months: [
        {
          id: '03',
          name: '第一季度'
        },
        {
          id: '06',
          name: '第二季度'
        },
        {
          id: '09',
          name: '第三季度'
        },
        {
          id: '12',
          name: '第四季度'
        }
      ]
    }
  },
  created () {
    this.query()
  },
  methods: {
    selectQuarterValue (str) {
      const s = str.substring(5, 7)
      if (s === '01' || s === '02' || s === '03') {
        return '03'
      } else if (s === '04' || s === '05' || s === '06') {
        return '06'
      } else if (s === '07' || s === '08' || s === '09') {
        return '09'
      } else {
        return '12'
      }
    },
    confirmExcelExport () {
      const excelparam = {
        corpName: this.corpName,
        titleperiod: this.queryqj
      }
      this.$api.YwhdJbReport.expExcel(this.nodename, Object.assign({
        list: JSON.stringify(this.tabledata)
      }, this.formParam, excelparam))
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 2, this.bshowzero === 'Y')
    },
    selectGet (vId) { // 下拉框选中事件 ,这个vId也就是value值
      let obj = {}
      obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.pk_gs === vId// 筛选出匹配数据
      })
      return obj.uname
    },
    print () {
      if (this.tabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        corpName: this.corpName,
        titleperiod: this.queryqj,
        list: JSON.stringify(this.tabledata)
      }
      this.$api.YwhdJbReport.printPdf(this.nodename, Object.assign({},this.formParam, val, otherprintparam))
    },
    query () {
      this.loading = true
      this.formParam.begindate = this.formParam.year + '-' + this.formParam.jd + '-01'
      this.queryqj = this.formParam.year + '--' + this.getJdName(this.formParam.jd)
      this.corpName = this.selectGet(this.formParam.corpIds)
      this.$api.YwhdJbReport.query(this.formParam).then(result => {
        if (result.success) {
          this.bshowzero = this.formParam.bshowzero
          this.tabledata = result.rows
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
      })
    },
    getJdName (id) {
      for (const month of this.months) {
        if (month.id === id) {
          return month.name
        }
      }
      return ''
    },
    previous () {
      const period = this.$store.getters.getCorp(this.formParam.corpIds).bdate.substring(0, 7)
      let startYear = parseInt(this.formParam.year)
      let startMonth = parseInt(this.formParam.jd)

      startMonth = startMonth - 3

      if (startMonth <= 0) {
        startMonth = 12
        startYear = startYear - 1
      }
      let startMonthstr = startMonth < 10 ? '0' + startMonth : startMonth + ''
      if (period.substring(0, 7) >= (startYear + '-' + startMonthstr)) {
        this.$message({
          showClose: true,
          message: '查询日期不能在建账日期前',
          type: 'warning'
        })
        return
      }
      this.formParam.year = startYear + ''
      this.formParam.jd = startMonthstr
      this.query()
    },
    next () {
      let startYear = parseInt(this.formParam.year)
      let startMonth = parseInt(this.formParam.jd)

      startMonth = startMonth + 3

      if (startMonth > 12) {
        startMonth = 3
        startYear = startYear + 1
      }
      this.formParam.year = startYear + ''
      this.formParam.jd = startMonth < 10 ? '0' + startMonth : startMonth + ''
      this.query()
    }
  }
}
</script>
<style lang="less">
  @import "../styles/report.less";
</style>
<style scoped>

</style>
