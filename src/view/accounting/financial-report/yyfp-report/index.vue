<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div
          class="kj-button-group"
          style="float: left; white-space: nowrap"
        >
          期间:
          <span class = "left-icon" @click="previous()"></span>
          <el-popover
            placement="bottom-start"
            title="盈余分配表查询"
            width="400"
            show-close="true"
            v-model="visible">
            <button type="button" aria-label="Close" @click="visible = false" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button>
            <el-form ref="queryForm" :model="queryForm" label-width="60px" label-position="left">
              <el-form-item label="日期:">
                <el-col :span="11">
                  <el-date-picker type="month" value-format="yyyy-MM" :picker-options="monthPickerOptions" placeholder="选择日期" v-model="queryForm.qjq" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-divider content-position="left"></el-divider>
              <el-form-item label="公司:">
                <el-col :span="18">
                  <el-select v-model="queryForm.corpIds" filterable placeholder="请选择" style="width: 100%" @change="changeCorp">
                    <el-option
                      v-for="corp in getCorps"
                      :key="corp.pk_gs"
                      :label="corp.uname"
                      :value="corp.pk_gs"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="queryForm.check">包含未记账凭证</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="queryForm.bshowzero" true-label="Y" false-label="N">金额为0显示0</el-checkbox>
              </el-form-item>
            </el-form>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="query">确定</el-button>
            </div>
            <el-button slot="reference">
              {{queryParam.begindate.substring(0, 7)}}
            </el-button>
          </el-popover>
          <span class="right-icon" @click="next()"></span>
          公司: {{this.currentCorp.uname}}
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="excelexport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
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
              property="xm1"
              label="项目"
              header-align="center"
              width="320"
            ></el-table-column>
            <el-table-column
              property="hc1"
              label="行次"
              header-align="center"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              property="je1"
              label="金额"
              header-align="center"
              align="right"
              width="180"
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="xm2"
              label="项目"
              header-align="center"
              width="320"
            ></el-table-column>
            <el-table-column
              property="hc2"
              label="行次"
              header-align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              property="je2"
              label="金额"
              header-align="center"
              align="right"
              width="120"
              show-overflow-tooltip
              :formatter="repformny"
            ></el-table-column>
            <el-table-column label></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top />
    </el-tooltip>
    <!-- 打印对话框 -->
    <print-dialog ref="printdialog" :enddate ="enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import { formatDate, getMonthEnd } from '@/utils'
import { mapGetters } from 'vuex'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'yyfp-report',
  mixins: [datePickerMixin],
  components: {
    BackToTop,
    PrintDialog
  },
  data () {
    return {
      nodename: '盈余及盈余分配表',
      visible: false,
      loading: false,
      currentCorp: {},
      queryForm: {
        qjq: this.$store.getters.getLoginDate.substr(0, 7),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        check: true,
        bshowzero: 'N' // 金额为0 显示为0
      },
      bshowzero: 'N', // 金额为0 显示为0
      queryParam: {
        corpIds: '',
        begindate: '',
        ishasjz: 'N',
        sort: 'seq',
        order: 'asc',
        bshowzero: 'N' // 金额为0 显示为0
      },
      tableData: []
    }
  },
  created () {
    this.init()
    this.query()
  },
  computed: {
    ...mapGetters(['corps', 'getLoginCorp', 'getLoginCorpId', 'getCorp', 'getLoginDate']),
    defaultPeriod () {
      return this.$store.getters.getLoginDate.substr(0, 7)
    },
    getCorps () {
      return this.corps.filter(v => v.ctype === '00000100000000Ig4yfE0006')
    },
    enddate () {
      return getMonthEnd(this.queryForm.qjq)
    }
  },
  methods: {
    changeCorp (value) {
      this.currentCorp = this.getCorp(value)
    },
    init () {
      this.currentCorp = this.getLoginCorp
    },
    query () {
      this.loading = true
      this.$api.yyfpReport.query(this.getQueryParam()).then(result => {
        this.loading = false
        if (result.success === true) {
          this.bshowzero = this.queryForm.bshowzero
          this.visible = false
          this.tableData = result.rows
        }
      })
    },
    getQueryParam () {
      this.queryParam = {}
      this.queryParam.corpIds = this.queryForm.corpIds
      this.queryParam.begindate = this.queryForm.qjq + '-01'
      this.queryParam.ishasjz = this.queryForm.check ? 'N' : 'Y'
      this.queryParam.bshowzero = this.queryForm.bshowzero
      return this.queryParam
    },
    print () {
      this.$refs.printdialog.show()
    },
    excelexport () {
      const exportloading = this.$loading({
        lock: true,
        text: '导出中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$api.yyfpReport.exportExcel('盈余分配表_' + this.queryParam.begindate, this.getExportParam(), function () {
        exportloading.close()
      })
    },
    getExportParam () {
      let exportParam = {
        list: JSON.stringify(this.tableData),
        corpName: this.currentCorp.uname,
        period: this.queryParam.begindate
      }
      return Object.assign({}, this.getQueryParam(), exportParam)
    },
    confirmPrint (val) {
      this.$api.yyfpReport.printPdf('盈余及盈余分配表', this.getPrintParam(val))
    },
    getPrintParam (val) {
      let printparam = {
        corpName: this.currentCorp.uname,
        period: this.queryParam.begindate,
        list: JSON.stringify(this.tableData)
      }
      return Object.assign({}, this.getQueryParam(), printparam, val)
    },
    next () {
      const date = new Date(this.queryForm.qjq)
      date.setMonth(date.getMonth() + 1)
      this.queryForm.qjq = formatDate(date, 'YYYY-MM')
      this.query()
    },
    previous () {
      const bdate = this.currentCorp.bdate
      if (bdate >= this.queryForm.qjq) {
        this.$message({
          message: '查询日期不能在建账日期前',
          type: 'warning'
        })
        return
      }
      const date = new Date(this.queryForm.qjq)
      date.setMonth(date.getMonth() - 1)
      this.queryForm.qjq = formatDate(date, 'YYYY-MM')
      this.query()
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 2, this.bshowzero === 'Y')
    }
  }
}
</script>
<style scoped>
  .el-button--medium{
    padding: 7px 20px;
  }
  .left-icon{
    font: 12px/1.5 \5b8b\4f53;
    color: #555;
    margin: 0;
    padding: 0;
    font-family: Microsoft YaHei;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    width: 20px;
    vertical-align: middle;
    font-size: 14px;
    background: url(../images/left.png) no-repeat #657071;
    background-position: 6px 10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .right-icon{
    font: 12px/1.5 \5b8b\4f53;
    color: #555;
    margin: 0;
    padding: 0;
    font-family: Microsoft YaHei;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    width: 20px;
    vertical-align: middle;
    font-size: 14px;
    background: url(../images/right.png) no-repeat #657071;
    background-position: 8px 10px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>
