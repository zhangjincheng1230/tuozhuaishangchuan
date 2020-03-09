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
          <el-button @click="impDialog">导入</el-button>
          <el-button @click="impOrUpdateDialog">更新导入</el-button>
          <el-button @click="mergeData">存货合并</el-button>
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
            ref="tableRef"
            style="width: 100%">
            <el-table-column  label="序号" type="index" align="center"  width="50"></el-table-column>
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column property="id" label="操作" header-align ="center" align="center" width="160" >
              <template #default="{ row }">
                <el-button type="text" @click="editRow(row)">修改</el-button>
                <span class="opt-split"></span>
                <el-button type="text" @click="delRow(row)">删除</el-button>
                <span class="opt-split"></span>
                <el-button type="text" @click="onAlias(row)">别名</el-button>
              </template>
            </el-table-column>
            <el-table-column property="code" label="编码" header-align ="center" align="left" width="100" > </el-table-column>
            <el-table-column property="name" label="名称" header-align ="center" align="left" width="150" show-overflow-tooltip >
<!--              <template slot-scope="scope">-->
<!--              <span @click="editRow(scope.row)"-->
<!--                      class="spanlink" >{{scope.row.name}}</span>-->
<!--              </template>-->
            </el-table-column>
            <el-table-column v-if="isDetailjz" property="kmclassify" label="存货类别" header-align ="center" align="left" show-overflow-tooltip width="140" :formatter="kmforamtter" ></el-table-column>
            <el-table-column v-if="isDetailjz" property="chukukmid" label="出库科目" header-align ="center" align="left" show-overflow-tooltip width="120" :formatter="kmforamtter" ></el-table-column>
            <el-table-column property="spec" label="规格(型号)" header-align ="center" align="left" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column property="unit" label="计量单位" header-align ="center" align="left" width="150"></el-table-column>
            <TableColumnPre prop="jsprice" label="结算单价" :pretype = 2></TableColumnPre>
<!--            <el-table-column property="vmemo" label="备注" header-align ="center" align="left" width="150" show-overflow-tooltip></el-table-column>-->
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                      @pagination="fetchData"></Pagination>
        </div>
      </div>
      <BatchEditDialog :visible.sync="dialogEditFormVisible" :title="dialogEditFormTitle" :isDetailjz ="isDetailjz"></BatchEditDialog>
      <InventoryDialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :data="formData" @save="onSaved" :isDetailjz ="isDetailjz"></InventoryDialog>
      <MergeDataDialog :visible.sync="dialogMergeFormVisible" :title="dialogMergeFormTitle"></MergeDataDialog>
      <UploaderDialog
        :visible.sync="dialogImpFormVisible"
        name="impfile"
        :title="dialogImpFormTitle"
        @submit="onUpload"
        :param="uploadParam">
        <template #description>
          <div v-if="updateImport" class="import-description">
            支持将原有存货档案导出补全信息再导入
            <a @click="exportTemplate()">点击下载</a>
          </div>
          <div v-else class="import-description">支持标准模板导入,没有导入模板<a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
        </template>
      </UploaderDialog>
    </div>
  </div>
</template>

<script>
import BatchEditDialog from './components/BatchEditDialog'
import UploaderDialog from '@/components/UploaderDialog'
import InventoryDialog from './components/InventoryDialog'
import Pagination from '@/components/Pagination/index'
import MergeDataDialog from './components/MergeDataDialog'
import QueryParam from './components/QueryParam'
import { orderBy } from 'natural-orderby'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import TableColumnPre from '@/components/TableColumnPre/index'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'inventory-doc',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
    QueryParam,
    Pagination,
    BatchEditDialog,
    UploaderDialog,
    InventoryDialog,
    MergeDataDialog,
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
      formData: {},
      chcbjzfs: 0,
      queryParam: {},
      queryVisible: false,
      qrydate: '请录入查询条件',
      updateImport: false,
      // 列表数据过滤
      filters: {
        name: []
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.code)
    },
    isDetailjz () {
      return this.chcbjzfs === 1
    },
    uploadParam () {
      return {
        hid: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY,
        sourcename: '存货档案'
      }
    }
  },
  created () {
  },
  mounted: function mounted () {
    this.initInventoryCBJZ()
    this.fetchData()
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  },
  methods: {
    refreshData () {
      this.initInventoryCBJZ()
      this.fetchData()
    },
    getParam (param) {
      const params = {
        pk_corp: this.$parent.pk_corp,
        id: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY,
        isfenye: 'Y',
        param: param,
        ...this.pageInfo
      }
      delete params.pageSizes
      return params
    },
    clearQueryForm () {
      return this.$refs.queryForm.resetForm()
    },
    query () {
      this.loading = true
      let param = this.getParam()
      param.qrystyle = 'qryinv'
      const queryparam = this.$refs.queryForm.getQueryParam()
      if (queryparam !== false) {
        Object.assign(param, queryparam)
      }
      this.$api.GeneralInventoryApi.InventoryDoc.queryBParam(param).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'name')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
      this.queryVisible = false
    },
    fetchData () {
      this.loading = true
      this.$api.GeneralInventoryApi.InventoryDoc.queryB(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'name')
        } else {
          this.errorMsg(result.msg)
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
      this.updateImport = false
    },
    // 更新导入
    impOrUpdateDialog () {
      this.dialogImpFormTitle = '更新导入'
      this.dialogImpFormVisible = true
      this.updateImport = true
    },
    onUpload (formData) {
      if (!formData) {
        this.errorMsg('请先选择导入文件!')
        return
      }
      this.showLoading('正在导入...')
      // 然后通过下面的方式把内容通过axios来传到后台
      const api = this.updateImport ? this.$api.GeneralInventoryApi.InventoryDoc.impUpdateB : this.$api.GeneralInventoryApi.InventoryDoc.importB
      api(formData).then(result => {
        this.closeLoading()
        if (result.success) {
          if (result.msg) {
            if (this.updateImport) {
              this.successMsg(result.msg)
            } else {
              if (result.msg.indexOf('成功') > 0) {
                this.successMsg(result.msg)
              } else {
                this.errorMsg(result.msg)
              }
            }
          } else {
            this.successMsg('导入成功!')
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.errorMsg('导入失败!')
          }
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    // 批量修改
    batchEdit () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
      } else {
        this.warnMsg('请选择至少一行数据！')
        return
      }
      this.dialogFormTitle = '批量修改'
      this.dialogEditFormVisible = true
    },
    // 批量修改
    mergeData () {
      const rows = this.listSelectedRows
      if (!rows || rows.length === 0 || rows.length === 1) {
        this.warnMsg('请至少选择两行数据！')
        return
      }
      this.dialogMergeFormVisible = true
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
        this.warnMsg('请选择要删除的数据！')
        return
      }
      this.delRows(rows)
    },
    delRow (row) {
      this.delRows([row])
    },
    initInventoryCBJZ () {
      this.$api.GeneralInventoryApi.InventoryDoc.querySetting().then(result => {
        if (result.success) {
          this.chcbjzfs = result.rows.chcbjzfs
        }
      }).catch(e => {
      })
    },
    delRows (rows) {
      let tips = '删除后不可恢复！确定要删除选中的数据？'
      this.showLoading('正在删除...')
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.GeneralInventoryApi.InventoryDoc.deleteB(rows).then(result => {
          this.closeLoading()
          if (result.success) {
            if (result.msg.indexOf('失败') > -1) {
              this.errorMsg(result.msg)
            } else {
              this.successMsg('删除成功!')
            }
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      }).catch(e => {
        this.closeLoading()
      })
    },
    onAlias (rows) {
      this.$router.push({name: 'inventory-alias', params: rows})
    },
    exportTemplate () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        const rows = orderBy(this.$parent.listSelectedRows, v => v.index)
        this.$api.GeneralInventoryApi.InventoryDoc.exportArchiveTemplate({
          daterows: JSON.stringify(rows)
        })
      } else {
        this.$message.warning('请选择至少一行数据导出！')
      }
    },
    expExcel () {
      this.$api.GeneralInventoryApi.InventoryDoc.expExcel({'hid': AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY})
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
      this.$refs.tableRef.toggleRowSelection(row)
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
    },
    jspriceformatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 2, true)
    },
    kmforamtter (row, column, cellValue, index) {
      if (cellValue) {
        const item = this.$store.state.accounting.subjectRefData.find(item => item.id === cellValue)
        return item ? item.kmmc : ''
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
    color: #2C9DD8;
    cursor: pointer;
  }
</style>
