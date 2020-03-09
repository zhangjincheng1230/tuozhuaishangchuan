<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <QueryPeriod  @query="onQueryD"></QueryPeriod>
        </div>
        <div class="kj-button-group">
          <el-button @click="addInfo">新增</el-button>
          <el-button @click="editData">修改</el-button>
          <el-button @click="deleteSelections">删除</el-button>
          <el-button @click="fetchData('')">刷新</el-button>
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
            show-summary
            :summary-method="getSummaries"
            stripe
            border
            height="100%"
            ref="refTable"
            style="width: 100%">
            <el-table-column label="序号" type="index" align="center"  width="50"></el-table-column>
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column prop="spmc"  label="存货名称" show-overflow-tooltip header-align ="center" align="left" width="120"> </el-table-column>
            <el-table-column  prop="gg" label="规格(型号)" show-overflow-tooltip  header-align ="center" align="left" width="120"> </el-table-column>
            <el-table-column prop="jldwmc" label="计量单位"  header-align ="center" align="left" width="80"></el-table-column>
            <el-table-column prop="kmbm"  label="科目编码"  header-align ="center" align="left"  width="100"> </el-table-column>
            <el-table-column prop="kmmc" label="科目名称"  show-overflow-tooltip  header-align ="center" align="left"  width="100"> </el-table-column>
            <el-table-column  prop="splxmc" label="存货分类"  header-align ="center" align="left" width="100"> </el-table-column>
            <TableColumnPre prop="sl" label="数量" :pretype = 3></TableColumnPre>
            <el-table-column prop="dj" label="单价"   header-align ="center" align="right" width="120" :formatter="priceformatter"></el-table-column>
            <TableColumnPre prop="cb" label="金额" ></TableColumnPre>
            <el-table-column  prop="djrqa" label="单据日期"  header-align ="center" align="left" width="90">  </el-table-column>
            <el-table-column prop="bz" show-overflow-tooltip label="备注"  header-align ="center" align="left" min-width="125"> </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="fetchData"></Pagination>
        </div>
      </div>
      <InventoryInitDialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :data="formData" @save="onSaved"></InventoryInitDialog>
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
import * as MsgUtil from '../../msg-util'
import TableColumnPre from '@/components/TableColumnPre/index'
import { orderBy } from 'natural-orderby'
import { accAdd, calculate } from '@/utils'
export default {
  name: 'icset-init',
  components: {
    QueryPeriod,
    UploaderDialog,
    InventoryInitDialog,
    Pagination,
    TableColumnPre
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
      dialogImpFormTitle: '导入期初',
      dialogFormVisible: false,
      dialogFormTitle: '新增',
      spbm: '',
      formData: {},
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
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        sourcename: '存货期初'
      }
    }
  },
  created () {
    this.fetchData()
  },
  mounted: function mounted () {
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.refTable.doLayout()
    })
  },
  methods: {
    getParam () {
      const params = {
        pk_corp: this.pk_corp,
        isfenye: 'Y',
        searchField: this.spbm,
        ...this.pageInfo
      }
      delete params.pageSizes
      return params
    },
    fetchData () {
      this.loading = true
      this.$api.InventoryManageApi.IcsetInit.queryInfo(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'spmc')
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onQueryD (param) {
      this.spbm = param
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
        MsgUtil.errorMsg(this, '请先选择导入文件!')
        return
      }
      const loading = MsgUtil.loading(this, '正在导入...')
      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.InventoryManageApi.IcsetInit.importExcel(formData).then(result => {
        loading.close()
        if (result.success) {
          if (result.msg) {
            MsgUtil.errorMsg(this, result.msg)
          } else {
            MsgUtil.successMsg(this, '导入成功!')
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (result.msg) {
            MsgUtil.errorMsg(this, result.msg)
          } else {
            MsgUtil.errorMsg(this, '导入失败!')
          }
        }
      }).catch(e => {
        loading.close()
      })
    },
    editData () {
      let rows = []
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        rows = this.listSelectedRows
      } else {
        MsgUtil.warnMsg(this, '请选择要修改的数据！')
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
        MsgUtil.warnMsg(this, '请选择要修改的数据！')
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
        MsgUtil.warnMsg(this, '请选择要删除的数据！')
        return
      }
      this.delRows(rows)
    },
    delRow (row) {
      this.$refs.refTable.toggleRowSelection(row)
      this.delRows([row])
    },
    delRows (rows) {
      let tips = '您确认要删除吗？'
      const loading = MsgUtil.loading(this, '正在删除...')
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
        let ids = ''
        if (rows) {
          rows.forEach(row => {
            ids += row.id + ','
          })
        }
        let param = {
          ids: ids ? ids.toString().substring(0, ids.length - 1) : '',
          pk_corp: this.$store.getters.currentCorp.pk_gs
        }
        this.$api.InventoryManageApi.IcsetInit.DeleteRow(param).then(result => {
          loading.close()
          if (result.success) {
            if (result.msg) {
              MsgUtil.errorMsg(this, result.msg)
            } else {
              MsgUtil.successMsg(this, '删除成功!')
            }
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
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const excludeInx = [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 12]
      columns.forEach((column, index) => {
        if (excludeInx.includes(index)) {
          return
        }
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
        }
      })
      sums.forEach((sum, index) => {
        if (typeof sum === 'number') {
          sums[index] = this.$options.filters.forThousands(sum)
        }
      })
      return sums
    },
    expExcel () {
      this.$api.InventoryManageApi.IcsetInit.expExcel({})
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
    },
    priceformatter (row, column, cellValue, index) {
      cellValue = calculate('div', row.cb, row.sl, this.$store.getters.pricePre)
      return this.$options.filters.forThousands(cellValue, this.$store.getters.pricePre, true)
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
