<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <span class="query-corp">存货名称: {{ this.invData.name }}</span>
          <span class="query-corp">规格(型号): {{ this.invData.spec }}</span>
          <span class="query-corp">计量单位: {{ this.invData.unit }}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="addInfo">新增</el-button>
          <el-button @click="editData">修改</el-button>
          <el-button @click="deleteSelections">删除</el-button>
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
            <el-table-column label="序号" type="index" align="center" fixed  width="50"></el-table-column>
            <el-table-column type="selection" align="center" fixed width="50"></el-table-column>
            <el-table-column property="aliasname" label="存货名称" header-align ="center" align="left" width="200">
              <template slot-scope="scope">
              <span @click="editRow(scope.row)"
                      class="spanlink" >{{scope.row.aliasname}}</span>
              </template>
            </el-table-column>
            <el-table-column property="spec" label="规格(型号)" header-align ="center" align="left" width="200"></el-table-column>
            <el-table-column property="unit" label="计量单位" header-align ="center" align="left" width="80"></el-table-column>
            <el-table-column property="calcmode" label="计算模式" header-align ="center" align="left" width="200" :formatter="calcmodeformatter"></el-table-column>
            <el-table-column property="hsl" label="换算关系" header-align ="center" align="right" width="120" :formatter="priceformatter"></el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                      @pagination="fetchData"></Pagination>
        </div>
      </div>
      <InventoryAliasDialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :data="formData" @save="onSaved"></InventoryAliasDialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import InventoryAliasDialog from './components/InventoryAliasDialog'
import { orderBy } from 'natural-orderby'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'inventory-alias',
  mixins: [MessageUtil, Loading],
  components: {
    InventoryAliasDialog,
    Pagination
  },
  data () {
    return {
      pk_corp: this.$store.getters.currentCorp.pk_gs,
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
      dialogFormVisible: false,
      dialogFormTitle: '新增',
      formData: {},
      invData: {},
      // 列表数据过滤
      filters: {
        aliasname: []
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.aliasname)
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'inventory-alias') {
        this.invData = this.$route.params
        this.fetchData()
      }
    }
  },
  created () {
    this.invData = this.$route.params
    this.fetchData()
  },
  mounted: function mounted () {
  },
  methods: {
    getParam () {
      const params = {
        pk_corp: this.$parent.pk_corp,
        isfenye: 'Y',
        pk_inventory: this.invData.id,
        ...this.pageInfo
      }
      delete params.pageSizes
      return params
    },
    fetchData () {
      this.loading = true
      this.$api.GeneralInventoryApi.InventoryAlias.query(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'aliasname')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    addInfo () {
      this.formData = {}
      this.formData.calcmode = 0
      this.formData.type = 'add'
      this.formData.cate_name = this.invData.name
      this.formData.pk_inventory = this.invData.id
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增别名'
    },
    editData () {
      const rows = orderBy(this.listSelectedRows, v => v.index)
      this.editRow(rows[0])
    },
    editRow (row) {
      if (row) {
        row.cate_name = this.invData.name
        row.type = 'edit '
        this.formData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.dialogFormTitle = '修改别名'
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
      let ids = ''
      if (rows && rows.length > 0) {
        ids = rows.reduce((id, row) => id + ',' + row.pk_alias, '')
      } else {
        this.warnMsg('请选择要删除的数据！')
        return
      }
      this.showLoading('正在删除...')
      this.$confirm('确定要删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          pk_aliass: ids,
          aliasname: rows[0].aliasname,
          cate_name: this.invData.name,
          pk_corp: this.pk_corp
        }
        this.$api.GeneralInventoryApi.InventoryAlias.deleteData(param).then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg('删除成功!')
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
    priceformatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 4, true)
    },
    // 计算模式
    calcmodeformatter (row, column, cellValue, index) {
      if (cellValue === 0) {
        return '别名单位*换算关系=原单位'
      } else if (cellValue === 1) {
        return '别名单位/换算关系=原单位'
      }
    }
  }
}
</script>

<style scoped>

</style>
