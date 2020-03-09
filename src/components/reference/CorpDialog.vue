<template>
  <el-dialog
    title="选择公司"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onOpenDialog"
    @closed="onDialogClosed"
    width="620px"
    :modal="modal"
  >
    <div class="company-select-content">
      <el-input
        class="search-company-name"
        v-model="queryInputText"
        @blur="filterData"
        @keydown.enter.native.stop="filterData"
        prefix-icon="el-icon-search"
        placeholder="按编码、名称或做账进度查询"
      ></el-input>
      <el-table
        :data="tableData"
        ref="corpTable"
        :height="maxHeight"
        :highlight-current-row="highlightSelected"
        @selection-change="handleRowSelection"
        @current-change="handleRowSelected"
        @row-dblclick="dblclickRow"
        v-loading="loading"
        element-loading-text="数据加载中，请稍候..."
        element-loading-spinner="el-icon-loading"
        stripe
        border
      >
        <el-table-column
          type="index"
          label="序号"
          show-overflow-tooltip
          align="center" width="50">
        </el-table-column>
        <el-table-column
          v-if="!singleSelect"
          type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column
          prop="incode"
          show-overflow-tooltip
          sortable
          :sort-method="sortMethod"
          header-align="center"
          width="110" label="公司编码">
        </el-table-column>
        <el-table-column
          prop="uname"
          header-align="center"
          show-overflow-tooltip
          label="公司名称">
        </el-table-column>
        <el-table-column
          prop="accountProgress"
          header-align="center"
          width="110"
          show-overflow-tooltip
          sortable
          sort-by="accountProgressDate"
          label="做账进度">
        </el-table-column>
        <el-table-column
          prop="chname"
          sortable
          show-overflow-tooltip width="110" label="公司性质">
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <span v-if="showTips" style="float: left; color: #ffa801">
          <i class="el-icon-warning-outline"></i>
          说明:损益结转后做账进度月自动跳转到下一个月
        </span>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {orderBy, compare} from 'natural-orderby'

export default {
  name: 'CorpDialog',
  props: {
    modal: Boolean,
    visible: Boolean,
    singleSelect: Boolean,
    selectFirst: Boolean,
    selectOnDblclick: Boolean,
    clearSelection: Boolean,
    defaultSelection: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      loading: false,
      rawData: [],
      queryInputText: '',
      queryText: '',
      selections: [],
      selected: null,
      sortMethod: compare()
    }
  },
  computed: {
    maxHeight () {
      return this.$store.getters.maxDialogBodyHeight
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
    filteredData () {
      let queryText = this.queryText
      queryText = queryText.toUpperCase()
      return this.rawData.filter(row => row.accountProgress.indexOf(queryText) > -1 ||
        row.incode.toUpperCase().indexOf(queryText) > -1 ||
        row.uname.toUpperCase().indexOf(queryText) > -1 ||
        (row.pyfc && row.pyfc.toUpperCase().indexOf(queryText) > -1))
    },
    tableData () {
      return this.filteredData
    },
    total () {
      return this.filteredData.length
    },
    showTips () {
      return this.$route.name !== 'login'
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.System.getCorps().then(result => {
        console.log('fetchData-------------------------------')
        this.loading = false
        if (result.rows) {
          let rows = orderBy(result.rows, v => v.incode)
          this.$store.commit('setOwnedCorps', rows)
          this.rawData = rows
          if (this.selectFirst) {
            this.$refs.corpTable.setCurrentRow(this.tableData[0])
          }
          if (!this.singleSelect && this.defaultSelection.length > 0) {
            this.$nextTick(nt => {
              for (let row of this.tableData) {
                if (this.defaultSelection.indexOf(row.pk_gs) !== -1) {
                  this.$refs.corpTable.toggleRowSelection(row)
                  // this.selections.push(row)
                }
              }
            })
          }
        }
      }).catch(e => {
        this.loading = false
      })
    },
    filterData () {
      this.queryText = this.queryInputText
    },
    onOpenDialog () {
      this.rawData = []
      if (this.rawData.length === 0) {
        this.fetchData()
      }
    },
    onDialogClosed () {
      if (this.clearSelection !== false && this.$refs.corpTable) {
        this.$refs.corpTable.clearSelection()
      }
    },
    handleRowSelection (val) {
      this.selections = val
    },
    handleRowSelected (val) {
      this.selected = val
    },
    dblclickRow (row) {
      this.selectCorp(row)
    },
    onCancel () {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    onConfirm () {
      if ((this.singleSelect === true && !this.selected) ||
        (this.singleSelect !== true && (!this.selections || this.selections.length === 0))) {
        this.$message({
          showClose: true,
          message: '请选择公司',
          type: 'error'
        })
        return
      }
      this.selectCorp(this.singleSelect ? this.selected : this.selections)
    },
    selectCorp (corp) {
      this.$emit('selected', corp)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang='less'>
</style>
