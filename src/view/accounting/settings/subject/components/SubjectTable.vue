<template>
  <el-table
    :data="tableData"
    ref="table"
    style="width: 100%;"
    height="100%"
    row-key="id"
    border
    highlight-current-row
    @current-change="handleCurrentChange"
    default-expand-all
    :tree-props="{children: 'children'}">
    <el-table-column
      fixed type="index"
      label="序号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="kmbm" label="科目编码"
      show-overflow-tooltip
      fixed sortable width="200" header-align="center">
      <template #default="{row}">
        <template v-if="row.kmcc === 1 && (!row.children || row.children.length === 0)">
          <div class="prefix-indent"></div>
          {{row.kmbm}}
        </template>
        <template v-else>
          {{row.kmbm}}
        </template>
      </template>
    </el-table-column>
    <el-table-column
      prop="kmmc"
      show-overflow-tooltip
      label="科目名称" fixed width="230" header-align="center">
    </el-table-column>
    <el-table-column
      prop="kmlx" label="科目类型" :formatter="formatCategory" width="100" header-align="center">
    </el-table-column>
    <el-table-column
      prop="kmfx" label="科目方向" :formatter="formatDirection" width="100"
      header-align="center">
    </el-table-column>
    <el-table-column
      prop="kmcc" label="科目层次" width="100" header-align="center" align="right">
    </el-table-column>
    <el-table-column prop="yz" label="是否末级" width="100" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.yz === '是'" disabled>
      </template>
    </el-table-column>
    <el-table-column prop="fc" label="是否封存" width="100" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.fc === '是'" disabled>
      </template>
    </el-table-column>
    <el-table-column
      prop="isfzhs" label="辅助核算" :formatter="formatAuxiliary"
      width="200" header-align="center">
    </el-table-column>
    <el-table-column prop="sfsz" label="数量核算" width="100" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.sfsz === '是'" disabled>
      </template>
    </el-table-column>
    <el-table-column prop="whhs" label="外汇核算" width="100" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.row === '是'" disabled>
      </template>
    </el-table-column>
    <el-table-column prop="whhsmc" label="外汇核算币种" width="200" header-align="center">
    </el-table-column>
    <el-table-column prop="fsefxkz" label="发生额方向控制" width="150" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.fsefxkz === '是'" disabled>
      </template>
    </el-table-column>
    <el-table-column prop="yefxkz" label="余额方向控制" width="100" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.yefxkz === '是'" disabled>
      </template>
    </el-table-column>
    <el-table-column prop="wlhx" label="往来核销" width="100" align="center">
      <template #default="{ row }">
        <input type="checkbox" :checked="row.wlhx === '是'" disabled>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { CATEGORY } from '@/constants/subject'
import { DIRECTIONS } from '@/constants/index'

export default {
  name: 'SubjectTable',
  props: {
    categoryName: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      currentRow: null
    }
  },
  computed: {
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    }
  },
  watch: {
    tableData () {
      this.currentRow = null
      this.$nextTick(() => {
        this.$refs.table.doLayout()
        this.$refs.table.setCurrentRow()
      })
    }
  },
  methods: {
    formatCategory (row, column, cellValue) {
      return CATEGORY.find(item => item.value === cellValue).label
    },
    formatDirection (row, column, cellValue) {
      return DIRECTIONS.find(item => item.value === cellValue).label
    },
    formatAuxiliary (row, column, cellValue) {
      if (cellValue) {
        const charArray = [...cellValue]
        const formatted = charArray.reduce((prev, curr, index) => {
          let newVal = prev
          if (curr === '1') {
            let auxiliaryType = this.auxiliaryTypes.find(item => item.code === index + 1)
            let curName = ''
            if (auxiliaryType) {
              curName = auxiliaryType.name
            }
            if (prev === '') {
              newVal = curName
            } else {
              newVal = prev + '/' + curName
            }
          }
          return newVal
        }, '')
        return formatted
      }
    },
    handleCurrentChange (val) {
      this.currentRow = val
      this.$emit('select', val)
    },
    getSelectedRow () {
      return this.currentRow
    }
  }
}
</script>
<style scoped>
  .prefix-indent {
    display: inline-block;
    width: 20px;
    margin-right: 3px;
  }
</style>
