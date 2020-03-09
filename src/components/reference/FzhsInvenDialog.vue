<template>
  <el-dialog
    title="选择存货"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="appendToBody"
    :modal-append-to-body="false"
    @open="onOpenDialog"
    @closed="onDialogClosed"
    :width=setWidth
  >
    <div class="company-select-content">
      <el-input class="search-company-name"  v-model="filtervalue" @blur="filteredData"
                @keydown.enter.native="filteredData" prefix-icon="el-icon-search" placeholder="按存货编码、存货名称、规格(型号)查询"></el-input>
      <el-table
        :data="sortedData"
        ref="invTable"
        height="350"
        :highlight-current-row="highlightSelected"
        @selection-change="handleRowSelection"
        @current-change="handleRowSelected"
        :row-class-name="tableRowClassName"
        @row-click="dblclickRow"
        v-loading="loading"
        element-loading-text="数据加载中，请稍候..."
        element-loading-spinner="el-icon-loading"
        stripe
        border
      >
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column v-if="!singleSelect" type="selection" align="center" width="50"></el-table-column>
        <el-table-column v-if="isshow" prop="kmclassify" header-align="center" align="left" sortable width="120" label="类别(科目)" :formatter="kmforamtter" ></el-table-column>
        <el-table-column prop="code" header-align="center" align="left" sortable width="110" label="存货编码"></el-table-column>
        <el-table-column prop="name"  header-align="center" align="left" show-overflow-tooltip width="140" label="存货名称"></el-table-column>
        <el-table-column prop="spec" header-align="center" align="left" show-overflow-tooltip width="140" label="规格(型号)"></el-table-column>
        <el-table-column prop="unit" header-align="center" align="left" show-overflow-tooltip width="80" label="计量单位"></el-table-column>
        <TableColumnPre  prop="njznum" label="结存数量"  width="120" :pretype = 3></TableColumnPre>
      </el-table>
      <div style="margin-top: 5px;">
        <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"></Pagination>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { orderBy, compare } from 'natural-orderby'
import Pagination from '@/components/Pagination'
import TableColumnPre from '@/components/TableColumnPre/index'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
export default {
  name: 'FzhsInvenDialog',
  components: {
    Pagination,
    TableColumnPre
  },
  props: {
    visible: Boolean,
    singleSelect: Boolean,
    selectFirst: Boolean,
    selectOnDblclick: Boolean,
    appendToBody: Boolean,
    clearSelection: Boolean,
    defaultSelection: {
      type: Array,
      default: function () {
        return []
      }
    },
    queryData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      rawData: [],
      filtervalue: '',
      queryText: '',
      selections: [],
      selected: null,
      total: 0,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      sortMethod: compare()
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.code)
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    highlightSelected () {
      return this.singleSelect === true
    },
    isshow () {
      return this.queryData.isshow
    },
    setWidth () {
      if (this.isshow) {
        return '820px'
      } else {
        return '700px'
      }
    },
    filteredData () {
      let queryText = this.filtervalue
      queryText = queryText.toUpperCase()
      return this.rawData.filter(row => row.code.toUpperCase().indexOf(queryText) > -1 ||
        row.name.toUpperCase().indexOf(queryText) > -1 ||
        (row.spec && row.spec.toUpperCase().indexOf(queryText) > -1))
    },
    tableData () {
      return this.filteredData
    }
  },
  methods: {
    getQueryParam () {
      let param = { ...this.queryData }
      // queryParams:{id:'000001000000000000000006', kmid:kmid}
      Object.assign(param, this.pageInfo)
      param.ispage = 'Y'
      param.id = AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY
      delete param.pageSizes
      return param
    },
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.Auxiliary.queryArchive(this.getQueryParam()).then(result => {
        this.loading = false
        if (result.rows) {
          this.rawData = result.rows
          this.total = result.total
          if (this.selectFirst) {
            this.$refs.invTable.setCurrentRow(this.rawData[0])
          }
          if (!this.singleSelect && this.defaultSelection.length > 0) {
            this.$nextTick(nt => {
              for (let row of this.rawData) {
                if (this.defaultSelection.indexOf(row.id) !== -1) {
                  this.$refs.invTable.toggleRowSelection(row)
                }
              }
            })
          }
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onOpenDialog () {
      this.fetchData()
    },
    onDialogClosed () {
      if (this.clearSelection !== false && this.$refs.invTable) {
        this.$refs.invTable.clearSelection()
      }
    },
    handleRowSelection (val) {
      this.selections = val
    },
    handleRowSelected (val) {
      this.selected = val
    },
    tableRowClassName (row, index) {
      row.row.index = row.rowIndex
    },
    dblclickRow (row) {
      if (this.singleSelect) {
        this.selectInventory(row)
      } else {
        this.$refs.invTable.toggleRowSelection(row)
      }
    },
    onCancel () {
      this.dialogVisible = false
      this.$emit('cancelInv')
    },
    onConfirm () {
      if ((this.singleSelect === true && !this.selected) ||
          (this.singleSelect !== true && (!this.selections || this.selections.length === 0))) {
        this.$message({showClose: true, message: '请选择存货', type: 'warning'})
        return
      }
      this.selectInventory(this.singleSelect ? this.selected : this.selections)
    },
    selectInventory (inventory) {
      if (!this.singleSelect) {
        this.$emit('selected', orderBy(inventory, v => v.index))
      } else {
        this.$emit('selected', inventory)
      }

      this.dialogVisible = false
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

<style scoped lang='less'>
</style>
