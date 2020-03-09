<template>
  <div class="app-main">
    <div class="kj-container"
         v-loading="loading"
         element-loading-text="请稍候..."
         element-loading-background="rgba(0, 0, 0, 0.5)"
         element-loading-spinner="el-icon-loading">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
              placement="bottom-start"
              title="一键结转查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.periodRange"
                    unlink-panels
                    type="monthrange"
                    range-separator=" - "
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-input
                    v-model="queryForm.corpName"
                    :readonly="true" style="width: 315px;">
                    <template #suffix>
                      <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="corpdialogVisible = true"></i>
                    </template>
                  </el-input>
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
          <el-button @click="reflesh">刷新</el-button>
          <el-button @click="onyjjz">结转</el-button>
          <el-button @click="lianchapz">联查凭证</el-button>
          <el-button @click="cancelyjjz">反结转</el-button>
          <el-button @click="jzsz2">设置</el-button>
          <el-button @click="jumpforjzmb">结转模板</el-button>
        </div>
      </div>
      <div class="kj-main">
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
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              property="qj"
              label="期间"
              header-align="center"
              align="left"
              width="80px"
            ></el-table-column>
            <el-table-column
              property="corpname"
              label="公司"
              header-align="center"
              :show-overflow-tooltip="true"
              align="left"
              width="230px"
            ></el-table-column>
            <el-table-column
              property="jz"
              label="结转状态"
              header-align="center"
              align="center"
              width="100px">
              <template #default="{ row }">
                <el-checkbox v-if="row.jz!==undefined && row.jz==='是'"  v-model="row.jz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <SzDialog :visible.sync="szDialogVisible" @selected="handleSzSelect"></SzDialog>
    <QmTiaohuiDialog :visible.sync="qmthVisible" :qmthdata="qmthdata" :isyjjz="isyjjz" :qmthqmclvo="qmthqmclvo" @updatehdsytz="doyjjzoperate"></QmTiaohuiDialog>
    <ZanGuDialog :visible.sync="zgdlgvisible"  :isyjjz="isyjjz" :zgdata="zgdata" :noicjzvos="noicjzvos"  :qmclvo="qmclvo" :zgurl="zgurl" @updateqmclinfo="doyjjzoperate"></ZanGuDialog>
    <NoICSMjzdialog :visible.sync="noiccbjzvisible" :isyjjz="isyjjz" :icinvtentory = "icinvtentory" :qmclvo="qmclvo" @updateqmclinfo="doyjjzoperate"></NoICSMjzdialog>
    <IndustryDialog :visible.sync="industrycbjzvisible" :isyjjz="isyjjz" :qmclvo="qmclvo" @updateqmclinfo="doyjjzoperate"></IndustryDialog>
    <CorpDialog :visible.sync="corpdialogVisible" @selected="handleCorpSelect"></CorpDialog>
  </div>
</template>

<script>
import SzDialog from './components/SzDialog'
import QmTiaohuiDialog from '../qmcl/components/QmTiaohuiDialog'
import ZanGuDialog from '../qmcl/components/ZanGuDialog'
import NoICSMjzdialog from '../qmcl/components/NoICSMjzdialog'
import IndustryDialog from '../qmcl/components/IndustryDialog'
import CorpDialog from '@/components/reference/CorpDialog'
import { formatDate, getMonthEnd } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
import relateDataMixin from '@/mixins/relate-data'

export default {
  name: 'yjjz',
  mixins: [datePickerMixin, relateDataMixin],
  components: { SzDialog, QmTiaohuiDialog, ZanGuDialog, NoICSMjzdialog, IndustryDialog, CorpDialog },
  data () {
    return {
      reFetchMethod: 'query',
      queryVisible: false,
      queryForm: {
        periodRange: [this.$store.getters.getLoginDate.substr(0, 7), this.$store.getters.getLoginDate.substr(0, 7)],
        corpIds: [this.$store.getters.currentCorp.pk_gs],
        corpName: ''
      },
      qrydate: this.$store.getters.getLoginDate.substr(0, 7) + ' - ' + this.$store.getters.getLoginDate.substr(0, 7),
      loading: false,
      corps: this.$store.getters.corps,
      queryParam: {},
      tableData: [],
      multipleSelection: [],
      szDialogVisible: false,
      corpdialogVisible: false,
      // 一键结转操作步骤
      currentsel: 1,
      jie1: true,
      jie2: true,
      jie3: true,
      jie4: true,
      jie5: true,
      cbjzPara1: [],
      cbjzPara2: [],
      cbjzPara3: [],
      cbjzPara4: [],
      cbjzPara5: [],
      cbjzPara6: [],
      isyjjz: true,
      // 期末调汇
      qmthVisible: false,
      qmthqmclvo: [],
      // 期末调汇数据
      qmthdata: [],
      // 暂估框visible
      zgdlgvisible: false,
      // 暂估url地址
      zgurl: -1,
      // 暂估数据
      zgdata: [],
      noicjzvos: [],
      // 期末处理vo，单条处理
      qmclvo: {},
      // 不启用库存
      noiccbjzvisible: false,
      // 是否是总账存货
      icinvtentory: false,
      // 工业开始 ，是否显示
      industrycbjzvisible: false,
      // 开始步骤
      currentproject: 1
    }
  },
  created () {
    this.query()
  },
  props: {
    noicisyjjz: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    noicisyjjz: {
      handler (noicisyjjz) {
        if (noicisyjjz && noicisyjjz === true) {
          this.currentproject = 3
          this.onyjjz()
        }
      }
    }
  },
  methods: {
    // 一键结转
    onyjjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      const paramters = {
        exrates: [],
        qmclvos: JSON.stringify(this.sortSelectRows()),
        zgdata: [],
        qmjznoiclist: [],
        currentproject: this.currentproject,
        list1: [],
        list2: [],
        list3: [],
        list4: [],
        list5: []
      }
      this.$api.yjjz.onYjjz(paramters).then(data => {
        this.loading = false
        this.doyjjzoperate(data.rows)
      }).catch(e => {
        this.loading = false
      })
    },
    //
    doyjjzoperate (data) {
      if (data.success === true) {
        if (data.statuscode === 100) {
          this.successMsg(data.msg)
          // 工业成本结转数据清空
          this.jie1 = true
          this.jie2 = true
          this.jie3 = true
          this.jie4 = true
          this.jie5 = true
          this.cbjzPara1 = []
          this.cbjzPara2 = []
          this.cbjzPara3 = []
          this.cbjzPara4 = []
          this.cbjzPara5 = []
          this.cbjzPara6 = []
          // 重新加载数据
          this.query()
        } else if (data.statuscode === 200) {
          this.qmthVisible = true
          this.qmthdata = data.listrate
          this.qmthqmclvo = this.multipleSelection
        } else if (data.statuscode === 300) {
          this.zgdata = data.zginfo.torys
          this.qmclvo = this.multipleSelection[0]
          this.zgurl = 3 // 一键结转
          this.zgdlgvisible = true
          this.noicjzvos = data.noicjzvos
        } else if (data.statuscode === 400) {
          this.industrycbjzvisible = true
          this.qmclvo = this.multipleSelection[0]
        } else if (data.statuscode === 500) {
          this.noiccbjzvisible = true
          this.icinvtentory = data.icinvtentory // 是否总账存货
          this.qmclvo = this.multipleSelection[0]
        } else if (data.statuscode === 600) {
          const params = {qmclvo: this.multipleSelection[0], isyjjz: true}
          this.$router.push({name: 'industrycbjz', params: params})
        }
      } else {
        this.showError(data.msg)
      }
    },

    // 取消一键结转
    cancelyjjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.yjjz.cancelYjjz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows.success === true) {
          // 重新加载数据
          this.query()
          this.successMsg(result.rows.msg)
        } else {
          this.showError(result.rows.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 联查凭证
    lianchapz () {
      if (!this.checkSelectSum()) {
        return
      }
      if (this.multipleSelection.length > 1) {
        this.showError('请选中一行数据')
        return
      }
      this.loading = true
      const pk_corp = this.multipleSelection[0].pk_gs
      const period = this.multipleSelection[0].qj
      const unitname = this.multipleSelection[0].corpname
      const startpzdate = period + '-01'
      const endpzdate = getMonthEnd(period + '-01')
      let param = {
        pk_corp: pk_corp,
        period: period,
        sourcebilltype: ''
      }
      this.$api.qmcl.queryGlpz(param).then(result => {
        this.loading = false
        if (!result.success) {
          this.showError(result.msg)
        } else {
          if (result.rows && result.rows.length === 0) {
            this.showError('本期无结转凭证！')
          } else if (result.rows.length === 1) {
            if (!this.$hasPermission('voucher-edit')) {
              return
            }
            this.$router.push({
              name: 'voucher-edit',
              params: {id: result.rows[0].id}
            })
          } else {
            if (!this.$hasPermission('voucher-manage')) {
              return
            }
            let routeParam = {
              routeParam: { source: 'yjjz', begindate: startpzdate, enddate: endpzdate, gsname: unitname, corpIds: pk_corp, sourcebilltype: 'HP34,HP32,HCH10535,HP39,HP120,HP125,HP67' }
            }
            this.$router.push({name: 'voucher-manage', params: routeParam})
          }
        }
      }).catch(e => {
        this.loading = false
      })
    },
    queryConfirm () {
      this.qrydate = this.queryForm.periodRange[0] + ' - ' + this.queryForm.periodRange[1]
      this.query()
    },
    query () {
      this.loading = true
      this.$api.yjjz.query(this.getQueryPram()).then(result => {
        this.queryVisible = false
        this.loading = false
        if (result.success === true) {
          this.tableData = result.rows
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    reflesh () {
      this.query()
    },
    jzsz2 () {
      this.szDialogVisible = true
    },
    handleSzSelect (param) {
      this.loading = true
      this.$api.yjjz.savejzSet(param).then(result => {
        this.loading = false
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    jumpforjzmb () {
      this.$router.push({name: 'transfer-template'})
    },
    checkSelectSum () {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.showError('请选中数据')
        return false
      }
      return true
    },
    sortSelectRows () {
      // 按pk_corp,period排序
      const sortresult = this.multipleSelection.sort((v1, v2) => {
        if (v1.pk_gs + v1.qj < v2.pk_gs + v2.qj) {
          return -1
        } else if (v1.pk_gs + v1.qj > v2.pk_gs + v2.qj) {
          return 1
        } else {
          return 0
        }
      })
      return sortresult
    },
    selectedRows () {
      return {qmvos: JSON.stringify(this.sortSelectRows())}
    },
    updateRows (rows) {
      if (rows) {
        this.$refs.multipleTable.clearSelection()
        const data = this.tableData.map(obj => rows.find(o => o.pk_id === obj.pk_id) || obj)
        this.tableData = data
        this.$nextTick(() => {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        })
      }
    },
    handleCorpSelect (corps) {
      let corpNames = []
      let corpIds = []
      corps.forEach(corp => {
        corpNames.push(corp.uname)
        corpIds.push(corp.pk_gs)
      })
      this.queryForm.corpName = corpNames.join(',')
      this.queryForm.corpIds = corpIds
      setTimeout(() => {
        this.queryVisible = true
      }, 50)
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
      this.queryParam.begindate = this.queryForm.periodRange[0] + '-01'
      this.queryParam.enddate = this.queryForm.periodRange[1] + '-01'
      this.queryParam.clientdate = this.$store.getters.getLoginDate
      return this.queryParam
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
    },
    successMsg (msg) {
      this.$message({
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: msg,
        type: 'success'
      })
    }
  }
}
</script>
<style scoped>
  >>> .el-button--small {
    padding: 9px 8px;
  }
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
</style>
