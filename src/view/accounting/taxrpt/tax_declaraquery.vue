<template>
  <div class="app-main">
    <div class="kj-container" v-show="!cardShow">
      <div class="kj-head">
        <div class="query-info">
          <div>申报期间：
            <el-popover
              placement="bottom-start"
              title="申报查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="formParam" label-width="auto">
                <el-form-item label="公司：">
                  <el-select
                    v-model="formParam.corpId"
                    filterable
                    style="width: 315px">
                    <el-option
                      v-for="item in corpRef"
                      :key="item.pk_gs"
                      :value="item.pk_gs"
                      :label="item.incode + '_' + item.uname">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="申报期间：">
                  <el-date-picker
                    v-model="formParam.periodRange"
                    type="monthrange"
                    unlink-panels
                    range-separator="至"
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="申报状态：">
                  <el-select
                    v-model="formParam.sbzt"
                    style="width: 315px">
                    <el-option
                      v-for="item in sbztTypes"
                      :key="item.label"
                      :value="item.label"
                      :label="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                {{ formParam.periodRange[0] + ' 至 ' + formParam.periodRange[1]}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
            <el-table
              :data="sortedData"
              highlight-current-row
              @current-change="handleListRowSelect"
              @selection-change="handleListRowSelection"
              @row-click="handleRowChange"
              v-loading="loading"
              element-loading-text="数据加载中，请稍候..."
              element-loading-spinner="el-icon-loading"
              stripe
              border
              height="50%"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                property="sbcode"
                label="编码"
                show-overflow-tooltip
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="sbname"
                label="申报名称"
                show-overflow-tooltip
                header-align="center"
                width="350">
              </el-table-column>
              <el-table-column
                property="period"
                label="所属期间"
                show-overflow-tooltip
                header-align="center"
                width="80">
              </el-table-column>
              <el-table-column
                property="sbzt_osb"
                label="是否零申报"
                show-overflow-tooltip
                align="center"
                width="100">
                <template #default="scope">
                  <el-checkbox :disabled="true" :checked="scope.row.sbzt_osb === '是'"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                property="spreadfile"
                label="填写状态"
                show-overflow-tooltip
                header-align="center"
                width="80">
                <template #default="scope">
                  {{ scope.row.spreadfile ? '已填写' : '未填写' }}
                </template>
              </el-table-column>
              <el-table-column
                property="sbzt_dm"
                label="申报状态"
                show-overflow-tooltip
                header-align="center"
                width="100">
                <template #default="scope">
                  {{ scope.row.sbzt_dm === "0" ? "已提交"
                  : scope.row.sbzt_dm === "1" ? "受理失败"
                  : scope.row.sbzt_dm === "2" ? "受理成功"
                  : scope.row.sbzt_dm === "3" ? "申报失败"
                  : scope.row.sbzt_dm === "4" ? "申报成功"
                  : scope.row.sbzt_dm === "5" ? "作废"
                  : scope.row.sbzt_dm === "6" ? "缴款失败"
                  : scope.row.sbzt_dm === "7" ? "缴款成功"
                  : scope.row.sbzt_dm === "101" ? "未提交" : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column
                property="taxmny"
                label="税款"
                show-overflow-tooltip
                :formatter="formatMny"
                header-align="center"
                align="right"
                width="100">
              </el-table-column>

            </el-table>

            <el-table
              :data="tableData2"
              highlight-current-row
              stripe
              height="50%"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                max-width="50">
              </el-table-column>
              <el-table-column
                property="reportcode"
                label="报表编码"
                show-overflow-tooltip
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="reportname"
                label="报表名称"
                show-overflow-tooltip
                header-align="center"
                width="400">
              </el-table-column>
              <el-table-column
                property="txzt"
                label="填写状态"
                show-overflow-tooltip
                header-align="center"
                width="100">
                <template #default="scope">
                  {{ scope.row.spreadfile ? '已填写' : '未填写' }}
                </template>
              </el-table-column>
              <el-table-column
                property="spreadfile"
                label="报表内容"
                show-overflow-tooltip
                align="center"
                width="200">
                <template #default="scope">
                  <el-button v-if="scope.row.spreadfile" @click="onShow(scope.row.reportcode, scope.row.reportname)"
                    type="small" >查看</el-button>
                </template>
              </el-table-column>

            </el-table>
        </div>
      </div>
    </div>
    <div class="kj-container kj-card" v-show="cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="onCancel">返回</el-button>
        </div>
      </div>
      <div class="kj-main">
        <iframe id="iframeId" src="/static/spreadjs/spread.html?t=111" style="border: none;width: 98%;height: 98%"></iframe>
      </div>
    </div>

  </div>
</template>

<script>
import { orderBy } from 'natural-orderby'
import datePickerMixin from '@/mixins/date-picker'
import { getPreviousPeriod } from '@/utils'
export default {
  name: 'tax_declaraquery',
  mixins: [datePickerMixin],
  components: {
  },
  data () {
    let qcperiod = getPreviousPeriod(new Date())
    return {
      loading: true,
      queryVisible: false,
      cardShow: false,
      pageInfo: {
        page: 1,
        rows: 10
      },
      total: 0,
      tableData: [],
      tableData2: [],
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      formParam: {
        periodRange: [qcperiod, qcperiod],
        corpId: this.$store.getters.currentCorp.pk_gs,
        sbzt: ''
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.mbbm)
    },
    corpRef () {
      return this.$store.getters.corps
    },
    sbztTypes () {
      return [
        {label: '', value: '全部'},
        {label: '0', value: '已提交'},
        {label: '1', value: '受理失败'},
        {label: '2', value: '受理成功'},
        {label: '3', value: '申报失败'},
        {label: '4', value: '申报成功'},
        {label: '5', value: '作废'},
        {label: '6', value: '缴款失败'},
        {label: '7', value: '缴款成功'},
        {label: '101', value: '未提交'}
      ]
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    cardShow (newValue) {
      if (!newValue) {
        // 切到列表界面时，清空表单
        // this.$refs.formRef.resetFields()
      }
    }
  },
  methods: {
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    fetchData () {
      this.loading = true
      const queryParam = this.getQueryParam()
      this.$api.TaxRptApi.TaxQuery.queryTemp({
        ...queryParam
      }).then(result => {
        this.loading = false
        if (result.success) {
          if (result.rows) {
            this.tableData = result.rows
            this.tableData2 = []
            this.total = result.rows.length
            this.successMsg(result.msg)
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    formatMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    getQueryParam () {
      const periodBegin = this.formParam.periodRange[0]
      const periodEnd = this.formParam.periodRange[1]
      const param = {
        periodfrom: periodBegin,
        periodto: periodEnd,
        sbzt_dm: this.formParam.sbzt
      }
      if (this.formParam.corpId) {
        param.pk_corp = this.formParam.corpId
      }
      return param
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    handleRowChange (row, event, column) {
      this.$api.TaxRptApi.TaxQuery.queryB({
        pk_taxreport: row.pk_taxreport,
        pk_corp: row.pk_corp
      }).then(result => {
        if (result.rows) {
          this.tableData2 = result.rows
        } else {
          this.tableData2 = []
        }
      }).catch(e => {
        this.tableData2 = []
      })
    },
    onShow (reportcode, reportname) {
      if (this.listCurrentRow) {
        this.loading = true
        this.$api.TaxRptApi.TaxQuery.getData({
          pk_taxreport: this.listCurrentRow.pk_taxreport,
          pk_corp: this.formParam.corpId,
          reportcode: reportcode,
          reportname: reportname
        }).then(result => {
          this.loading = false
          if (result.success) {
            this.cardShow = true
            this.postMessage(result.data, 'open')
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择报表!',
          type: 'warning'
        })
      }
    },
    postMessage (obj, type) {
      let frame = document.getElementById('iframeId')
      let data = {}
      data.type = type
      data.data = obj
      frame.contentWindow.postMessage(data, '*')
    },
    onCancel () {
      this.cardShow = false
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>
