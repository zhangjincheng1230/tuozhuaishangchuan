<!--辅助余额表-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
            placement="bottom-start"
            title="辅助余额表查询"
            width="450"
            popper-class="query-popover"
            v-model="queryVisible">
              <el-form ref="form" :model="formParam" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="formParam.periodRange"
                    type="monthrange"
                    unlink-panels
                    range-separator="-"
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="辅助类别：">
                  <el-select
                    v-model="formParam.fzlb"
                    style="width: 315px">
                    <el-option
                      v-for="item in auxiliaryTypes"
                      :key="item.id"
                      :value="item.code"
                      :label="item.name">
                    </el-option>
                  </el-select>
                  <el-tooltip content="请选择会计科目所挂的辅助核算进行查询">
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="辅助项目：">
                  <el-select
                    v-model="formParam.fzxm"
                    style="width: 315px">
                    <el-option
                      v-for="item in auxiliaryArchiveRef"
                      :key="item.id"
                      :value="item.code"
                      :label="item.code ? item.code + '_' + item.name : item.name">
                    </el-option>
                  </el-select>
                  <el-tooltip content="可全选辅助明细或选择目标明细进行针对性查询">
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="科目：">
                  <el-select
                    v-model="formParam.kms_first"
                    filterable
                    clearable
                    style="width: 150px">
                    <el-option
                      v-for="item in subSubjectRef"
                      :key="item.id"
                      :value="item.kmbm"
                      :label="item.codename">
                    </el-option>
                  </el-select>
                  -
                  <el-select
                    v-model="formParam.kms_last"
                    filterable
                    clearable
                    style="width: 150px">
                    <el-option
                      v-for="item in subSubjectRef"
                      :key="item.id"
                      :value="item.kmbm"
                      :label="item.codename">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-collapse-transition>
                  <div v-show="showFullParam" style="max-height: 210px">
                    <el-form-item label="级次：">
                      <el-select
                        v-model="formParam.cjq"
                        style="width: 150px">
                        <el-option
                          v-for="item in subjectLevel"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label">
                        </el-option>
                      </el-select>
                      -
                      <el-select
                        v-model="formParam.cjz"
                        style="width: 150px">
                        <el-option
                          v-for="item in subjectLevel"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="币种：">
                      <el-select
                        v-model="formParam.pk_currency"
                        style="width: 315px">
                        <el-option
                          v-for="item in subjectCurrency"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <el-checkbox
                        label="包含未记账凭证"
                        v-model="formParam.ishasjz"
                        style="width: 150px"></el-checkbox>
                      <el-checkbox
                        label="显示科目"
                        v-model="formParam.xskm"></el-checkbox>
                      <el-checkbox
                        label="无余额无发生不显示"
                        v-model="formParam.xswyewfs"
                        style="width: 150px"></el-checkbox>
                      <el-checkbox
                        label="有余额无发生不显示"
                        v-model="formParam.ishowfs"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="公司：">
                      <el-select
                        v-model="formParam.corpIds"
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
                  </div>
                </el-collapse-transition>
              </el-form>
              <div class="query-footer">
                <div class="condition-control">
                  <el-link v-if="showFullParam" type="primary" :underline="false" @click="showFullParam=false">
                    收起更多<i class="el-icon-arrow-up el-icon--right"></i>
                  </el-link>
                  <el-link v-else type="primary" :underline="false" @click="showFullParam=true">
                    更多条件<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-link>
                </div>
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                {{ queryParam.qjq + ' - ' + queryParam.qjz}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{ corpName }}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="openPrintDialog">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          ref="table"
          :data="tableData"
          highlight-current-row
          v-loading="loading"
          element-loading-text="数据加载中，请稍候..."
          element-loading-spinner="el-icon-loading"
          stripe
          border
          height="100%"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            property="fzhsxCode"
            label="编码"
            show-overflow-tooltip
            header-align="center"
            width="130">
            <template #default="{ row }">
              <span v-html="formatCode(row.accLevel, row.fzhsxCode)"></span>
            </template>
          </el-table-column>
          <el-table-column
            property="fzhsxName"
            label="名称"
            show-overflow-tooltip
            header-align="center"
            width="250">
            <template #default="{ row }">
              <span v-html="formatName(row.accLevel)"></span>
              <template v-if="row.accLevel === 0">{{ row.fzhsxName }}</template>
              <el-link v-else  type="primary" @click="routeToDetailReport(row)">{{ row.fzhsxName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="期初余额"
            align="center">
            <el-table-column
              v-if="showForeignCurrency"
              property="ybqcyejf"
              label="借方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="qcyejf"
              :label="formatColumnName('借方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              v-if="showForeignCurrency"
              property="ybqcyedf"
              label="贷方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="qcyedf"
              :label="formatColumnName('贷方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="本期发生额"
            align="center">
            <el-table-column
              v-if="showForeignCurrency"
              property="ybbqfsjf"
              label="借方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="bqfsjf"
              :label="formatColumnName('借方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              v-if="showForeignCurrency"
              property="ybbqfsdf"
              label="贷方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="bqfsdf"
              :label="formatColumnName('贷方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="本年累计发生额"
            align="center">
            <template #header>
              本年累计发生额
              <el-tooltip v-if="showToolTip">
                <div
                  slot="content"
                  style="width: 200px">
                  勾选"有余额无发生不显示"或"无余额无发生不显示"可能会导致非查询期间数据不纳入本年累计统计范围
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </template>
            <el-table-column
              v-if="showForeignCurrency"
              property="ybbnljjf"
              label="借方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="bnljjf"
              :label="formatColumnName('借方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              v-if="showForeignCurrency"
              property="ybbnljdf"
              label="贷方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="bnljdf"
              :label="formatColumnName('贷方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="期末余额"
            align="center">
            <el-table-column
              v-if="showForeignCurrency"
              property="ybqmyejf"
              label="借方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="qmyejf"
              :label="formatColumnName('借方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              v-if="showForeignCurrency"
              property="ybqmyedf"
              label="贷方(原币)"
              :formatter="formatForeignMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
            <el-table-column
              property="qmyedf"
              :label="formatColumnName('贷方')"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="110">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="打印"
    :visible.sync="printDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    width="380px">
      <el-form :model="printForm" ref="formData">
        <el-form-item label="模板选择：">
          <el-select
            v-model="printForm.type"
            @change="printTempTypeChange"
            style="width: 220px">
            <el-option
              v-for="item in printTempRef"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面边距：">
          <div style="display: inline-block">
            左<el-input
            v-model.trim="printForm.left"
            style="width: 50px"></el-input>毫米
          </div>
          <div style="display: inline-block; margin-left: 10px">
            上<el-input
              v-model.trim="printForm.top"
              style="width: 50px"></el-input>毫米
          </div>
        </el-form-item>
        <el-form-item label="字体大小：">
          <el-select
            v-model="printForm['font-size']"
            style="width: 70px">
            <el-option
              v-for="item in fontSizeRef"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印日期：">
          <el-radio-group
            v-model="printForm.dyrq"
            @change="printDateTypeChange">
            <el-radio label="czrq">操作日期</el-radio>
            <el-radio label="jsrq">查询结束日期</el-radio>
          </el-radio-group>
          <div style="margin-left: 80px;">
            <el-date-picker
              v-model="printForm.printdate"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="printForm.showlb" true-label="true" false-label="false">显示辅助类别</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="printForm.showbm" true-label="true" false-label="false">显示辅助编码</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="printDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="printReport">打 印</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { SUBJECT_LEVEL, CURRENCY_RMB } from '@/constants'
import { formatDate, getMonthEnd } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'auxiliary-balance-report',
  mixins: [datePickerMixin],
  data () {
    const loginPeriod = this.$store.getters.getLoginDate.substring(0, 7)
    return {
      loading: true,
      queryVisible: false,
      showFullParam: false,
      formParam: {
        periodRange: [loginPeriod, loginPeriod],
        fzlb: 1,
        fzxm: '',
        cjq: 1,
        cjz: 5,
        pk_currency: 'zhbwb',
        xskm: true,
        ishasjz: true,
        ishowfs: false,
        xswyewfs: true
      },
      queryParam: {
        qjq: loginPeriod,
        qjz: loginPeriod
      },
      tableData: [],
      printDialogVisible: false,
      printForm: {
        type: '1',
        'font-size': '9',
        left: '40',
        top: '5',
        dyrq: 'czrq',
        printdate: formatDate(new Date()),
        showlb: 'false',
        showbm: 'true'
      },
      subjectLevel: SUBJECT_LEVEL,
      printTempRef: [
        {
          value: '1',
          label: 'A4纸模板'
        },
        {
          value: '2',
          label: 'B5纸模板'
        }
      ],
      fontSizeRef: [
        { value: '5' },
        { value: '6' },
        { value: '7' },
        { value: '8' },
        { value: '9' },
        { value: '10' },
        { value: '11' },
        { value: '12' },
        { value: '13' },
        { value: '14' }
      ],
      auxiliaryArchiveData: {},
      showToolTip: false
    }
  },
  props: {
    routerParam: {
      type: Object
    }
  },
  created () {
    if (!this.routerParam) {
      this.fetchData()
    }
    this.fetchAuxiliaryArchive(this.formParam.fzlb)
    this.fetchPrintSetting()
  },
  computed: {
    corpName () {
      return this.queryParam.corpIds ? this.corpRef.find(item => item.pk_gs === this.queryParam.corpIds).uname
        : this.$store.getters.getLoginCorp.uname
    },
    showForeignCurrency () {
      return this.queryParam.pk_currency && this.queryParam.pk_currency !== CURRENCY_RMB
    },
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    subjectCurrency () {
      return this.$store.state.accounting.subjectCurrency
    },
    subSubjectRef () {
      return this.$store.getters.subSubjectRef
    },
    auxiliaryTypeName () {
      const type = this.auxiliaryTypes.find(t => t.code === this.queryParam.fzlb)
      return type ? type.name : ''
    },
    auxiliaryArchiveRef () {
      const type = this.formParam.fzlb
      let data = []
      if (data && this.auxiliaryArchiveData[type]) {
        data.push({
          id: null,
          code: '',
          name: '全部'
        })
        data = data.concat(this.auxiliaryArchiveData[type])
      }
      return data
    },
    corpRef () {
      return this.$store.getters.corps
    }
  },
  watch: {
    'formParam.fzlb' (val) {
      if (this.auxiliaryArchiveData[val] === undefined) {
        this.fetchAuxiliaryArchive(val)
      }
      this.formParam.fzxm = ''
    },
    routerParam: {
      handler (data) {
        if (data) {
          this.formParam.periodRange = [data.qjq, data.qjz]
          if (data.kms_first) {
            this.formParam.kms_first = data.kms_first
          }
          if (data.kms_last) {
            this.formParam.kms_last = data.kms_last
          }
          if (data.fzlbcode) {
            this.formParam.fzlb = data.fzlbcode
          }
          if (data.fzxm) {
            this.formParam.fzxm = data.fzxm
          }
          this.formParam.corpIds =
          this.query()
        }
      },
      immediate: true
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
      this.$api.AuxiliaryBalanceReport.query({
        ...queryParam
      }).then(result => {
        this.loading = false
        this.queryParam = queryParam
        if (result.success) {
          const rows = result.rows
          this.$nextTick(() => {
            rows.push(this.getSumRow(rows))
            this.tableData = rows
          })
        } else {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'warning'
          })
          this.tableData = []
          this.showToolTip = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getQueryParam () {
      const periodBegin = this.formParam.periodRange[0]
      const periodEnd = this.formParam.periodRange[1]
      const param = {
        qjq: periodBegin,
        begindate: periodBegin + '-01',
        qjz: periodEnd,
        enddate: getMonthEnd(periodEnd + '-01'),
        fzlb: this.formParam.fzlb,
        fzxm: this.formParam.fzxm,
        cjq: this.formParam.cjq,
        cjz: this.formParam.cjz,
        kms_first: this.formParam.kms_first,
        kms_last: this.formParam.kms_last,
        pk_currency: this.formParam.pk_currency === 'zhbwb' ? '' : this.formParam.pk_currency,
        xskm: this.formParam.xskm ? 'Y' : 'N',
        ishasjz: this.formParam.ishasjz ? 'Y' : 'N',
        ishowfs: this.formParam.ishowfs ? 'N' : 'Y',
        xswyewfs: this.formParam.xswyewfs ? 'Y' : 'N'
      }
      if (this.formParam.corpIds) {
        param.corpIds = this.formParam.corpIds
      }
      return param
    },
    formatColumnName (name) {
      return this.showForeignCurrency ? name + '(本位币)' : name
    },
    formatCode (accLevel, cellValue) {
      if (cellValue) {
        if (accLevel === 0) {
          return cellValue
        } else {
          return '&nbsp;' + cellValue
        }
      }
    },
    formatName (accLevel) {
      if (accLevel === 0) {
        return ''
      } else {
        const space = '&nbsp;&nbsp;&nbsp;&nbsp;'
        return space.repeat(accLevel)
      }
    },
    formatForeignMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 4)
    },
    formatMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    routeToDetailReport (row) {
      if (!this.$hasPermission('fzmx-report')) {
        return
      }
      let thisQueryParam = this.getQueryParam()
      let fzCode = row['fzhsx' + thisQueryParam.fzlb + 'code']
      this.$router.push({
        name: 'fzmx-report',
        params: {
          routeParam: {
            kms_first: row.accCode,
            kms_last: row.accCode,
            begindate: thisQueryParam.begindate,
            enddate: thisQueryParam.enddate,
            corpIds: thisQueryParam.corpIds,
            ishasjz: thisQueryParam.ishasjz,
            xskm: 'Y',
            fzlb: row.fzlbid,
            fzxm: fzCode,
            pk_currency: thisQueryParam.pk_currency,
            xswyewfs: thisQueryParam.xswyewfs,
            ishowfs: thisQueryParam.ishowfs
          }
        }
      })
    },
    getSumRow (rows) {
      const sumRow = {}
      const columns = this.$refs.table.columns
      columns.forEach((column, index) => {
        if (index === 1) {
          sumRow[column.property] = '合计'
          return
        } else if (index < 3) {
          return
        }
        const values = rows.map(item => item.accLevel === 0 ? Number(item[column.property]) : 0)
        if (!values.every(value => isNaN(value))) {
          sumRow[column.property] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      Object.entries(sumRow).forEach((key, val) => {
        if (typeof val === 'number') {
          sumRow[key] = this.$options.filters.forThousands(val)
        }
      })
      this.showToolTip = sumRow.bnljjf !== sumRow.bnljdf
      return sumRow
    },
    printTempTypeChange (val) {
      if (val === '1') {
        this.printForm.left = 40
        this.printForm.top = 5
      } else if (val === '2') {
        this.printForm.left = 10
        this.printForm.top = 40
      }
    },
    printDateTypeChange (val) {
      if (val === 'czrq') {
        this.printForm.printdate = formatDate(new Date())
      } else if (val === 'jsrq') {
        this.printForm.printdate = this.queryParam.enddate
      }
    },
    openPrintDialog () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      this.printDialogVisible = true
    },
    printReport () {
      this.savePrintSetting()
      this.$api.AuxiliaryBalanceReport.printPdf('辅助余额表', {
        list: JSON.stringify(this.getExportRows()),
        type: this.printForm.type,
        left: this.printForm.left,
        top: this.printForm.top,
        font: this.printForm['font-size'],
        printdate: this.printForm.printdate,
        showlb: this.printForm.showlb === 'true' ? 'Y' : 'N',
        showbm: this.printForm.showbm === 'true' ? 'Y' : 'N',
        pk_currency: this.queryParam.pk_currency,
        fzlb_name: this.auxiliaryTypeName
      })
      this.printDialogVisible = false
    },
    exportReport () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      console.log('this.corpName-------------->', this.corpName)
      this.$api.AuxiliaryBalanceReport.exportExcel('辅助余额表', {
        list: JSON.stringify(this.getExportRows()),
        corpname: this.corpName,
        period: this.queryParam.qjq,
        columncellattrvos: JSON.stringify(this.getExportColumns()),
        begindate: this.queryParam.qjq + '-01',
        enddate: this.queryParam.qjz + '-01'
      })
    },
    getExportColumns () {
      if (this.showForeignCurrency) {
        return [{'column': 'fzhsxCode', 'columname': '编码', 'rowspan': 2, 'width': 1}, {'column': 'fzhsxName', 'columname': '名称', 'rowspan': 2, 'width': 2}, {'column': 'ybqcyejf', 'columname': '期初余额_借方(原币)', 'width': 2}, {'column': 'qcyejf', 'columname': '期初余额_借方(本位币)', 'width': 2}, {'column': 'ybqcyedf', 'columname': '期初余额_贷方(原币)', 'width': 2}, {'column': 'qcyedf', 'columname': '期初余额_贷方(本位币)', 'width': 2}, {'column': 'ybbqfsjf', 'columname': '本期发生额_借方(原币)', 'width': 2}, {'column': 'bqfsjf', 'columname': '本期发生额_借方(本位币)', 'width': 2}, {'column': 'ybbqfsdf', 'columname': '本期发生额_贷方(原币)', 'width': 2}, {'column': 'bqfsdf', 'columname': '本期发生额_贷方(本位币)', 'width': 2}, {'column': 'ybbnljjf', 'columname': '本年累计发生额_借方(原币)', 'width': 2}, {'column': 'bnljjf', 'columname': '本年累计发生额_借方(本位币)', 'width': 2}, {'column': 'ybbnljdf', 'columname': '本年累计发生额_贷方(原币)', 'width': 2}, {'column': 'bnljdf', 'columname': '本年累计发生额_贷方(本位币)', 'width': 2}, {'column': 'ybqmyejf', 'columname': '期末余额_借方(原币)', 'width': 2}, {'column': 'qmyejf', 'columname': '期末余额_借方(本位币)', 'width': 2}, {'column': 'ybqmyedf', 'columname': '期末余额_贷方(原币)', 'width': 2}, {'column': 'qmyedf', 'columname': '期末余额_贷方(本位币)', 'width': 2}]
      } else {
        return [{'column': 'fzhsxCode', 'columname': '编码', 'rowspan': 2, 'width': 1}, {'column': 'fzhsxName', 'columname': '名称', 'rowspan': 2, 'width': 2}, {'column': 'qcyejf', 'columname': '期初余额_借方', 'width': 2}, {'column': 'qcyedf', 'columname': '期初余额_贷方', 'width': 2}, {'column': 'bqfsjf', 'columname': '本期发生额_借方', 'width': 2}, {'column': 'bqfsdf', 'columname': '本期发生额_贷方', 'width': 2}, {'column': 'bnljjf', 'columname': '本年累计发生额_借方', 'width': 2}, {'column': 'bnljdf', 'columname': '本年累计发生额_贷方', 'width': 2}, {'column': 'qmyejf', 'columname': '期末余额_借方', 'width': 2}, {'column': 'qmyedf', 'columname': '期末余额_贷方', 'width': 2}]
      }
    },
    getExportRows () {
      const titlePeriod = this.queryParam.qjq + '--' + this.queryParam.qjz
      const exportRows = []
      this.tableData.forEach(data => {
        const exportData = Object.assign({}, data)
        if (data.accLevel > 0) {
          exportData.fzhsxCode = ' ' + exportData.fzhsxCode
          exportData.fzhsxName = '  '.repeat(data.accLevel) + exportData.fzhsxName
        }
        exportData.titlePeriod = titlePeriod
        exportData.gs = this.corpName
        exportData.pk_currency = this.queryParam.pk_currency
        exportRows.push(exportData)
      })
      return exportRows
    },
    fetchAuxiliaryArchive (type) {
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: this.auxiliaryTypes.find(item => item.code  === type ).id
      }).then(res => {
        if (res.rows) {
          this.$set(this.auxiliaryArchiveData, type, res.rows)
        } else {
          this.$set(this.auxiliaryArchiveData, type, null)
        }
      })
    },
    fetchPrintSetting () {
      this.$api.Public.queryPrintSetting({
        nodeName: '辅助余额表'
      }).then(res => {
        if (res.success && res.data) {
          let setting = JSON.parse(res.data.print_setting)
          this.printForm = Object.assign(this.printForm, setting)
        }
      })
    },
    savePrintSetting () {
      this.$api.Public.savePrintSetting({
        nodename: '辅助余额表',
        print_setting: JSON.stringify(this.printForm)
      })
    }
  }
}
</script>
