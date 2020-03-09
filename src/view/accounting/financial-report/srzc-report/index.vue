<!--收入支出表-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class = "kj-head">
        <div class="query-info">
          <div style = "margin-right: 10px">期间:
            <span class="left-icon" @click="previous()"></span>
            <el-popover
              placement="bottom-start"
              title = "收入支出查询"
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
                  <el-select filterable
                    v-model="formParam.corpobj" value-key="pk_gs"
                    style="width:315px">
                    <el-option v-for="item in corpIds"
                               :key="item.pk_gs"
                               :value="item"
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
                  <el-button  type="primary"  @click="query">确定</el-button>
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
            property="monnum"
            label="本月数"
            header-align="center"
            align="right"
            width="180"
            :formatter="repformny"
          ></el-table-column>
          <el-table-column
            property="yearnum"
            label="本年累计数"
            header-align="center"
            align="right"
            width="180"
            :formatter="repformny"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 打印对话框 -->
    <print-dialog ref="printdialog"  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import {formatDate} from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'srzc-report',
  mixins: [datePickerMixin],
  components: {
    PrintDialog
  },
  data () {
    return {
      nodename: '收入支出表',
      corpName: this.$store.getters.currentCorp.uname,
      queryVisible: false,
      formParam: {
        corpobj: this.$store.getters.currentCorp,
        qjq: this.$store.getters.getLoginDate.substr(0, 7),
        begindate: this.$store.getters.getLoginDate.substr(0, 7),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        bshowzero: 'N' // 金额为0 显示为0
      },
      bshowzero: 'N', // 金额为0 显示为0
      queryqj: '',
      tabledata: [],
      loading: false,
      corpIds: this.$store.getters.corps
    }
  },
  created () {
    this.query()
  },
  methods: {
    confirmExcelExport () {
      const excelparam = {
        corpName: this.corpName,
        titleperiod: this.queryqj
      }
      this.$api.srzcReport.expExcel(this.nodename, Object.assign({
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
      this.$api.srzcReport.printPdf(this.nodename, Object.assign({}, this.formParam, val, otherprintparam))
    },
    query () {
      this.loading = true
      this.queryqj = this.formParam.qjq
      this.formParam.begindate = this.formParam.qjq + '-01'
      this.corpName = this.formParam.corpobj.uname
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.$api.srzcReport.query(this.formParam).then(result => {
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

</style>
