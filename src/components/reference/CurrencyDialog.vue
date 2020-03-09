<template>
  <el-dialog
    title="选择币种"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @open="onOpenDialog" width="450px">
    <el-table
      :data="tableData"
      ref="table"
      :highlight-current-row="singleSelect"
      row-key="id"
      :height="maxHeight"
      @selection-change="handleRowSelection"
      @row-click="onRowClick"
      @current-change="handleRowSelected"
      stripe
      border>
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
        prop="code"
        show-overflow-tooltip
        header-align="center"
        width="150" label="币种编码">
      </el-table-column>
      <el-table-column
        prop="name"
        show-overflow-tooltip
        header-align="center" label="币种名称">
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'CurrencyDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 单选
    singleSelect: {
      type: Boolean,
      default: true
    },
    // 默认选中的id
    defaultSelection: {
      type: Array,
      default: null
    },
    // 不能取消选中的id
    fixedSelection: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      tableData: [],
      currentRow: null
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    maxHeight () {
      return this.$store.getters.maxDialogBodyHeight
    }
  },
  methods: {
    fetchData () {
      this.$api.BasicSettingApi.Currency.getCurrencyArchive().then(res => {
        if (res.success) {
          this.tableData = res.rows
          this.$nextTick(() => {
            this.selectDefaultRows()
          })
        }
      })
    },
    onOpenDialog () {
      if (this.$_.isEmpty(this.tableData)) {
        this.fetchData()
      } else {
        this.selectDefaultRows()
      }
    },
    selectDefaultRows () {
      if (this.defaultSelection || this.fixedSelection) {
        this.$refs.table.clearSelection()
        let selectionSet = new Set()
        if (this.defaultSelection) {
          this.defaultSelection.forEach(id => selectionSet.add(id))
        }
        if (this.fixedSelection) {
          this.fixedSelection.forEach(id => selectionSet.add(id))
        }
        selectionSet.forEach(id => {
          let row = this.tableData.find(data => data.id === id)
          if (row) {
            this.$refs.table.toggleRowSelection(row, true)
          }
        })
      }
    },
    onRowClick (row) {
      if (!this.singleSelect) {
        if (this.fixedSelection && this.fixedSelection.find(id => id === row.id)) {
          this.$emit('unselect-fixed', row)
        }
        this.$refs.table.toggleRowSelection(row)
      }
    },
    handleRowSelected (val) {
      this.currentRow = val
    },
    handleRowSelection (selection) {
      if (this.fixedSelection) {
        let selectSet = new Set()
        selection.forEach(data => selectSet.add(data.id))
        let unSelectId = this.fixedSelection.find(id => !selectSet.has(id))
        if (unSelectId) {
          let row = this.tableData.find(data => data.id === unSelectId)
          if (row) {
            console.log(row)
            this.$refs.table.toggleRowSelection(row, true)
          }
        }
      }
    },
    onCancel () {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    onConfirm () {
      if (this.singleSelect === true) {
        let selectedRow = this.currentRow
        if (selectedRow) {
          this.selectData(selectedRow)
        } else {
          this.$message.warning('请选择币种')
        }
      } else {
        let selections = this.$refs.table.selection
        this.selectData(selections)
      }
    },
    selectData (data) {
      this.$emit('select', data)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
