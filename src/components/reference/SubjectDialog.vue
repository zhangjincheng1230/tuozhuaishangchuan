<template>
  <div>
    <el-dialog
      title="选择科目"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @open="onOpenDialog"
      @closed="onDialogClosed"
      width="620px">
      <el-tabs
        v-model="activeName"
        @tab-click="onTabClick"
        v-loading="loading"
        :element-loading-text="loadingText"
        :element-loading-spinner="loadingSpinner">
        <el-tab-pane
          v-for="category in categories"
          :label="category.label"
          :name="category.label"
          :key="category.value"
          style="height: 100%">
          <el-table
            :data="subjectData[category.value]"
            :tree-props="{children: 'children'}"
            :height="350"
            :highlight-current-row="singleSelect"
            default-expand-all
            @current-change="handleRowSelected"
            @row-click="onRowClick"
            @row-dblclick="dblclickRow"
            row-key="id"
            class="tb-edit"
            ref="table">
            <el-table-column
              type="selection"
              v-if="!singleSelect"
              width="55">
            </el-table-column>
            <el-table-column
              prop="codefullname" label="科目" header-align="center">
              <template #default="{row}">
                <template v-if="row.kmcc === 1 && (!row.children || row.children.length === 0)">
                  <div class="prefix-indent"></div>
                  {{row.codefullname}}
                </template>
                <template v-else>
                  {{row.codefullname}}
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div class="dialog-footer">
          <div style="float: left">
            <el-button v-if="addButton" type="primary" @click="openAddDialog">新增</el-button>
          </div>
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <SubjectEditDialog
      :visible.sync="subjectDialogVisible"
      :subject="parentSubject"
      @save="onAddSubject"></SubjectEditDialog>
  </div>
</template>

<script>
/**
 * event:
 *  select 参数:选择的科目
 *  add-subject 参数:新增的科目
 * */

import {CATEGORY} from '@/constants/subject'
import loadingMixin from '@/mixins/loading'
import SubjectEditDialog from '@/view/accounting/settings/subject/components/SubjectEditDialog'

export default {
  name: 'SubjectReferenceDialog',
  mixins: [loadingMixin],
  components: {
    SubjectEditDialog
  },
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
    // 默认勾选的id
    defaultSelection: {
      type: Array,
      default: null
    },
    // 只允许选择末级
    allowLeafOnly: {
      type: Boolean,
      default: true
    },
    // 显示新增按钮
    addButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeName: CATEGORY[0].label,
      categories: CATEGORY,
      subjectData: {},
      selectedRow: {},
      subjectDialogVisible: false,
      loading: false,
      parentSubject: null
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
    defaultSelectionSet () {
      if (this.defaultSelection) {
        let set = new Set()
        this.defaultSelection.forEach(s => set.add(s))
        return set
      }
      return null
    }
  },
  created () {
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.Subject.getSubject({
        excludeSealed: true
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.subjectData = res.rows
          this.$nextTick(() => {
            this.setDefaultSelection()
          })
        }
      })
    },
    getCategoryValueByLabel (label) {
      return this.categories.find(ct => ct.label === label).value
    },
    onTabClick (tab) {
    },
    onOpenDialog () {
      if (this.$_.isEmpty(this.subjectData)) {
        this.fetchData()
      } else {
        this.setDefaultSelection()
      }
    },
    onDialogClosed () {
    },
    setDefaultSelection () {
      if (this.defaultSelectionSet) {
        this.$refs.table.forEach((table, index) => {
          table.clearSelection()
          let subjectArray = this.subjectData[index]
          if (subjectArray) {
            let selections = this.getDefaultSelectionSubject(subjectArray)
            selections.forEach(subject => {
              table.toggleRowSelection(subject, true)
            })
          }
        })
      }
    },
    getDefaultSelectionSubject (subjectArray) {
      let selections = []
      subjectArray.forEach(subject => {
        if (this.defaultSelectionSet.has(subject.id)) {
          selections.push(subject)
        }
        if (subject.children) {
          selections = selections.concat(this.getDefaultSelectionSubject(subject.children))
        }
      })
      return selections
    },
    onCancel () {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    handleRowSelected (row, oldRow) {
      if (this.singleSelect && this.allowLeafOnly && row.yz !== '是') {
        let table = this.getCurrentTable()
        table.setCurrentRow(oldRow)
        return
      }
      let index = this.getCategoryValueByLabel(this.activeName)
      this.selectedRow[index] = row
    },
    onRowClick (row) {
      let table = this.getCurrentTable()
      table.toggleRowSelection(row)
    },
    dblclickRow (row) {
      if (this.singleSelect && this.allowLeafOnly && row.yz !== '是') {
        this.$message.warning('请选择末级科目')
        return
      }
      this.selectData(row)
    },
    openAddDialog () {
      let selectedRow = this.getSelectedRow()
      if (selectedRow) {
        this.parentSubject = selectedRow
        this.subjectDialogVisible = true
      } else {
        this.$message.warning('请选择上级科目')
      }
    },
    getSelectedRow () {
      let index = this.getCategoryValueByLabel(this.activeName)
      return this.selectedRow[index]
    },
    onAddSubject (subject) {
      this.$emit('add-subject', subject)
      this.fetchData()
      this.dialogVisible = false
    },
    getCurrentTable () {
      let index = this.getCategoryValueByLabel(this.activeName)
      return this.$refs.table[index]
    },
    onConfirm () {
      if (this.singleSelect === true) {
        let selectedRow = this.getSelectedRow()
        if (selectedRow) {
          this.selectData(selectedRow)
        } else {
          this.$message.warning('请选择科目')
        }
      } else {
        let selections = []
        this.$refs.table.forEach(table => {
          selections = selections.concat(table.selection)
        })
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
  .el-table .cell {
    white-space: pre-line;
  }
  .tb-edit .el-input-number {
    display: none
  }
  .tb-edit .current-row .el-input-number {
    display: block
  }
  .tb-edit .current-row .el-input-number+span {
    display: none
  }
  .prefix-indent {
    display: inline-block;
    width: 20px;
    margin-right: 3px;
  }
</style>
