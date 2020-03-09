<!--资产总账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">日期：
            <el-popover
              placement="bottom-start"
              title="资产总账查询"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.periodRange"
                    type="daterange"
                    range-separator="-"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select filterable
                    v-model="queryForm.corpIds"
                    style="width: 315px">
                    <el-option
                      v-for="item in optionsval"
                      :key="item.pk_gs"
                      :label="item.uname"
                      :value="item.pk_gs"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="资产属性：">
                  <el-select v-model="queryForm.zcsx"  placeholder="请选择"  style="width: 315px">
                    <el-option
                      v-for="item in optionsvalue"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small" @click="clearPose" >取消</el-button>
                  <el-button size="small" type="primary" @click="query(value)">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{tabdate}}
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{unam.uname===undefined?valcop:unam.uname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          :data="tableData"
          style="width: 100%;height:100%"
          height="100%"
          stripe
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          border
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column
            prop="qj"
            label="期间"
            align="center"
            width="160"
            sortable
          ></el-table-column>
          <el-table-column prop="zy" label="摘要" align="center" width="150" sortable></el-table-column>
          <el-table-column :label="title1" align="center">
            <el-table-column prop="yzjf" align="right" header-align="center" label="借方" width="150" sortable :formatter="repformny"></el-table-column>
            <el-table-column prop="yzdf" label="贷方" align="right"  header-align="center" width="150" :formatter="repformny"></el-table-column>
            <el-table-column prop="yzye" label="余额" align="right" header-align="center" width="150" sortable :formatter="repformny"></el-table-column>
          </el-table-column>
          <el-table-column :label="title2" align="center">
            <el-table-column prop="ljjf" label="借方" align="right" header-align="center" width="150" sortable :formatter="repformny"></el-table-column>
            <el-table-column prop="ljdf" label="贷方" align="right" header-align="center" width="150" :formatter="repformny"></el-table-column>
            <el-table-column prop="ljye" label="余额" align="right" header-align="center" width="150" sortable :formatter="repformny"></el-table-column>
          </el-table-column>
          <el-table-column prop="jzye" label="净值余额" align="right" width="150" header-align="center" sortable :formatter="repformny"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <print-dialog ref="printdialog" :enddate ="queryForm.enddate"
                  :bshowDir="false"
                  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import CorpDialog from '@/components/reference/CorpDialog'
import {ASSET_PROP} from '@/constants/asset'
import { formatDate, getMonthEnd, getMonthBegin} from '@/utils'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'zczz',
  mixins: [datePickerMixin],
  components: {
    BackToTop,
    CorpDialog,
    PrintDialog
  },
  data () {
    return {
      nodename: '资产总账',
      value: '',
      tabdate: getMonthBegin(this.$store.getters.getLoginDate.substring(0, 7)) + '-' + getMonthEnd(this.$store.getters.getLoginDate.substring(0, 7)),
      loading: false,
      tableData: [],
      optionsvalue: ASSET_PROP,
      IsShowDate: true,
      lists: [],
      dialogVisible: false,
      optionsval: this.$store.getters.corps,
      queryForm: {
        periodRange: [getMonthBegin(this.$store.getters.getLoginDate.substring(0, 7)), getMonthEnd(this.$store.getters.getLoginDate.substring(0, 7))],
        begindate: getMonthBegin(this.$store.getters.getLoginDate.substring(0, 7)),
        enddate: getMonthEnd(this.$store.getters.getLoginDate.substring(0, 7)),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        valcop: this.$store.getters.currentCorp.uname,
        zcsx: 0
      },
      unam: {},
      visiblePopover: false,
      title1: '固定资产',
      title2: '累计折旧'
    }
  },
  methods: {
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    formatter (row, column) {
      return row.address
    },
    Xcompe () {
      this.dialogVisible = true
    },
    clearPose: function () {
      this.visiblePopover = false
    },
    // 确认查询
    query (value) {
      this.loading = true
      this.queryForm.begindate = this.queryForm.periodRange[0]
      this.queryForm.enddate = this.queryForm.periodRange[1]
      // 根据属性判断
      if (this.queryForm.zcsx === 0 || this.queryForm.zcsx === 2) {
        this.title1 = '固定资产'
        this.title2 = '累计折旧'
      } else if (this.queryForm.zcsx === 1) {
        this.title1 = '无形资产'
        this.title2 = '累计摊销'
      } else if (this.queryForm.zcsx === 3) {
        this.title1 = '待摊费用'
        this.title2 = '累计摊销'
      }
      this.$api.zczzReport.query(this.queryForm).then(res => {
        this.loading = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.tableData = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.tabdate = this.queryForm.begindate + '-' + this.queryForm.enddate
      this.visiblePopover = false
      this.unam = this.optionsval.find(item => {
        return item.pk_gs === this.queryForm.corpIds
      }) || {}
    },
    print: function () {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        list: JSON.stringify(this.tableData),
        zcsx: this.queryForm.zcsx,
        corpName: this.unam.uname,
        period: this.tabdate
      }
      this.$api.zczzReport.printPdf(this.nodename, Object.assign({}, val, otherprintparam))
    }
  },
  created () {
    this.query()
    this.height = window.innerHeight - 175
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
    })
  },
  mounted () {
  }
}
</script>

<style scoped>
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}
.cell {
  text-align: center;
}
</style>
