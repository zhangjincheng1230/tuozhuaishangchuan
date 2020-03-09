<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
              placement="bottom-start"
              title="期末关账查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.periodRange"
                    type="monthrange"
                    unlink-panels
                    range-separator="-"
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select
                    v-model="queryForm.corpIds"
                    multiple
                    style="width: 315px">
                    <el-option v-for="item in corps"
                               :key="item.pk_gs"
                               :value="item.pk_gs"
                               :label="item.uname"
                               style="width:315px">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="queryConfirm">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                             {{qrydate}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="ongz">关账</el-button>
          <el-button @click="onfangz">反关账</el-button>
          <el-button @click="reflesh">刷新</el-button>
          <el-button @click="print">打印</el-button>
        </div>
      </div>
      <div class="kj-main"
           v-loading="loading"
           element-loading-text="数据加载中，请稍候..."
           element-loading-spinner="el-icon-loading">
        <div class="table-container">
          <el-table
            ref="multipleTable"
            :data="tableData"
            highlight-current-row
            stripe
            border
            tooltip-effect="dark"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              property="qj"
              label="期间"
              header-align="center"
              align="left"
              width="80"
            ></el-table-column>
            <el-table-column
              property="corpname"
              label="公司"
              header-align="center"
              :show-overflow-tooltip="true"
              align="left"
              width="400"
            ></el-table-column>
            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              width="200">
              <template #default="{ row }">
                <router-link tag="a" :to="{name:'qmgzbg',params: {routerParam: row}}"
                             style="color:#2acb42;border:1px solid #2acb42;
                             border-radius:5px;line-height:20px;padding:0px 5px;
                             text-decoration: none" >
                  关账检查
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              property="isgz"
              label="关账"
              header-align="center"
              align="center"
              width="80">
              <template #default="{ row }">
                <el-checkbox  v-if="row.isgz!==undefined && row.isgz==='是'"  v-model="row.isgz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 打印对话框 -->
    <print-dialog ref="printdialog" :enddate ="queryParam.enddate"  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'qmgz',
  mixins: [datePickerMixin],
  components: {
    PrintDialog
  },
  data () {
    return {
      nodename: '关账检查',
      queryVisible: false,
      showFullParam: false,
      queryForm: {
        periodRange: [this.$store.getters.getLoginDate.substr(0, 7), this.$store.getters.getLoginDate.substr(0, 7)],
        corpIds: [this.$store.getters.currentCorp.pk_gs],
        isuncarover: 'N',
        iscarover: 'N'
      },
      qrydate: this.$store.getters.getLoginDate.substr(0, 7) + ' - ' + this.$store.getters.getLoginDate.substr(0, 7),
      loading: false,
      corps: this.$store.getters.corps,
      queryParam: {

      },
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    this.init()
    this.query()
  },
  methods: {
    init () {
      this.loading = true
    },
    queryConfirm () {
      this.qrydate = this.queryForm.periodRange[0] + ' - ' + this.queryForm.periodRange[1]
      this.query()
    },
    query () {
      this.loading = true
      this.$api.qmgz.query(this.getQueryPram()).then(result => {
        this.queryVisible = false
        this.loading = false
        if (result.success === true) {
          this.tableData = result.rows
        } else {
          this.showError(result.msg)
        }
      })
    },
    gzCheckLink (row) {
      this.$router.push({name: 'qmgzbg', params: row})
    },
    // 关账
    ongz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmgz.ongz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.success === true) {
          // this.updateRows(result.rows)
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
        this.reflesh()
      }).catch(e => {
        this.loading = false
      })
    },
    // 反关账
    onfangz () {
      if (!this.checkSelectSum()) {
        return
      }
      if (this.multipleSelection.length === 1) {
        if (this.multipleSelection[0].isgz === undefined || this.multipleSelection[0].isgz === '否') {
          this.showError('所选期间未关账，不能反关账')
          return
        }
        this.loading = true
        this.$api.qmgz.checkLaterMonthGz({data: JSON.stringify(this.multipleSelection[0])}).then(result => {
          this.loading = false
          if (result === true) {
            this.$confirm('是否同时取消以后月份的关账状态', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.postfangz(true)
            }).catch(() => { // 取消操作
              this.postfangz(false)
            })
          } else {
            this.postfangz()
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.postfangz()
      }
    },
    postfangz (laterMonth) {
      let param = this.selectedRows()
      if (laterMonth) {
        param.laterMonth = laterMonth
      }
      this.loading = true
      this.$api.qmgz.onfangz(param).then(result => {
        this.loading = false
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
        this.reflesh()
      }).catch(e => {
        this.loading = false
      })
    },
    // 打印
    print () {
      if (this.tableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        titleperiod: this.qrydate,
        list: JSON.stringify(this.tableData)
      }
      this.$api.qmgz.printPdf(this.nodename, Object.assign(val, otherprintparam))
    },
    checkSelectSum () {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.showError('请选中数据')
        return false
      }
      return true
    },
    selectedRows () {
      return {list: JSON.stringify(this.multipleSelection)}
    },
    updateRows (rows) {
      if (rows) {
        this.tableData = this.tableData.map(obj => rows.find(o => o.pk_id === obj.pk_id) || obj)
      }
    },
    reflesh () {
      this.query()
    },
    rowClick (row) {
      let refsElTable = this.$refs.multipleTable // 获取表格对象
      refsElTable.toggleRowSelection(row)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getQueryPram () {
      this.queryParam.corpslist = this.queryForm.corpIds
      this.queryParam.corpIds = this.queryForm.corpIds.join(',')
      this.queryParam.begindate = this.queryForm.periodRange[0] + '-01'
      this.queryParam.enddate = this.queryForm.periodRange[1] + '-01'
      this.queryParam.userid = this.$store.getters.getUserId
      this.queryParam.clientdate = this.$store.getters.getLoginDate
      return this.queryParam
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'warning'})
    },
    successMsg (msg) {
      this.$message({ dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'success' })
    }
  }
}
</script>
<style scoped>
  >>> .el-checkbox__inner{
    border: 1px solid #409EFF;
  }
  >>> .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  >>> .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #FFFFFF;
  }
  .checkboxshowclass {
    display: block;
  }
  >>> .el-table .cell:hover .checkboxshowclass {
    display: none;
  }
</style>
