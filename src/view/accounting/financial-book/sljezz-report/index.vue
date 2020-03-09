<!--数量金额总账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>日期：
            <el-popover
            placement="bottom-start"
            title="数量金额总账查询"
            width="450"
            popper-class="query-popover"
            v-model="queryVisible">
              <el-form ref="form" :model="formParam" label-width="auto">
                <el-form-item label="期间">
                  <el-date-picker
                    v-model="formParam.periodRange"
                    type="monthrange"
                    unlink-panels
                    range-separator="至"
                    :picker-options="monthPickerOptions"
                    value-format="yyyy-MM"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="科目">
                  <el-select
                    v-model="formParam.kms_first"
                    default-first-option
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
                    default-first-option
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
                <el-form-item label="级次">
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
                <el-collapse-transition>
                  <div v-show="showFullParam" style="max-height: 210px">
                    <el-form-item label="">
                      <el-checkbox
                        label="包含未记账凭证"
                        true-label="N" false-label="Y"
                        v-model="formParam.ishasjz"
                        style="width: 150px"></el-checkbox>
                      <el-checkbox
                        label="显示辅助核算"
                        true-label="Y" false-label="N"
                        v-model="formParam.isfzhs"></el-checkbox>
                      <el-checkbox
                        label="无余额无发生不显示"
                        true-label="Y" false-label="N"
                        v-model="formParam.xswyewfs"
                        style="width: 150px"></el-checkbox>
                      <el-checkbox
                        label="有余额无发生不显示"
                        true-label="N" false-label="Y"
                        v-model="formParam.ishowfs"></el-checkbox>
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
                {{ queryParam.qjq + ' 至 ' + queryParam.qjz}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{ corpName }}</span>
        </div>
        <div class="kj-button-group">
          <el-dropdown style="margin-left:10px">
            <el-button >显示累计<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: -1px">
              <div style="width:119px;height:25px">
                <el-checkbox v-model="showcolumnbnljjf" @change="checkchange" true-label="Y" false-label="N">本年累计借方</el-checkbox>
              </div>
              <div >
                <el-checkbox v-model="showcolumnbnljdf" @change="checkchange" true-label="Y" false-label="N">本年累计贷方</el-checkbox>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button @click="print">打印</el-button>
          <el-button @click="exportReport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          ref="reftable"
          :data="tableData"
          highlight-current-row
          v-loading="loading"
          element-loading-text="数据加载中，请稍候..."
          element-loading-spinner="el-icon-loading"
          stripe
          border
          row-key="kmbm"
          default-expand-all
          :tree-props="{children: 'children'}"
          height="100%"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            key="index"
            fixed
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            property="kmbm"
            key="kmbm"
            label="科目编码"
            fixed
            header-align="center"
            show-overflow-tooltip
            width="150"
          >
            <template slot-scope="scope">
              <el-link  type="primary"  @click.stop.prevent="linkKmmx(scope.row)">{{scope.row.kmbm}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            key="kmmc"
            property="kmmc"
            label="科目名称"
            fixed
            header-align="center"
            show-overflow-tooltip
            width="150"
          ></el-table-column>
          <el-table-column
            key="dw"
            property="dw"
            label="计量单位"
            fixed
            header-align="center"
            width="70"
          ></el-table-column>
          <el-table-column
            key="dir"
            property="dir"
            label="方向"
            fixed
            header-align="center"
            show-overflow-tooltip
            width="60"
          ><template #default="scope">
              {{ scope.row.dir == 0 ? "借" : scope.row.dir == 1 ? "贷" : "平" }}
            </template>
          </el-table-column>
          <el-table-column
            key="qcye"
            label="期初余额"
            align="center">
            <el-table-column
              key="qcnum"
              property="qcnum"
              label="数量"
              :formatter="repformum"
              show-overflow-tooltip
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="qcprice"
              property="qcprice"
              label="单价"
              :formatter="repforprice"
              show-overflow-tooltip
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="qcmny"
              property="qcmny"
              label="金额"
              :formatter="repformny"
              show-overflow-tooltip
              header-align="center"
              align="right"
              width="90">
            </el-table-column>
          </el-table-column>
          <el-table-column
            key="bqjf"
            label="本期借方"
            align="center">
            <el-table-column
              key="bqjfnum"
              property="bqjfnum"
              label="数量"
              show-overflow-tooltip
              :formatter="repformum"
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="bqjfmny"
              property="bqjfmny"
              label="金额"
              :formatter="repformny"
              show-overflow-tooltip
              header-align="center"
              align="right"
              width="90">
            </el-table-column>
          </el-table-column>
          <el-table-column
            key="bqdf"
            label="本期贷方"
            align="center">
            <el-table-column
              key="bqdfnum"
              property="bqdfnum"
              label="数量"
              show-overflow-tooltip
              :formatter="repformum"
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="bqdfmny"
              property="bqdfmny"
              label="金额"
              show-overflow-tooltip
              :formatter="repformny"
              header-align="center"
              align="right"
              width="90">
            </el-table-column>
          </el-table-column>
          <el-table-column
            key="bnljjf"
            label="本年累计借方"
            v-if="showcolumnbnljjf == 'Y'"
            align="center">
            <el-table-column
              key="bnjfnum"
              property="bnjfnum"
              label="数量"
              show-overflow-tooltip
              :formatter="repformum"
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="bnjfmny"
              property="bnjfmny"
              label="金额"
              show-overflow-tooltip
              :formatter="repformny"
              header-align="center"
              align="right"
              width="90">
            </el-table-column>
          </el-table-column>
          <el-table-column
            key="bnljdf"
            label="本年累计贷方"
            v-if="showcolumnbnljdf == 'Y'"
            align="center">
            <el-table-column
              key="bndfnum"
              property="bndfnum"
              label="数量"
              show-overflow-tooltip
              :formatter="repformum"
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="bndfmny"
              property="bndfmny"
              label="金额"
              show-overflow-tooltip
              :formatter="repformny"
              header-align="center"
              align="right"
              width="90">
            </el-table-column>
          </el-table-column>
          <el-table-column
            key="qmye"
            label="期末余额"
            align="center">
            <el-table-column
              key="qmnum"
              property="qmnum"
              label="数量"
              :formatter="repformum"
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="qmprice"
              property="qmprice"
              label="单价"
              :formatter="repforprice"
              header-align="center"
              align="right"
              width="100">
            </el-table-column>
            <el-table-column
              key="qmmny"
              property="qmmny"
              label="金额"
              :formatter="repformny"
              header-align="center"
              align="right"
              width="90">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <print-dialog ref="printdialog" :printTempRef="printTempRef" :enddate ="queryParam.enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import { SUBJECT_LEVEL, CURRENCY_RMB } from '@/constants'
import { formatDate, getMonthEnd } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'sljezz-report',
  components: {
    PrintDialog
  },
  mixins: [datePickerMixin],
  data () {
    const loginPeriod = this.$store.getters.getLoginDate.substring(0, 7)
    return {
      nodename: '数量金额总账',
      printSetting: {},

      loading: true,
      queryVisible: false,
      showFullParam: false,
      formParam: {
        periodRange: [loginPeriod, loginPeriod],
        cjq: 1,
        cjz: 5,
        isfzhs: 'Y',
        ishasjz: 'N',
        ishowfs: 'Y',
        xswyewfs: 'Y'
      },
      queryParam: {
        qjq: loginPeriod,
        qjz: loginPeriod
      },
      showcolumnbnljjf: 'N',
      showcolumnbnljdf: 'N',

      pricePre: this.$store.getters.pricePre,
      numPre: this.$store.getters.numPre,

      tableData: [],
      subjectLevel: SUBJECT_LEVEL,
      auxiliaryArchiveData: {},

      printTempRef: [
        { value: '1', label: 'A4纸模板' },
        { value: '2', label: 'B5纸模板' }
      ]
    }
  },
  created () {
    this.fetchData()
    this.querySettingMsg()
  },
  computed: {
    corpName () {
      return this.queryParam.corpIds ? this.corpRef.find(item => item.pk_gs === this.queryParam.corpIds).uname
        : this.$store.getters.getLoginCorp.uname
    },
    subSubjectRef () {
      return this.$store.getters.subSubjectRef
    }

  },
  watch: {
    'showcolumnbnljjf' (newval, oldvalue) {
      if (newval == undefined) {
        this.showcolumnbnljjf = 'N'
      }
      this.$nextTick(() => {
        this.$refs.reftable.doLayout()
      })
    },
    'showcolumnbnljdf' (newval, oldvale) {
      if (newval == undefined) {
        this.showcolumnbnljdf = 'N'
      }
      this.$nextTick(() => {
        this.$refs.reftable.doLayout()
      })
    }
  },
  methods: {
    checkchange () {
      this.saveSettingMsg()
    },
    // 保存设置
    saveSettingMsg () {
      this.printSetting.showcolumnbnljjf = this.showcolumnbnljjf
      this.printSetting.showcolumnbnljdf = this.showcolumnbnljdf
      let param = {
        nodename: this.nodename,
        print_setting: JSON.stringify(this.printSetting),
        updatecolumn: 'print_setting'
      }
      this.$api.printSetting.saveMulColumn(param).then(result => {
      }).catch(e => {
      })
    },
    // 查询报表设置
    querySettingMsg () {
      this.$api.printSetting.printQuerySetting(this.nodename, this.$store.getters.currentCorp.pk_gs).then(result => {
        if (result.success) {
          if (result.rows) {
            if (result.rows.print_setting) {
              this.printSetting = JSON.parse(result.rows.print_setting)
            }
          }
          if (this.printSetting) { // 处理历史数据
            this.showcolumnbnljjf = this.printSetting['showcolumnbnljjf']
            this.showcolumnbnljdf = this.printSetting['showcolumnbnljdf']
          }
        }
      }).catch(e => {
      })
    },
    // 联查科目明细
    linkKmmx (row) {
      if (!this.$hasPermission('sljemxz-report')) {
        return
      }
      this.$router.push({
        name: 'sljemxz-report',
        params: {
          routerParam: {
            id: 'sljezz',
            kmbm: row.kmbm,
            pk_km: row.kmbm,
            queryParam: this.formParam
          }
        }
      })
    },
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    fetchData () {
      this.loading = true
      const queryParam = this.getQueryParam()
      this.$api.SljezzReport.query({
        ...queryParam
      }).then(result => {
        this.loading = false
        this.queryParam = queryParam
        if (result.success) {
          const rows = result.rows
          this.$nextTick(() => {
            // rows.push(this.getSumRow(rows))
            this.tableData = rows
          })
        } else {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'warning'
          })
          this.tableData = []
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
        // begindate: periodBegin + '-01',
        qjz: periodEnd,
        // enddate: getMonthEnd(periodEnd + '-01'),
        cjq: this.formParam.cjq,
        cjz: this.formParam.cjz,
        kms_first: this.formParam.kms_first,
        kms_last: this.formParam.kms_last,
        isfzhs: this.formParam.isfzhs,
        ishasjz: this.formParam.ishasjz,
        ishowfs: this.formParam.ishowfs,
        xswyewfs: this.formParam.xswyewfs
      }

      return param
    },
    repformum (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, this.numPre)
    },
    repforprice (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, this.pricePre)
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    print () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      let list = []
      this.treeConvertList(this.tableData, list)
      let param = {
        list: JSON.stringify(list),
        showjf: this.showcolumnbnljjf,
        showdf: this.showcolumnbnljdf
      }
      this.$api.SljezzReport.printPdf(this.nodename, Object.assign({}, param, val))
    },
    treeConvertList (childs, list) {
      if (childs && childs.length > 0) {
        let temp = null
        for (const tt of childs) {
          temp = JSON.parse(JSON.stringify(tt))
          if (tt.accLevel > 0) {
            temp.fzhsxCode = ' ' + temp.fzhsxCode
            temp.fzhsxName = '  '.repeat(tt.accLevel) + temp.fzhsxName
          }
          // 方向
          temp.dir = temp.dir == 0 ? '借' : temp.dir == 1 ? '贷' : '平'
          temp.titlePeriod = this.queryParam.qjq + '--' + this.queryParam.qjz
          temp.gs = this.corpName
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
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }

      let list = []
      this.treeConvertList(this.tableData, list)
      this.$api.SljezzReport.expExcel(this.nodename, {
        list: JSON.stringify(list),
        qjq: this.formParam.periodRange[0],
        qjz: this.formParam.periodRange[1],
        showjf: this.showcolumnbnljjf,
        showdf: this.showcolumnbnljdf,
        numstr: this.numstr,
        pricestr: this.pricestr
      })
    }
  }
}
</script>
<style scoped>
 >>> .el-checkbox:last-of-type{
    padding-left: 7px
  }
  >>> .el-checkbox__label{
    padding-left: 4px
  }
</style>
