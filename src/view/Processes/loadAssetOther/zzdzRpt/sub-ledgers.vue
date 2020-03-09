<!--总账对账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">日期：
            <el-popover
              placement="bottom-start"
              title="总账对账查询"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="form"  label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="datevalue"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small" @click="clearPose" >取消</el-button>
                  <el-button size="small" type="primary" @click="addpose">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{datevalue}}
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{corpname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          id="table_list"
          :data="tableList"
          ref="tableCorpRef"
          :height="height"
          stripe
          border
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :cell-style="cellClassFormat"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="zcsx" label="资产属性" width="100" sortable align="center"></el-table-column>
          <el-table-column prop="zclb" label="资产类别" :show-overflow-tooltip="true" width="150" sortable align="center"></el-table-column>
          <el-table-column prop="zckm" label="资产科目" width="150" sortable align="center"></el-table-column>
          <el-table-column prop="zzkmbh" label="总账科目编号" width="120" sortable align="center"></el-table-column>
          <el-table-column prop="zzkmmc" label="总账科目名称" :show-overflow-tooltip="true" width="150" sortable align="center"></el-table-column>
          <el-table-column  prop="zcje" label="资产金额" width="120" align="right"  header-align="center" :formatter="repformny">
          </el-table-column>
          <el-table-column prop="zzje"  label="总账" width="120" align="right"  header-align="center" :formatter="repformny">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <!--打印对话框-->
    <print-dialog ref="printdialog" :enddate ="datevalue" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import printForm from '../../components/printForm'
import BackToTop from '@/components/BackToTop/index'
import {getMonthBegin, formatDate, accSubtr} from '@/utils'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'zzdz',
  mixins: [datePickerMixin],
  components: {
    printForm,
    BackToTop,
    PrintDialog
  },
  data () {
    return {
      nodename: '总账对账',
      visiblePopover: false,
      loading: false,
      tableList: [],
      height: 0,
      corpIds: this.$store.getters.currentCorp.pk_gs,
      corpname: this.$store.getters.currentCorp.uname,
      datevalue: this.$store.getters.getLoginDate
    }
  },
  props: {
    routerParam: {}
  },
  watch: {
    routerParam: {
      handler (val) {
        if (val) {
          this.getDateToRetun()
          this.loadTableList()
        }
      }
    }
  },
  methods: {
    // 单元格颜色
    cellClassFormat ({row, column, rowIndex, columnIndex}) {
      if (column.property === 'zcje' || column.property === 'zzje') {
        if (accSubtr(row.zcje, row.zzje) !== 0) {
          return 'color:red'
        }
      }
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    addpose: function () {
      this.getDateToRetun()
      this.loadTableList(1)
    },
    clearPose: function () {
      this.visiblePopover = false
    },
    getDateToRetun: function () {
      this.visiblePopover = false
    },
    loadTableList: function (val) {
      this.loading = true
      this.$api.generalLedger.queryData({ start_date: this.datevalue }).then(result => {
        this.loading = false
        if (result.success) {
          this.tableList = result.rows
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    print: function () {
      if (!this.tableList || this.tableList.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        list: JSON.stringify(this.tableList),
        corpName: this.corpname,
        period: this.datevalue
      }
      this.$api.generalLedger.printData(this.nodename, Object.assign({}, val, otherprintparam))
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          message: data.msg,
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: data.msg,
          type: 'error'
        })
      }
    }
  },
  created () {
    this.height = window.innerHeight - 175
  },
  mounted () {
    if (!this.routerParam) {
      this.getDateToRetun()
      this.loadTableList()
    }
  }
}
</script>

<style scoped>
.el-main {
  padding: 0;
}
.el-form-item--medium {
  margin-bottom: 10px;
}
</style>
