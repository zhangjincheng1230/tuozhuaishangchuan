<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">启用期间：
          <QueryPeriod :qj.sync="period" @query="onQueryD"></QueryPeriod>
        </div>
        <div class="kj-button-group">
          <el-button @click="sync">同步</el-button>
          <el-button @click="addInfo">新增</el-button>
          <el-button @click="editData">修改</el-button>
          <el-button @click="deleteSelections">删除</el-button>
          <el-button @click="fetchData">刷新</el-button>
          <el-button @click="impDialog">导入</el-button>
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
            <el-table-column label="序号" type="index" align="left"  width="50"></el-table-column>
            <el-table-column type="selection" align="left" width="50"></el-table-column>
            <el-table-column v-if="isDetailjz"  property="chlb" label="存货类别" header-align ="center" align="left" width="130" > </el-table-column>
            <el-table-column property="chbm" label="存货编码" header-align ="center" align="left" width="80" > </el-table-column>
            <el-table-column property="chmc" label="存货名称" header-align ="center" align="left" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column property="spec" label="规格(型号)" header-align ="center" align="left" width="120" show-overflow-tooltip ></el-table-column>
            <el-table-column property="jldw" label="计量单位" header-align ="center" align="left" width="80"></el-table-column>
            <TableColumnPre prop="qcsl" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="qcdj" label="单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="qcje" label="金额"></TableColumnPre>
            <el-table-column property="opdate" label="启用期间" header-align ="center" align="left" width="120"></el-table-column>
            <el-table-column property="memo" label="备注" header-align ="center" align="left" width="150"></el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                      @pagination="fetchData"></Pagination>
        </div>
      </div>
      <InventoryInitDialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :data="formData" :isDetailjz ="isDetailjz" @save="onSaved"></InventoryInitDialog>
      <UploaderDialog
        :visible.sync="dialogImpFormVisible"
        name="impfile"
        :title="dialogImpFormTitle"
        @submit="onUpload"
        :param="uploadParam">
        <template #description>
          <div class="import-description">支持标准模板导入,没有导入模板<a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
        </template>
      </UploaderDialog>
    </div>
  </div>
</template>

<script>
import UploaderDialog from '@/components/UploaderDialog'
import Pagination from '@/components/Pagination/index'
import QueryPeriod from './components/QueryPeriod'
import InventoryInitDialog from './components/InventoryInitDialog'
import { orderBy } from 'natural-orderby'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import TableColumnPre from '@/components/TableColumnPre/index'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'inventory-init',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
    QueryPeriod,
    UploaderDialog,
    InventoryInitDialog,
    TableColumnPre,
    Pagination
  },
  data () {
    return {
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      period: this.$store.getters.getLoginDate.substring(0, 7),
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
      formData: {},
      chcbjzfs: 0,
      // 列表数据过滤
      filters: {
        chmc: []
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.chbm)
    },
    uploadParam () {
      return {
        hid: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY,
        sourcename: '存货档案'
      }
    },
    isDetailjz () {
      return this.chcbjzfs === 1
    }
  },
  created () {
    this.fetchData()
    this.initInventoryCBJZ()
  },
  mounted: function mounted () {
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
        isfenye: 'Y',
        param: param,
        ...this.pageInfo
      }
      delete params.pageSizes
      return params
    },
    fetchData () {
      this.loading = true
      this.$api.GeneralInventoryApi.InventoryInit.query(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'chmc')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onQueryD () {
      this.fetchData()
    },
    addInfo () {
      this.formData = {}
      this.formData.opdate = this.period + '-01'
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增'
    },
    // 导入
    impDialog () {
      this.dialogImpFormTitle = '导入存货'
      this.dialogImpFormVisible = true
    },
    onUpload (formData) {
      if (!formData) {
        this.errorMsg('请先选择导入文件!')
        return
      }
      this.showLoading('正在导入...')
      // 下面append的东西就会到form表单数据的fields中；
      formData.append('hid', AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY)
      formData.append('date', this.period + '-01')
      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.GeneralInventoryApi.InventoryInit.importExcel(formData).then(result => {
        this.closeLoading()
        if (result.success) {
          if (result.msg) {
            this.errorMsg(result.msg)
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
    editData () {
      let rows = []
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        rows = this.listSelectedRows
      } else {
        this.warnMsg('请选择要修改的数据！')
        return
      }
      rows = orderBy(rows, v => v.index)
      this.editRow(rows[0])
    },
    editRow (row) {
      if (row) {
        this.formData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.dialogFormTitle = '修改'
      } else {
        this.warnMsg('请选择要修改的数据！')
      }
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
    delRows (rows) {
      let tips = '<span style="color: red">您确认删除已勾选的' + rows.length + '条数据吗（该操作不可逆）</span>'
      this.showLoading('正在删除...')
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$api.GeneralInventoryApi.InventoryInit.onDelete(rows).then(result => {
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
    initInventoryCBJZ () {
      this.$api.GeneralInventoryApi.InventoryDoc.querySetting().then(result => {
        if (result.success) {
          this.chcbjzfs = result.rows.chcbjzfs
        }
      }).catch(e => {
      })
    },
    sync () {
      const rows = this.tableData
      let msg = '<span style="color: red">'
      if (rows && rows.length > 0) {
        msg += '同步会清空已录入期初，'
      }
      const date = this.period + '-01'
      msg += '确认同步为' + date + '的期初数据吗（该操作不可逆）</span>'
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
        this.onSync(date)
      }).catch(e => {
      })
    },
    onSync (date, isChangePeriod) {
      this.showLoading('处理中，请稍候...')
      const params = {date: date}
      this.$api.GeneralInventoryApi.InventoryInit.sync(params).then(result => {
        this.closeLoading()
        if (result.success) {
          if (result.msg.indexOf('失败') > -1) {
            this.errorMsg(result.msg)
          } else {
            this.successMsg(result.msg)
          }
          this.fetchData()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    expExcel () {
      this.$api.GeneralInventoryApi.InventoryInit.expExcel({})
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
