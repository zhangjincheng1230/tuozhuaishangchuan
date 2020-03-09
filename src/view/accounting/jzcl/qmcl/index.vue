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
              title="期末结转查询"
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
                    v-model="queryForm.corpname"
                    :readonly="true" style="width: 315px;">
                    <template #suffix>
                      <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="corpdialogVisible = true"></i>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-checkbox
                    label="仅显示未结转"
                    v-model="queryForm.isuncarover"
                    true-label="Y" false-label="N"
                    @change='queryForm.iscarover = !queryForm.isuncarover'
                    style="width: 150px"></el-checkbox>
                  <el-checkbox
                    label="仅显示已结转"
                    true-label="Y" false-label="N"
                    v-model="queryForm.iscarover"
                    @change='queryForm.isuncarover = !queryForm.iscarover'
                    style="width: 150px"></el-checkbox>
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
          <el-dropdown @command="handleCommand">
            <el-button @click="onjtzj">
              计提折旧<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="canceljtzj">反计提折旧</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-button @click="oncbjz">
              成本结转<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="cancelcbjz">反成本结转</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-button @click="onzzsjz">
              增值税结转<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="cancelzzsjz">反增值税结转</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown @command="handleCommand">
            <el-button @click="onjtfjs">
              计提附加税<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="canceljtfjs">反计提附加税</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown @command="handleCommand">
            <el-button @click="onjtsds">
              计提所得税<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="onLossDialog">录入以前年亏损</el-dropdown-item>
                <el-dropdown-item command="canceljtsds">反计提所得税</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-button @click="onhdsytz">
              期末调汇<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="cancelhdsytz">反期末调汇</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-button @click="onsyjz">
              损益结转<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="cancelsyjz">反损益结转</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown @command="handleCommand">
            <el-button @click="onGzCheck">
              关账检查<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="onGz">关&nbsp;&nbsp;&nbsp;账</el-dropdown-item>
                <el-dropdown-item command="cancelgz">反关账</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
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
              width="200"
            ></el-table-column>
            <el-table-column
              property="zjjt"
              label="计提折旧"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HP67',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox  class="checkboxshowclass" v-if="row.zjjt!==undefined && row.zjjt==='是'" v-model="row.zjjt" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="cbjz"
              label="成本结转"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HP34',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox  class="checkboxshowclass" v-if="row.cbjz!==undefined && row.cbjz==='是'" v-model="row.cbjz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="zzsjz"
              label="增值税结转"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HP120',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox  class="checkboxshowclass" v-if="row.zzsjz!==undefined && row.zzsjz==='是'" v-model="row.zzsjz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="jtsj"
              label="计提附加税"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HP39',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox  class="checkboxshowclass" v-if="row.jtsj!==undefined && row.jtsj==='是'" v-model="row.jtsj" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="qysdsjz"
              label="计提所得税"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HP125',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox  class="checkboxshowclass" v-if="row.qysdsjz!==undefined && row.qysdsjz==='是'" v-model="row.qysdsjz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="hdsytz"
              label="期末调汇"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HCH10535',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox class="checkboxshowclass" v-if="row.hdsytz!==undefined && row.hdsytz==='是'" v-model="row.hdsytz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="qjsyjz"
              label="损益结转"
              header-align="center"
              align="center"
              width="100">
              <template #default="{ row }">
                <a class="searchpzshowclass" href='#' @click="searchTzpz('HP32',row.qj,row.pk_gs,row.corpname)"><img style='padding: 0px;margin: 0px;vertical-align: middle' src='../../../../assets/img/jzcg.png'/>&nbsp;联查凭证</a>
                <el-checkbox  class="checkboxshowclass" v-if="row.qjsyjz!==undefined && row.qjsyjz==='是'" v-model="row.qjsyjz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              property="isgz"
              label="关账"
              header-align="center"
              align="center"
              width="80">
              <template #default="{ row }">
                <el-checkbox v-if="row.isgz!==undefined && row.isgz==='是'" v-model="row.isgz" true-label="是" disabled></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <FillBeforeLossDialog :visible.sync="lossdialogVisible" :lossdata="lossdata"></FillBeforeLossDialog>
      <QmTiaohuiDialog :visible.sync="qmthVisible" :qmthdata="qmthdata" :qmthqmclvo="qmthqmclvo" @updatehdsytz="updatehdsytz"></QmTiaohuiDialog>
      <NoICSMjzdialog :visible.sync="noiccbjzvisible" :icinvtentory = "icinvtentory" :qmclvo="qmclvo" @updateqmclinfo="updateqmclinfo"></NoICSMjzdialog>
      <ZanGuDialog :visible.sync="zgdlgvisible"  :zgdata="zgdata" :qmclvo="qmclvo" :noicjzvos="noicjzvos" :zgurl="zgurl" @updateqmclinfo="updateqmclinfo"></ZanGuDialog>
      <IndustryDialog :visible.sync="industrycbjzvisible" :qmclvo="qmclvo" @updateqmclinfo="updateqmclinfo"></IndustryDialog>
      <CorpDialog :visible.sync="corpdialogVisible" @selected="handleCorpSelect"></CorpDialog>
    </div>
  </div>
</template>

<script>
import FillBeforeLossDialog from './components/FillBeforeLossDialog'
import QmTiaohuiDialog from './components/QmTiaohuiDialog'
import NoICSMjzdialog from './components/NoICSMjzdialog'
import ZanGuDialog from './components/ZanGuDialog'
import IndustryDialog from './components/IndustryDialog'
import CorpDialog from '@/components/reference/CorpDialog'
import relateDataMixin from '@/mixins/relate-data'
import { formatDate, getMonthEnd } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'

export default {
  name: 'qmcl',
  mixins: [datePickerMixin, relateDataMixin],
  components: {FillBeforeLossDialog, QmTiaohuiDialog, NoICSMjzdialog, ZanGuDialog, IndustryDialog, CorpDialog},
  data () {
    return {
      reFetchMethod: 'query',
      queryVisible: false,
      showFullParam: false,
      corpdialogVisible: false,
      // 弥补以前年亏损
      lossdialogVisible: false,
      // 弥补以前年亏损数值
      lossdata: {},
      // 期末调汇
      qmthVisible: false,
      // 期末调汇数据
      qmthdata: [],
      // 期末调汇 期末处理VO
      qmthqmclvo: [],
      // 不启用库存
      noiccbjzvisible: false,
      // 期末处理vo，单条处理
      qmclvo: {},
      // 是否是总账存货
      icinvtentory: false,
      // 暂估框visible
      zgdlgvisible: false,
      // 暂估url地址
      zgurl: -1,
      // 暂估数据
      zgdata: [],
      // 不启用库存结转数据
      noicjzvos: [],
      // 工业开始 ，是否显示
      industrycbjzvisible: false,
      queryForm: {
        periodRange: [this.$store.getters.getLoginDate.substr(0, 7), this.$store.getters.getLoginDate.substr(0, 7)],
        corpIds: [this.$store.getters.currentCorp.pk_gs],
        // corpname: this.$store.getters.currentCorp.uname,
        isuncarover: 'N',
        iscarover: 'N'
      },
      qrydate: this.$store.getters.getLoginDate.substr(0, 7) + ' - ' + this.$store.getters.getLoginDate.substr(0, 7),
      loading: false,
      // 有权限 的公司列表
      corps: this.$store.getters.corps,
      queryParam: {

      },
      tableData: [],
      multipleSelection: []
    }
  },
  props: {
    routerParam: {}
  },
  watch: {
    routerParam: {
      handler (val) {
        if (val) {
          if (val.id === 'qmgzbg' || val.id === 'zcfz' || val.id === 'index') {
            this.queryForm.periodRange = [val.rq, val.rq]
            this.queryForm.corpIds = [val.corpIds]
            this.qrydate = this.queryForm.periodRange[0] + ' - ' + this.queryForm.periodRange[1]
            this.init()
            this.query()
          }
        }
      },
      immediate: true
    }
  },
  created () {
    this.init()
    if (!this.routerParam) {
      this.query()
    }
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
      let qparam = {queryparam: this.getQueryPram()}
      this.$api.qmcl.query(qparam).then(result => {
        this.queryVisible = false
        this.loading = false
        if (result.success === true) {
          this.tableData = result.rows
        } else {
          this.showError(result.msg)
        }
      })
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
        const data = this.tableData.map((obj) => {
          let result = rows.find(o => o.pk_id === obj.pk_id)
          if (result !== undefined && result) {
            result.corpname = obj.corpname
            return result
          } else {
            return obj
          }
        })
        this.tableData = data
        this.$nextTick(() => {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        })
      }
    },
    searchTzpz (sourcetype, period, pk_corp, unitname) {
      const startpzdate = period + '-01'
      const endpzdate = getMonthEnd(period + '-01')
      let param = {
        pk_corp: pk_corp,
        period: period,
        sourcebilltype: sourcetype
      }
      this.loading = true
      this.$api.qmcl.queryGlpz(param).then(result => {
        this.loading = false
        if (!result.success) {
          this.showError(result.msg)
        } else {
          if (result.rows && result.rows.length === 0) {
            this.showError('结转数据为空，未生成结转凭证！')
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
              routeParam: { source: 'qmcl', begindate: startpzdate, enddate: endpzdate, gsname: unitname, corpIds: pk_corp, sourcebilltype: sourcetype }
            }
            this.$router.push({name: 'voucher-manage', params: routeParam})
          }
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onjtzj () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.onjtzj(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    canceljtzj () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.canceljtzj(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },

    onzzsjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.onzzsjz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },

    cancelzzsjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.cancelzzsjz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 计提附加税
    onjtfjs () {
      if (!this.checkSelectSum()) {
        return
      }
      const tips = this.jtfjsValidate()
      if (tips !== null && tips.length > 0) {
        this.$confirm(tips.replace(/,/g, '') + '是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.jtfjs()
        }).catch(() => { // 取消操作
        })
      } else {
        this.jtfjs()
      }
    },
    // 计提附加税
    jtfjs () {
      this.loading = true
      this.$api.qmcl.onjtfjs(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 反计提附加税
    canceljtfjs () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.canceljtfjs(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 计提附加税校验
    jtfjsValidate: function () {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        return ''
      }
      // 分组
      const map = new Map()
      this.sortSelectRows().filter((item) => {
        if (item.jtsj !== '是' && item.isybr === '是' && item.zzsjz !== '是') {
          return item
        }
      }).map((item) => {
        if (map.has(item.pk_gs)) {
          map.get(item.pk_gs).push(item)
        } else {
          const arrays = []
          arrays.push(item)
          map.set(item.pk_gs, arrays)
        }
      })
      // 遍历分组
      const gscon = []
      for (let v of map.values()) {
        gscon.push(`公司:${v[0].corpname}<br>`)
        v.map(item => {
          gscon.push('<span style=\'width: 98%;white-space: nowrap\'>' + item.qj + '，增值税未结转</span><br>')
        })
      }
      return gscon.toString()
    },
    // 计提所得税
    onjtsds () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.onjtsds(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 录入以前年亏损
    onLossDialog: function () {
      this.loading = true
      const logindate = this.$store.getters.getLoginDate
      const lossyear = logindate.substring(0, 4)
      const corpid = this.$store.getters.getLoginCorpId
      const paramter = {begindate: logindate, pk_corp: corpid}
      this.$api.qmcl.queryqmLoss(paramter).then(result => {
        this.loading = false
        this.lossdialogVisible = true
        if (result.success === true && result.rows && result.rows.nlossmny) {
          this.lossdata = {lossyear: lossyear, loss: result.rows.nlossmny, pk_corp: corpid}
        } else {
          this.lossdata = {lossyear: lossyear, loss: 0.00, pk_corp: corpid}
        }
      }).catch(e => {
        this.loading = false
        this.lossdialogVisible = false
        this.lossdata = {}
      })
    },
    // 反计提所得税
    canceljtsds () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.canceljtsds(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 期末调汇
    async onhdsytz () {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.showError('请选中数据')
        return
      }
      if (this.multipleSelection.length > 1) {
        this.showError('不允许批量操作')
        return
      }
      // hdsy type代表 1
      // cbjz type代表 0
      if (!this.checkBeforeCbtzHdtz(1)) {
        return
      }
      this.loading = true
      await this.$api.qmcl.queryAdjust(this.selectedRows()).then(result => {
        this.loading = false
        if (result.success === true) {
          this.qmthdata = result.rows
        } else {
          this.qmthdata = []
        }
      }).catch(e => {
        this.qmthdata = []
        this.loading = false
      })
      this.qmthVisible = true
      this.qmthqmclvo = this.multipleSelection
    },
    // 更新期末调汇，期末处理列表
    updatehdsytz (rows) {
      this.updateRows(rows)
    },
    // 反期末调汇
    cancelhdsytz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.cancelhdsytz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 校验成本和期末调汇,,,实际成本并没有调用该功能。
    checkBeforeCbtzHdtz (type) {
      let flag = true
      const paramters = {qmvos: JSON.stringify(this.sortSelectRows()), type: type}
      this.$api.qmcl.checkTemporaryIsExist(paramters).then(result => {
        if (!result.success) {
          if (type === 1) {
            this.showError(result.msg + '不能期末调汇!')
          } else {
            this.showError(result.msg + '不能成本结转!')
          }
          flag = false
        }
      }).catch(e => {
        flag = false
      })
      return flag
    },

    // 损益结转
    onsyjz () {
      if (!this.checkSelectSum()) {
        return
      }
      const tips = this.syjzValidate()
      if (tips !== null && tips.length > 0) {
        this.$confirm(tips.replace(/,/g, '') + '是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.syjz()
        }).catch(() => { // 取消操作
        })
      } else {
        this.syjz()
      }
    },
    syjz () {
      this.loading = true
      this.$api.qmcl.onsyjz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    cancelsyjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.cancelsyjz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 损益结转校验
    syjzValidate () {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        return ''
      }
      // 分组
      const map = new Map()
      this.sortSelectRows().filter((item) => {
        if (item.qjsyjz !== '是') {
          return item
        }
      }).map((item) => {
        if (map.has(item.pk_gs)) {
          map.get(item.pk_gs).push(item)
        } else {
          const arrays = []
          arrays.push(item)
          map.set(item.pk_gs, arrays)
        }
      })
      let tips = []
      // 遍历分组
      for (let v of map.values()) {
        const gscon = []
        v.map(item => {
          if (item.iwb === '是' && item.hdsytz !== '是') {
            gscon.push('汇兑调整、')
          }
          if (item.igdzc === '是' && item.zjjt !== '是') {
            gscon.push('计提折旧、')
          }
          if (item.cbjz !== '是') {
            gscon.push('成本结转、')
          }
          if (item.isybr === '是' && item.zzsjz !== '是') {
            gscon.push('增值税结转、')
          }
          if (item.jtsj !== '是') {
            gscon.push('计提附加税、')
          }
          if (item.qysdsjz !== '是') {
            gscon.push('计提所得税、')
          }
          if (gscon.length > 0) {
            gscon.push('<span style=\'width: 98%;white-space: nowrap\'>' + item.qj + '，没有期末结转</span><br>')
          }
        })
        if (gscon.length > 0) {
          gscon.unshift(`公司:${v[0].corpname}<br>`)
          tips = tips.concat(gscon)
        }
      }
      return tips.toString()
    },
    onGzCheck () {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.showError('请选中数据')
        return
      }
      if (this.multipleSelection.length > 1) {
        this.showError('不允许批量操作')
        return
      }
      // const params = {qj: this.multipleSelection.qj, qjcorpname: this.multipleSelection.corpname, pk_gs: this.multipleSelection.pk_gs}
      this.$router.push({name: 'qmgzbg', params: {routerParam: this.multipleSelection[0]}})
    },
    onGz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      const gzparams = {list: JSON.stringify(this.sortSelectRows())}
      this.$api.qmgz.ongz(gzparams).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 反关账
    cancelgz () {
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
            this.$confirm('是否同时取消以后月份的关账状态', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              iconClass: 'el-icon-warning-outline',
              center: true,
              closeOnClickModal: false,
              closeOnPressEscape: false
            }).then(() => {
              this.postfangz(true)
            }).catch(() => { // 取消操作
              this.postfangz(false)
            })
          } else {
            this.postfangz(false)
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.postfangz()
      }
    },
    postfangz (laterMonth) {
      let rows = this.sortSelectRows()
      let param = {list: JSON.stringify(this.sortSelectRows())}
      // param.funname = '期末处理'
      param.funname = '总账月末反关账'
      if (laterMonth) {
        param.laterMonth = laterMonth
      }
      this.loading = true
      this.$api.qmgz.onfangz(param).then(result => {
        this.loading = false
        if (laterMonth) {
          this.query()
          this.$nextTick(() => {
            if (result.success === true) {
              rows[0].isgz = '否'
              this.updateRows(rows)
            }
          })
        }
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
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
    // 成本结转
    oncbjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      if (this.multipleSelection.length === 1) {
        // 判断当前公司是否已经成本结转
        if (this.multipleSelection[0].cbjz === '是') {
          this.loading = false
          this.showError('已经成本结转，请勿重复结转！')
          return
        }
        const rows = {qmvo: JSON.stringify(this.multipleSelection[0]), zgdata: []}
        this.$api.qmcl.onsinglecbjz(rows).then(result => {
          this.loading = false
          if (result.success === true) {
            // 1. 结转成功
            if (result.msg !== null && result.msg.indexOf('成本结转成功') === 0) {
              if (result.rows !== undefined && result.rows.length > 0) {
                this.updateRows(result.rows)
              }
              this.successMsg(result.msg)
            } else if (result.msg !== null && result.msg.indexOf('总账存货结转期末销售成本') === 0) { // 2. 总账存货结转期末销售成本
              this.noiccbjzvisible = true
              this.icinvtentory = true
              this.qmclvo = this.multipleSelection[0]
            } else if (result.msg !== null && result.msg.indexOf('普通结转期末销售成本') === 0) { // 2. 普通结转期末销售成本
              this.noiccbjzvisible = true
              this.icinvtentory = false
              this.qmclvo = this.multipleSelection[0]
            } else if (result.msg !== null && result.msg.indexOf('暂估') === 0) { // 3. 暂估框
              this.zgdlgvisible = true
              this.qmclvo = this.multipleSelection[0]
              this.zgdata = result.rows
              this.noicjzvos = []
              this.zgurl = 1
            } else if (result.msg !== null && result.msg.indexOf('启用库存工业结转') === 0) { // 4. 启用库存工业结转
              this.industrycbjzvisible = true
              this.qmclvo = this.multipleSelection[0]
            } else if (result.msg !== null && result.msg.indexOf('不启用库存工业结转') === 0) { // 5. 不启用库存工业结转
              this.qmclvo = this.multipleSelection[0]
              const params = {qmclvo: this.qmclvo}
              this.$router.push({name: 'industrycbjz', params: params})
            } else {
              this.successMsg(result.msg)
            }
          } else {
            this.showError(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else if (this.multipleSelection.length > 1) {
        // 批量操作
        this.$api.qmcl.onbatcbjz(this.selectedRows()).then(result => {
          this.loading = false
          if (result.rows !== undefined && result.rows.length > 0) {
            this.updateRows(result.rows)
          }
          if (result.success === true) {
            this.successMsg(result.msg)
          } else {
            this.showError(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      }
    },

    updateqmclinfo (result) {
      if (result && result.success) {
        if (result.msg !== null && result.msg.indexOf('暂估') === 0) { //  不启用库存，加载暂估框
          this.zgdlgvisible = true
          this.qmclvo = this.multipleSelection[0]
          this.zgdata = result.rows
          this.noicjzvos = result.noicjzvos
          this.zgurl = 2
        } else {
          this.updateRows(result.rows)
          this.successMsg(result.msg)
        }
      }
    },

    cancelcbjz () {
      if (!this.checkSelectSum()) {
        return
      }
      this.loading = true
      this.$api.qmcl.cancelCbjz(this.selectedRows()).then(result => {
        this.loading = false
        if (result.rows !== undefined && result.rows.length > 0) {
          this.updateRows(result.rows)
        }
        if (result.success === true) {
          this.successMsg(result.msg)
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
    rowClick (row) {
      let refsElTable = this.$refs.multipleTable // 获取表格对象
      refsElTable.toggleRowSelection(row)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCommand (command) {
      if (command === 'canceljtzj') {
        this.canceljtzj()
      } else if (command === 'cancelzzsjz') {
        this.cancelzzsjz()
      } else if (command === 'canceljtfjs') {
        this.canceljtfjs()
      } else if (command === 'onLossDialog') {
        this.onLossDialog()
      } else if (command === 'canceljtsds') {
        this.canceljtsds()
      } else if (command === 'cancelsyjz') {
        this.cancelsyjz()
      } else if (command === 'cancelhdsytz') {
        this.cancelhdsytz()
      } else if (command === 'onGz') {
        this.onGz()
      } else if (command === 'cancelgz') {
        this.cancelgz()
      } else if (command === 'cancelcbjz') {
        this.cancelcbjz()
      }
    },
    getQueryPram () {
      this.queryParam.corpslist = this.queryForm.corpIds
      this.queryParam.begindate = this.queryForm.periodRange[0] + '-01'
      this.queryParam.enddate = this.queryForm.periodRange[1] + '-01'
      this.queryParam.userid = this.$store.getters.getUserId
      this.queryParam.clientdate = this.$store.getters.getLoginDate
      this.queryParam.iscarover = this.queryForm.iscarover
      this.queryParam.isuncarover = this.queryForm.isuncarover
      return this.queryParam
    },
    handleCorpSelect (corps) {
      let corpNames = []
      let corpIds = []
      corps.forEach(corp => {
        corpNames.push(corp.uname)
        corpIds.push(corp.pk_gs)
      })
      this.queryForm.corpname = corpNames.join(',')
      this.queryForm.corpIds = corpIds
      setTimeout(() => {
        this.queryVisible = true
      }, 50)
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
  a {
    cursor: pointer;
    color: #555;
    text-decoration: none;
    outline: none;
  }

  a:hover {
    color: #2383c0;
    outline: none;
  }

  a:focus {
    outline: none;
  }

  a img {
    border: 0;
  }

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

  .searchpzshowclass {
    display: none; color: #fff
  }
  .checkboxshowclass {
    display: block;
  }
  >>> .el-table .cell:hover .checkboxshowclass {
    display: none;
  }
  >>> .el-table .cell:hover .searchpzshowclass {
    display: block;
  }
</style>
