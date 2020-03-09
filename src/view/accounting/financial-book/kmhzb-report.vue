<!--科目汇总表-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
            placement="bottom-start"
            title="科目汇总表查询"
            width="450"
            popper-class="query-popover"
            v-model="queryVisible">
              <el-form ref="form" :model="formParam" label-width="auto">
                <el-form-item label="日期：">
                  <el-date-picker
                    v-model="formParam.periodRange"
                    type="daterange"
                    unlink-panels
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="科目类型：">
                  <el-select
                    v-model="formParam.shuxing"
                    style="width: 315px">
                    <el-option
                      v-for="item in subjectattr"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label">
                    </el-option>
                  </el-select>
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
                <el-form-item label="级次：">
                  <el-select
                    @change="cjqselect"
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
                    @change="cjzselect"
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
                <el-collapse-transition>
                  <div v-show="showFullParam" style="max-height: 210px">
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
                        true-label="N"
                        false-label="Y"
                        style="width: 150px"></el-checkbox>
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
                {{ this.formParam.periodRange[0] + ' - ' + this.formParam.periodRange[1]}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{ corpName }}</span>
          <span class="query-corp">凭证数: {{ this.bsh }}张</span>
          <span class="query-corp">附件数: {{ this.billCount }}张</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <vxe-table
          ref="xTree"
          resizable
          :data="tableData"
          border
          height="100%"
          v-loading="loading"
          element-loading-text="数据加载中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :size="'small'"
          show-overflow
          :tree-config="{children: 'children', expandAll: true}"
          style="width: 100%">
          <vxe-table-column
            title="序号"
            field="index"
            align="center"
            width="50">
          </vxe-table-column>
          <vxe-table-column
            field="kmlb"
            title="科目类别"
            header-align="center"
            :formatter="formatterkmlb"
            show-overflow-tooltip
            width="150">
          </vxe-table-column>
          <vxe-table-column
            field="kmbm"
            title="科目编码"
            header-align="center"
            width="150"
            show-overflow-tooltip
            tree-node>
          </vxe-table-column>
          <vxe-table-column
            field="kmmc"
            title="科目名称"
            header-align="center"
            show-overflow-tooltip
            width="150">
          </vxe-table-column>
          <vxe-table-column
            field="fsjf"
            title="本期发生借方"
            header-align="center"
            show-overflow-tooltip
            align="right"
            width="120"
            show-overflow-tooltip
            :formatter="repformny">
          </vxe-table-column>
          <vxe-table-column
            field="fsdf"
            title="本期发生贷方"
            header-align="center"
            align="right"
            width="120"
            show-overflow-tooltip
            :formatter="repformny">
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <print-dialog ref="printdialog" :enddate ="this.$store.getters.getLoginDate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import { SUBJECT_LEVEL, SUBJECT_ATTR, CURRENCY_RMB } from '@/constants'
import { getExportColumns, formatDate, getMonthEnd, getMonthBegin } from '@/utils'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'

export default {
  name: 'kmhzb-report',
  mixins: [datePickerMixin],
  components: {
    PrintDialog
  },
  data () {
    const loginDate = this.$store.getters.getLoginDate
    const beginDate = getMonthBegin(loginDate)
    const endDate = getMonthEnd(loginDate)
    return {
      nodename: '科目汇总表',
      loading: true,
      queryVisible: false,
      showFullParam: false,
      bsh: 0,
      billCount: 0,
      formParam: {
        periodRange: [beginDate, endDate],
        cjq: 1,
        cjz: 1,
        shuxing: null,
        pk_currency: 'zhbwb',
        ishasjz: 'N',
        corpIds: this.$store.getters.currentCorp.pk_gs
      },
      tableData: [],
      subjectLevel: SUBJECT_LEVEL,
      subjectattr: SUBJECT_ATTR,

      startindex: 0
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    corpName () {
      return this.formParam.corpIds ? this.corpRef.find(item => item.pk_gs === this.formParam.corpIds).uname
        : this.$store.getters.getLoginCorp.uname
    },
    showForeignCurrency () {
      return this.formParam.pk_currency && this.formParam.pk_currency !== CURRENCY_RMB
    },
    subjectCurrency () {
      return this.$store.state.accounting.subjectCurrency
    },
    subSubjectRef () {
      return this.$store.getters.subjectRef
    },
    corpRef () {
      return this.$store.getters.corps
    }
  },
  watch: {
    tableData: function (val) {
      if (val && val.length > 0) {
        this.startindex = 0
        this.handleTabledata(val)

        let $tree = this.$refs.xTree
        setTimeout(function () {
          $tree.setAllTreeExpansion(true)
        }, 100)
      }
    }
  },
  methods: {
    handleTabledata (data) {
      data.map(item => {
        this.startindex = this.startindex + 1
        item['index'] = this.startindex
        if (item.children) {
          this.handleTabledata(item.children)
        }
      })
    },
    cjqselect (val) {
      if (this.formParam.cjz < val) {
        this.formParam.cjz = val
      }
    },
    cjzselect (val) {
      if (this.formParam.cjq > val) {
        this.formParam.cjq = val
      }
    },
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    fetchData () {
      this.loading = true
      const queryParam = this.getQueryParam()
      this.$api.kmhzbReport.query({
        ...queryParam
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.bsh = result.voucherCount
          this.billCount = result.billCount
          const rows = result.rows
          // this.$nextTick(() => {
          this.tableData = rows
          // })
        } else {
          this.warnMessage(result.msg)
          this.tableData = []
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getQueryParam () {
      const beginDate = this.formParam.periodRange[0]
      const endDate = this.formParam.periodRange[1]
      const param = {
        begindate: beginDate,
        enddate: endDate,
        cjq: this.formParam.cjq,
        cjz: this.formParam.cjz,
        kms_first: this.formParam.kms_first,
        kms_last: this.formParam.kms_last,
        kmsx: this.formParam.shuxing,
        pk_currency: this.formParam.pk_currency === 'zhbwb' ? '' : this.formParam.pk_currency,
        ishasjz: this.formParam.ishasjz
      }
      if (this.formParam.corpIds) {
        param.corpIds = this.formParam.corpIds
      }
      return param
    },
    repformny ({cellValue}) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    formatterkmlb (row) {
      return this.transValue(row.cellValue)
    },
    transValue (val) {
      let x = ''
      switch (parseInt(val)) {
        case 0:
          x = '资产'
          break
        case 1:
          x = '负债'
          break
        case 2:
          x = '共同'
          break
        case 3:
          x = '所有者权益'
          break
        case 4:
          x = '成本'
          break
        case 5:
          x = '损益'
          break
        default:
          x = ''
          break
      }
      return x
    },
    print () {
      if (this.tableData.length === 0) {
        this.showWarnMessage('当前界面数据为空！')
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      this.$api.kmhzbReport.printPdf(this.nodename, this.getPrintParam(val))
    },
    getPrintParam (val) {
      let list = []
      this.treeConvertList(this.tableData, list)
      let printparam = {
        corpName: this.corpName,
        titleperiod: this.formParam.periodRange[0]  + ' - ' + this.formParam.periodRange[1],
        begindate: this.formParam.periodRange[0],
        enddate: this.formParam.periodRange[1],
        voucherCount: this.bsh,
        billCount: this.billCount,
        list: JSON.stringify(list)
      }
      return Object.assign(printparam, val)
    },
    treeConvertList (childs, list) {
      if (childs && childs.length > 0) {
        let temp = null
        for (const tt of childs) {
          temp = JSON.parse(JSON.stringify(tt))
          temp.kmlb = this.transValue(temp.kmlb)

          temp.children = null
          list.push(temp)
          if (tt.children && tt.children.length > 0) {
            this.treeConvertList(tt.children, list)
          }
        }
      }
    },
    exportReport () {
      if (this.tableData.length === 0) {
        this.showWarnMessage('当前界面数据为空！')
        return
      }
      let param = Object.assign({}, this.getPrintParam(),
        { begindate: this.formParam.periodRange ? this.formParam.periodRange[0] : this.formParam.begindate,
          enddate: this.formParam.periodRange ? this.formParam.periodRange[1] : this.formParam.enddate })

      let name = this.nodename + '-' + this.formParam.periodRange[0] + '-' + this.formParam.periodRange[1]
      this.$api.kmhzbReport.expExcel(name, param)
    },

    warnMessage (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      })
    }
  }
}
</script>
