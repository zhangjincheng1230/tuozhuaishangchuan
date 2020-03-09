<template>
  <div class="kj-container"
       v-loading="loading"
       :element-loading-text="loadingText"
       :element-loading-spinner="loadingSpinner">
    <div class="kj-head">
      <div class="query-info">
        <div>查询：
          <el-popover
            placement="bottom-start"
            title="查询"
            width="450"
            popper-class="query-popover"
            v-model="queryVisible">
            <el-form ref="form" :model="queryForm" :label-width="labelWidth">
              <!--<el-form-item label="录入期间：">
                <el-date-picker
                  v-model="queryForm.bPeriodRange"
                  type="daterange"
                  unlink-panels
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  style="width: 315px">
                </el-date-picker>
              </el-form-item>
              <el-divider content-position="left"></el-divider>-->
              <el-form-item label="建账日期：">
                <el-date-picker
                  v-model="queryForm.cPeriodRange"
                  type="daterange"
                  unlink-panels
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  style="width: 315px">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="客户编码：" style="width: 315px">
                <el-input v-model="queryForm.qryucode" style="width: 315px"></el-input>
              </el-form-item>
              <el-form-item label="客户名称：" style="width: 315px">
                <el-input v-model="queryForm.qryuname" style="width: 315px"></el-input>
              </el-form-item>
              <el-form-item label="报税地区：" style="width: 315px">
                <el-select
                  v-model="queryForm.iprovince_qry"
                  filterable
                  clearable
                  style="width: 315px">
                  <el-option
                    v-for="item in area_datas"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="query-footer">
              <div class="kj-button-group">
                <el-button @click="queryVisible = false">取消</el-button>
                <el-button type="primary" @click="queryDataByParam">确定</el-button>
              </div>
            </div>
            <span class="query-period" slot="reference">
                      {{ queryDate }}
              <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
            </span>
          </el-popover>
        </div>
      </div>
      <div class="kj-button-group">
        <el-button @click="edit">修改</el-button>
        <el-dropdown style="margin-left:10px">
          <el-button  @click="startGenledic">启用总账核算存货<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: 10px">
            <div @click="stopGenledic">
              <el-dropdown-item>停用总账核算存货</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown style="margin-left:10px">
          <el-button  @click="openFixed">启用资产<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: 10px">
            <div @click="disableFixed">
              <el-dropdown-item>停用资产</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown style="margin-left:10px">
          <el-button  @click="selectProc">启用库存<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: 10px">
            <div @click="disableVan">
              <el-dropdown-item>停用库存</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="kj-main">
      <div class="table-container">
        <el-table
          :data="sortedData"
          ref="multipleTable"
          highlight-current-row
          @row-click="rowClick"
          @current-change="handleListRowSelect"
          @selection-change="handleListRowSelection"

          stripe
          border
          height="100%"
          style="width: 100%">
          <el-table-column type="index" label="序号" align="center" fixed  width="50"></el-table-column>
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column property="incode" label="公司编码" header-align ="center" align="left" show-overflow-tooltip width="115"> </el-table-column>
          <el-table-column property="uname" label="公司名称" header-align ="center" align="left" show-overflow-tooltip width="240"> </el-table-column>
          <el-table-column property="tax_area" label="报税地区" header-align ="center" align="left" show-overflow-tooltip width="85" :formatter="formatOvince"> </el-table-column>
          <el-table-column property="chname" label="纳税人资格" header-align ="center" align="left" show-overflow-tooltip width="110" > </el-table-column>
          <el-table-column property="ctypename" label="会计制度" header-align ="center" align="left" show-overflow-tooltip width="140"> </el-table-column>
          <el-table-column property="bdate" label="建账日期" header-align ="center" align="left" show-overflow-tooltip width="105"> </el-table-column>
          <el-table-column property="icbegindate" label="库存启用日期" header-align ="center" align="left" show-overflow-tooltip width="105"> </el-table-column>
          <el-table-column property="bb_date" label="资产启用日期" header-align ="center" align="left" show-overflow-tooltip width="105"> </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <Pagination :total="total" :pageSizes="[10, 20, 30, 40, 50]" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                    @pagination="fetchData1"></Pagination>
      </div>
    </div>
    <el-dialog title="启用资产"
               :visible.sync="zcDialogVisible"
               width="450px">
      <el-form
        :model="zcFormData"
        ref="zcFormRef">
        <el-form-item label="启用日期："
                      prop="zc_bdate"
                      :rules="[{ required: true, message: '请录入启用日期', trigger: 'change' }]">
          <div style="margin-left: 80px;">
            <el-date-picker
              v-model="zcFormData.zc_bdate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="zcDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onFixed">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="库存启用"
               :visible.sync="kcDialogVisible"
               width="450px">
      <el-form
        :model="kcFormData"
        ref="kcFormRef">
        <el-form-item label="启用日期："
                      prop="ic_bdate"
                      :rules="[{ required: true, message: '请录入启用日期', trigger: 'change' }]">
          <div style="margin-left: 80px;">
            <el-date-picker
              v-model="kcFormData.ic_bdate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="kcDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="enableVan">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination/index'
import QueryParam from './QueryParam'
import { orderBy } from 'natural-orderby'
import datePickerMixin from '@/mixins/date-picker'
import { getMonthBegin } from '@/utils'
import loadingMixin from '@/mixins/loading'
export default {
  name: 'list',
  props: ['queryForm'],
  mixins: [datePickerMixin],
  components: {
    QueryParam,
    Pagination
  },
  mixins: [loadingMixin],
  data () {
    return {
      loading: false,
      pageInfo: {
        page: 1,
        rows: 20
      },
      total: 0,
      tableData: [],
      queryVisible: false,
      labelWidth: '',
      queryDate: '',

      areaDatas: [],

      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      zcDialogVisible: false,
      zcFormData: {
        zc_bdate: getMonthBegin(this.$store.getters.getLoginDate)
      },
      kcDialogVisible: false,
      kcFormData: {
        ic_bdate: getMonthBegin(this.$store.getters.getLoginDate)
      }
    }
  },
  mounted () {
  },
  computed: {
    sortedData () {
      //
      if(this.tableData == null || this.tableData.length == 0) {
        return null
      }
      let data = []
      let currentData = null
      for (let dd of this.tableData) {
        if (dd && dd.pk_gs == this.$store.getters.currentCorp.pk_gs) {
          currentData = dd
          continue
        }
        data.push(dd)
      }
      data = orderBy(data, v => v.incode)
      if (currentData != null) {
        data.splice(0, 0, currentData)
      }
      data = data.splice((this.pageInfo.page - 1) * this.pageInfo.rows,
        this.pageInfo.rows)

      return data
    },
    cardShow: {
      get () {
        return this.cardShow
      },
      set () {
        this.$emit('update:cardShow', false)
      }
    },
    area_datas () {
      return this.$parent.areaDatas
    }
  },
  created () {
    this.queryDataByParam()
  },
  mounted () {
  },
  watch: {
    queryVisible (val) {
      if (val) {
        this.labelWidth = 'auto'
      } else {
        this.labelWidth = ''
      }
    }
  },
  methods: {
    // getBeginDate(value){
    //   let d = new Date()
    //   if(value){
    //       d = d.setMonth(value)
    //
    //   }
    //   d = formatDate(d)
    //   return d
    // },
    fetchData1 () {},
    fetchData () {
      this.queryDataByParam()
    },
    queryDataByParam () {
      this.loading = true
      this.queryVisible = false
      // if (this.queryForm.bPeriodRange) {
      //   this.queryDate = this.queryForm.bPeriodRange[0] +
      //           '至' + this.queryForm.bPeriodRange[1]
      // }
      if (this.queryForm.cPeriodRange) {
        this.queryDate = this.queryForm.cPeriodRange[0] +
                  '至' + this.queryForm.cPeriodRange[1]
      }
      this.$api.BasicSettingApi.CompanySetting.query(this.getQueryParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total

          this.$emit('update:queryForm', this.queryForm)
          this.$parent.successMsg(result.msg)
        } else {
          this.$parent.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    getQueryParam () {
      const params = {
        // begindate: this.queryForm.bPeriodRange ? this.queryForm.bPeriodRange[0] : '',
        // enddate: this.queryForm.bPeriodRange ? this.queryForm.bPeriodRange[1] : '',
        bcreatedate: this.queryForm.cPeriodRange ? this.queryForm.cPeriodRange[0] : '',
        ecreatedate: this.queryForm.cPeriodRange ? this.queryForm.cPeriodRange[1] : '',
        corpcode: this.queryForm.qryucode,
        corpname: this.queryForm.qryuname,
        vprovince: this.queryForm.iprovince_qry,
        page: this.pageInfo.page,
        rows: this.pageInfo.rows
      }

      return params
    },

    formatOvince (row, column, cellValue, index) {
      if (cellValue) {
        let name = this.$parent.areaMaps.get(cellValue)
        if (name) {
          return name
        }
      }
      return ''
    },

    edit () {
      let rows = this.listSelectedRows
      if (rows && rows.length > 1) {
        this.$parent.warnMsg('不允许批量修改数据!')
      }

      if (rows && rows.length == 1) {
        this.$parent.formData = JSON.parse(JSON.stringify(rows[0]))
        this.$parent.cardShow = true
        this.$parent.editStatus = true
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    rowClick (row) {
      let refsElTable = this.$refs.multipleTable // 获取表格对象
      refsElTable.toggleRowSelection(row)
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
    startGenledic () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let corps = new Array()
        let tips = ''
        let flag = false
        let rows = this.listSelectedRows
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          row.primaryKey = row.pk_gs
          if (row.buildic == '1') {
            tips += row.uname + '已启用存货模块<br>'
            continue
          }
          if (row.buildic == '2') {
            tips += row.uname + '已启用总账核算存货<br>'
            continue
          }
          if (row.costforwardstyle == '0' ||
                    row.costforwardstyle == '1' ||
                    row.costforwardstyle == '3') {
            tips += row.uname + '启用总账核算存货，成本结转类型请选择商贸成本结转<br>'
            continue
          }
          if (row.seal == '是' || row.seal == 'Y') {
            tips += row.uname + '已停止服务，不允许此操作<br>'
            continue
          }
          if (!(row.hasaccount == '是' || row.buildic == '1')) {
            tips += row.uname + '未建账，不允许此操作<br>'
            continue
          }

          if (!flag && row.pk_gs === this.$store.getters.currentCorp.pk_gs) {
            flag = true
          }

          corps.push(row)
        }
        if (rows.length > corps.length) {
          this.$parent.warnMsg(tips)
        }
        if (corps.length > 0) {
          let msg = '启用总账核算存货，启用期之前的凭证不处理,只对新的凭证进行存货核算！如需在总账核算存货您还需要调整相应科目存货辅助核算和数量金额核算。您确定启用总账核算存货？'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.loading = true
            this.$api.BasicSettingApi.CompanySetting.updateStGenledic({
              corps: JSON.stringify(corps),
              ly: '2'
            }).then(result => {
              this.loading = false
              if (result.success) {
                this.$parent.successMsg(result.msg)
                this.queryDataByParam()
                if (flag) {
                  this.updateCorpStore()
                }
              } else {
                this.$parent.errorMsg(result.msg)
              }
            }).catch(e => {
              this.loading = false
            })
          })
        }
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    stopGenledic () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let corps = new Array()
        let tips = ''
        let flag = false
        let rows = this.listSelectedRows
        let len = rows.length
        for (let i = 0; i < len; i++) {
          let row = rows[i]
          row.primaryKey = row.pk_gs
          if (row.seal == '是' || row.seal == 'Y') {
            tips += row.uname + '该客户已停止服务，不允许此操作<br>'
            continue
          }
          if (row.buildic == null || row.buildic != '2') { // 没有启用总账库存
            tips += row.uname + '不是启用状态，不能停用<br>'
            continue
          }

          if (!flag && row.pk_gs === this.$store.getters.currentCorp.pk_gs) {
            flag = true
          }

          corps.push(row)
        }
        if (len > corps.length) {
          this.$parent.warnMsg(tips)
        }
        if (corps.length > 0) {
          let msg = '是否确定停用总账库存？'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.loading = true
            this.$api.BasicSettingApi.CompanySetting.updateSpGenledic({
              corps: JSON.stringify(corps),
              ly: '2'
            }).then(result => {
              this.loading = false
              if (result.success) {
                this.$parent.successMsg(result.msg)
                this.queryDataByParam()
                if (flag) {
                  this.updateCorpStore()
                }
              } else {
                this.$parent.errorMsg(result.msg)
              }
            }).catch(e => {
              this.loading = false
            })
          })
        }
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    updateCorpStore () {
      this.$api.BasicSettingApi.CompanySetting.query({
        corpIds: this.$store.getters.currentCorp.pk_gs
      }).then(result => {
        if (result.success) {
          this.$store.commit('setCorpInfo', result.rows[0])
        }
      }).catch(e => {
      })
    },
    openFixed () {
      if (this.listSelectedRows && this.listSelectedRows.length == 1) {
        let row = JSON.parse(JSON.stringify(this.listSelectedRows[0]))
        let tips = ''
        if (row.hflag == '是' || row.hflag == 'Y') {
          tips += row.uname + '已启用固定资产，不可重复启用<br>'
        }
        if (row.seal == '是' || row.seal == 'Y') {
          tips += row.uname + '已停止服务，不允许启用固定资产<br>'
        }
        if (!(row.hasaccount == '是' || row.hasaccount == 'Y')) {
          tips += row.uname + '未建账，不允许启用固定资产<br>'
        }
        if (tips != '') {
          this.$parent.warnMsg(tips)
        } else {
          this.zcDialogVisible = true
        }
      } else if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.zcDialogVisible = true
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    onFixed () {
      if (this.$parent.cardShow) {
        this.zcDialogVisible = false
      } else {
        this.onFixedList()
      }
    },
    onFixedList () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let corps = new Array()
        let tips = ''
        let flag = false
        let rows = this.listSelectedRows
        for (let i = 0; i < rows.length; i++) {
          let row = JSON.parse(JSON.stringify(rows[i]))
          if (row.hflag == '是' || row.hflag == 'Y') {
            tips += row.uname + '已启用固定资产，不可重复启用<br>'
            continue
          }
          if (row.seal == '是' || row.seal == 'Y') {
            tips += row.uname + '已停止服务，不允许启用固定资产<br>'
            continue
          }
          if (!(row.hasaccount == '是' || row.hasaccount == 'Y')) {
            tips += row.uname + '未建账，不允许启用固定资产<br>'
            continue
          }
          row.primaryKey = row.pk_gs
          row.hflag = 'Y'
          row.bb_date = this.zcFormData.zc_bdate

          if (!flag && row.pk_gs === this.$store.getters.currentCorp.pk_gs) {
            flag = true
          }
          corps.push(row)
        }
        if (rows.length > corps.length) {
          this.$parent.warnMsg(tips)
        }
        if (corps.length > 0) {
          this.loading = true
          this.$api.BasicSettingApi.CompanySetting.updateHflag({
            corps: JSON.stringify(corps),
            ly: '2'
          }).then(result => {
            this.loading = false
            if (result.success) {
              this.$parent.successMsg(result.msg)
              this.zcDialogVisible = false
              this.queryDataByParam()
              if (flag) {
                this.updateCorpStore()
              }
            } else {
              this.$parent.errorMsg(result.msg)
            }
          }).catch(e => {
            this.loading = false
          })
        }
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    disableFixed () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let corps = new Array()
        let tips = ''
        let flag = false
        let rows = this.listSelectedRows
        for (let i = 0; i < rows.length; i++) {
          let row = JSON.parse(JSON.stringify(rows[i]))
          if (row.seal == '是' || row.seal == 'Y') {
            tips += row.uname + '已停止服务，不允许此操作<br>'
            continue
          }
          if (row.hflag == null || row.hflag == '否' || row.hflag == 'N') {
            tips += row.uname + '不是启用状态，不能停用<br>'
            continue
          }
          row.primaryKey = row.pk_gs
          row.hflag = 'N'

          if (!flag && row.pk_gs === this.$store.getters.currentCorp.pk_gs) {
            flag = true
          }

          corps.push(row)
        }
        if (rows.length > corps.length) {
          this.$parent.warnMsg(tips)
        }
        if (corps.length > 0) {
          this.loading = true
          this.$api.BasicSettingApi.CompanySetting.updateTyHflag({
            corps: JSON.stringify(corps),
            ly: '2'
          }).then(result => {
            this.loading = false
            if (result.success) {
              this.$parent.successMsg(result.msg)
              this.queryDataByParam()
              if (flag) {
                this.updateCorpStore()
              }
            } else {
              this.$parent.errorMsg(result.msg)
            }
          }).catch(e => {
            this.loading = false
          })
        }
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    selectProc () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let tips = ''
        let row = JSON.parse(JSON.stringify(this.listSelectedRows[0]))
        if (row.buildic == '1') {
          tips += row.uname + '已启用存货模块<br>'
        }
        if (row.buildic == '2') {
          tips += row.uname + '已启用总账核算存货<br>'
        }
        if (row.costforwardstyle == '0' || row.costforwardstyle == '1') {
          tips += row.uname + '启用库存模块，成本结转类型请选择工业成本或商贸成本<br>'
        }
        if (row.seal == '是' || row.seal == 'Y') {
          tips += row.uname + '已停止服务，不允许此操作<br>'
        }
        if (!(row.hasaccount == '是' || row.buildic == '1')) {
          tips += row.uname + '未建账，不允许此操作<br>'
        }

        if (tips == '') {
          this.kcDialogVisible = true
        } else {
          this.$parent.warnMsg(tips)
        }
      } else if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.kcDialogVisible = true
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    enableVan () {
      if (this.$parent.cardShow) {
        this.kcDialogVisible = false
      } else {
        this.onVanList()
      }
    },
    onVanList () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let corps = new Array()
        let tips = ''
        let flag = false
        let rows = this.listSelectedRows
        for (let i = 0; i < rows.length; i++) {
          let row = JSON.parse(JSON.stringify(rows[i]))
          if (row.buildic == '1') {
            tips += row.uname + '已启用存货模块<br>'
            continue
          }
          if (row.buildic == '2') {
            tips += row.uname + '已启用总账核算存货<br>'
            continue
          }
          if (row.costforwardstyle == '0' || row.costforwardstyle == '1') {
            tips += row.uname + '启用库存模块，成本结转类型请选择工业成本或商贸成本<br>'
            continue
          }
          if (row.seal == '是' || row.seal == 'Y') {
            tips += row.uname + '已停止服务，不允许此操作<br>'
            continue
          }
          if (!(row.hasaccount == '是' || row.buildic == '1')) {
            tips += row.uname + '未建账，不允许此操作<br>'
            continue
          }
          row.primaryKey = row.pk_gs
          row.buildic = '1'// 启用进销存
          row.buildicstyle = '1'// 新模式 进销存
          row.icbegindate = this.kcFormData.ic_bdate

          if (!flag && row.pk_gs === this.$store.getters.currentCorp.pk_gs) {
            flag = true
          }

          corps.push(row)
        }
        if (rows.length > corps.length) {
          this.$parent.warnMsg(tips)
        }
        if (corps.length > 0) {
          this.loading = true
          this.$api.BasicSettingApi.CompanySetting.updateBuildic({
            corps: JSON.stringify(corps),
            ly: '2'
          }).then(result => {
            this.loading = false
            if (result.success) {
              this.$parent.successMsg(result.msg)
              this.kcDialogVisible = false
              this.queryDataByParam()
              if (flag) {
                this.updateCorpStore()
              }
            } else {
              this.$parent.errorMsg(result.msg)
            }
          }).catch(e => {
            this.loading = false
          })
        }
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    },
    disableVan () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let corps = new Array()
        let tips = ''
        let flag = false
        let rows = this.listSelectedRows
        let len = rows.length
        for (let i = 0; i < len; i++) {
          let row = JSON.parse(JSON.stringify(rows[i]))
          if (row.seal == '是' || row.seal == 'Y') {
            tips += row.uname + '该客户已停止服务，不允许此操作<br>'
            continue
          }
          if (row.buildic == null || row.buildic != '1') { // 没有启用进销存 模块
            tips += row.uname + '不是启用状态，不能停用<br>'
            continue
          }
          row.primaryKey = row.pk_gs
          row.buildic = '0' // 取消后，回到总账  模式。

          if (!flag && row.pk_gs === this.$store.getters.currentCorp.pk_gs) {
            flag = true
          }

          corps.push(row)
        }
        if (len > corps.length) {
          this.$parent.warnMsg(tips)
        }
        if (corps.length > 0) {
          let msg = '该客户如果存在库存数据，停用后该客户库存单据将被清空，请谨慎操作！'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.loading = true
            this.$api.BasicSettingApi.CompanySetting.updateTyBuildic({
              corps: JSON.stringify(corps),
              ly: '2'
            }).then(result => {
              this.loading = false
              if (result.success) {
                this.$parent.successMsg(result.msg)
                this.queryDataByParam()
                if (flag) {
                  this.updateCorpStore()
                }
              } else {
                this.$parent.errorMsg(result.msg)
              }
            }).catch(e => {
              this.loading = false
            })
          })
        }
      } else {
        this.$parent.warnMsg('请选择需要处理的数据')
      }
    }

  }
}
</script>

<style scoped>

</style>
