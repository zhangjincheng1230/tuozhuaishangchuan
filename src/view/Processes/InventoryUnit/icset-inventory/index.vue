<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div style="margin-left: 5px">查询：
            <el-popover
              placement="bottom-start"
              title="存货查询"
              width="390"
              popper-class="query-popover"
              v-model="queryVisible">
              <QueryParam ref="queryForm"> </QueryParam>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button @click="clearQueryForm">清除</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
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
          <el-button @click="batchEdit">批量修改</el-button>
          <el-button @click="addInfo">新增</el-button>
          <el-button @click="deleteSelections">删除</el-button>
          <el-button @click="impOrUpdateDialog">刷新</el-button>
          <el-button @click="impDialog">导入</el-button>
          <el-button @click="mergeData">存货合并</el-button>
          <el-button @click="generate">生成结算价</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="sortedData"
            highlight-current-row
            @current-change="handleListRowSelect"
            @selection-change="handleListRowSelection"
            :row-class-name="tableRowClassName"
            @row-click="dblclickRow"
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
            stripe
            border
            height="100%"
            ref="refTable"
            style="width: 100%">
            <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column  property="id"  label="操作"  header-align="center"  align="center" width="160"  >
              <template #default="{ row }">
                <el-button type="text" @click="editRow(row)">修改</el-button>
                <span class="opt-split"></span>
                <el-button type="text" @click="delRow(row)">删除</el-button>
                <span class="opt-split" v-if="isIc"></span>
                <el-button type="text" @click="onAlias(row)" v-if="isIc">别名</el-button>
              </template>
            </el-table-column>
            <el-table-column  property="kmbm"   label="科目编码" header-align="center" align="left"  width="120"  ></el-table-column>
            <el-table-column property="kmmc"  label="科目名称" header-align="center" align="left" width="150" ></el-table-column>
            <el-table-column  property="spbm" label="编码" header-align="center" align="left"  width="100" ></el-table-column>
            <el-table-column  property="spmc"  label="名称" header-align="center" align="left" width="150" show-overflow-tooltip ></el-table-column>
            <el-table-column  property="jc"  label="简称" header-align="center" align="left" show-overflow-tooltip  width="100" ></el-table-column>
            <el-table-column  property="splxmc"  label="存货分类" header-align="center" align="left" show-overflow-tooltip  width="100"   ></el-table-column>
            <el-table-column property="gg" label="规格(型号)" header-align="center" align="left" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column  property="jldw"  label="计量单位"  header-align="center" align="left"  width="110" ></el-table-column>

            <el-table-column
              :render-header="headLabel"
              prop="jsjg"
              width="140"
              header-align="center"
              align="right"
              :formatter="formatter"
            >
            </el-table-column>
            <el-table-column  property="bz" label="备注"  header-align="center" align="left" width="150" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination  :total="total"  :page.sync="pageInfo.page"  :limit.sync="pageInfo.rows"  @pagination="fetchData" ></Pagination>
        </div>
      </div>
      <BatchEditDialog  :visible.sync="dialogEditFormVisible"  :title="dialogEditFormTitle" ></BatchEditDialog>
      <InventoryDialog  :visible.sync="dialogFormVisible" :title="dialogFormTitle"  :data="formData"  @save="onSaved" ></InventoryDialog>
      <MergeDataDialog :visible.sync="dialogMergeFormVisible" :title="dialogMergeFormTitle"></MergeDataDialog>
      <UploaderDialog :visible.sync="dialogImpFormVisible"  name="impfile" :title="dialogImpFormTitle"  @submit="onUpload" :param="uploadParam" >
        <template #description>
           <div  class="import-description"> 支持标准模板导入,没有导入模板 <a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
        </template>
      </UploaderDialog>
      <GenerateNewTrade :visible.sync="SettlementAmount"></GenerateNewTrade>
    </div>
  </div>
</template>

<script>
import BatchEditDialog from './compoent/BatchEditDialog'
import UploaderDialog from '@/components/UploaderDialog'
import InventoryDialog from './compoent/InventoryDialog'
import Pagination from '@/components/Pagination/index'
import MergeDataDialog from './compoent/MergeDataDialog'
import QueryParam from './compoent/QueryParam'
import * as MsgUtil from '../../msg-util'
import { orderBy } from 'natural-orderby'
import GenerateNewTrade from './compoent/GenerateNewTrade'
import TableColumnPre from '@/components/TableColumnPre/index'
export default {
  name: 'icset-inventory',
  components: {
    QueryParam,
    Pagination,
    BatchEditDialog,
    UploaderDialog,
    InventoryDialog,
    MergeDataDialog,
    GenerateNewTrade,
    TableColumnPre
  },
  data () {
    return {
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      loginDate: this.$store.getters.getLoginDate,
      loading: false,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      tableData: [],
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      dialogImpFormVisible: false,
      dialogImpFormTitle: '导入存货',
      dialogFormVisible: false,
      dialogFormTitle: '新增',
      dialogEditFormVisible: false,
      dialogEditFormTitle: '批量修改',
      dialogMergeFormVisible: false,
      dialogMergeFormTitle: '存货合并',
      SettlementAmount: false,
      queryParam: {},
      queryVisible: false,
      qrydate: '请录入查询条件',
      formData: {},
      // 列表数据过滤
      filters: {
        spmc: []
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.spbm)
    },
    uploadParam () {
      return {
        pk_corp: this.pk_corp,
        sourcename: '存货档案'
      }
    },
    isIc: {
      get () {
        if (this.$store.getters.currentCorp.buildic === '1') { // 启用进销存
          if (this.$store.getters.currentCorp.buildicstyle === 1) {
            return true
          }
        }
        return false
      }
    }
  },
  created () {
  },
  mounted: function mounted () {
    this.fetchData()
  },
  methods: {
    headLabel (h, { column, $index }) {
      return h('div', {
        'style': 'vertical-align:middle'
      }, [
        h('el-popover', {
          ref: 'popover1',
          props: {
            placement: 'bottom',
            width: '250',
            trigger: 'hover',
            content: '结算价使用在“期末结转-成本结转-产成品结转”功能中，手工录入或通过【生成结算价】功能获取，【生成结算价】取存货当时的结存单价!'
          }
        }),
        h('span', {

        }, [
          '结算价 ',
          h('i', {
            'class': 'el-icon-warning-outline',
            'style': 'color: #FF8C00',
            // 自定义指令
            directives: [
              {
                name: 'popover',
                arg: 'popover1'
              }
            ]
          })
        ])
      ])
    },
    getParam () {
      let param = this.$refs.queryForm.getQueryParam()
      if (param !== false) {
        Object.assign(param, this.pageInfo)
      }
      delete param.pageSizes
      return param
    },
    clearQueryForm () {
      return this.$refs.queryForm.resetForm()
    },
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    formatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, this.$store.getters.pricePre, true)
    },
    fetchData () {
      this.loading = true
      this.$api.InventoryManageApi.IcsetInventory.queryB(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'name')
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    addInfo () {
      this.formData = {}
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增'
    },
    // 导入
    impDialog () {
      this.dialogImpFormTitle = '导入存货'
      this.dialogImpFormVisible = true
    },
    // 刷新
    impOrUpdateDialog () {
      this.fetchData()
    },
    onUpload (formData) {
      if (!formData) {
        MsgUtil.errorMsg(this, '请先选择导入文件!')
        return
      }
      const loading = MsgUtil.loading(this, '正在导入...')
      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.InventoryManageApi.IcsetInventory.impExcel(formData).then(result => {
        loading.close()
        if (result.success) {
          if (!result.msg) {
            MsgUtil.successMsg(this, '导入成功!')
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (!result.msg) {
            MsgUtil.errorMsg(this, '导入失败!')
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
        }
      }).catch(e => {
        loading.close()
      })
    },
    // 批量修改
    batchEdit () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
      } else {
        MsgUtil.warnMsg(this, '请选择至少一行数据！')
        return
      }
      this.dialogFormTitle = '批量修改'
      this.dialogEditFormVisible = true
    },
    // 批量修改
    mergeData () {
      const rows = this.listSelectedRows
      if (!rows || rows.length === 0 || rows.length === 1) {
        MsgUtil.warnMsg(this, '请至少选择两行数据！')
        return
      }
      this.dialogMergeFormVisible = true
    },
    // 生成结算价
    generate () {
      const rows = this.listSelectedRows
      if (!rows || rows.length === 0) {
        MsgUtil.warnMsg(this, '请选中存货行在执行【生成结算价】功能！')
        return
      }
      this.SettlementAmount = true
    },
    editRow (row) {
      this.formData = Object.assign({}, row)
      this.dialogFormVisible = true
      this.dialogFormTitle = '修改'
    },
    onSaved () {
      this.$message.success('保存成功!')
      this.fetchData()
    },
    deleteSelections () {
      let rows = []
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        rows = this.listSelectedRows
      } else {
        MsgUtil.warnMsg(this, '请选择要删除的数据！')
        return
      }
      this.delRows(rows)
    },
    delRow (row) {
      this.delRows([row])
    },
    delRows (rows) {
      let tips = '删除后不可恢复！确定要删除选中的数据？'
      const loading = MsgUtil.loading(this, '正在删除...')
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const ids = rows.reduce((id, row) => id + ',' + row.id, '')
        if (!ids) {
          MsgUtil.warnMsg(this, '请选择至少一行数据!')
        }
        const codes = rows.reduce((spbm, row) => spbm + ',' + row.spbm, '')
        const names = rows.reduce((spmc, row) => spmc + ',' + row.spmc, '')
        this.$api.InventoryManageApi.IcsetInventory.onDelete({
          ids: ids,
          codes: codes,
          names: names,
          gs: this.$store.getters.currentCorp.pk_gs
        }).then(result => {
          loading.close()
          if (result.success) {
            MsgUtil.successMsg(this, result.msg)
            this.fetchData()
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
        }).catch(e => {
          loading.close()
        })
      }).catch(e => {
        loading.close()
      })
    },
    onAlias (rows) {
      this.$router.push({ name: 'icset-alias', params: {routeParam: rows}})
    },
    expExcel () {
      this.$api.InventoryManageApi.IcsetInventory.expExcel()
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
    tableRowClassName (row, index) {
      row.row.index = row.rowIndex
    },
    dblclickRow (row) {
      this.$refs.refTable.toggleRowSelection(row)
    },
    filterHandler (value, row, column) {
      return row[column.property] && row[column.property].indexOf(value) !== -1
    },
    initFilter: function (list, field) {
      this.filters[field] = []
      const tempObj = {}
      for (const idx in list) {
        if (list[idx][field] && !tempObj[list[idx][field]]) {
          if (list[idx][field].indexOf(';') !== -1) {
            const arrayinds = list[idx][field].split(';')
            for (const ics in arrayinds) {
              if (!tempObj[arrayinds[ics]]) {
                this.filters[field].push({ text: arrayinds[ics], value: arrayinds[ics] })
                tempObj[arrayinds[ics]] = arrayinds[ics]
              }
            }
          } else if (list[idx][field].indexOf(',') !== -1) {
            const arrayinds = list[idx][field].split(',')
            for (const ics in arrayinds) {
              if (!tempObj[arrayinds[ics]]) {
                this.filters[field].push({ text: arrayinds[ics], value: arrayinds[ics] })
                tempObj[arrayinds[ics]] = arrayinds[ics]
              }
            }
          } else {
            this.filters[field].push({ text: list[idx][field], value: list[idx][field] })
            list[idx][field] && (tempObj[list[idx][field]] = list[idx][field])
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .opt-split {
    margin: 0 8px;
    border-right: 1px solid #777;
  }
  .import-description {
    text-align: center;
  }
  .import-description a {
    text-decoration: none;
    color: #2c9dd8;
    cursor: pointer;
  }
  .el-icon-my-export{
    background: url('../../../../assets/img/helptool.png') center no-repeat;
    background-size: cover;
  }
</style>
