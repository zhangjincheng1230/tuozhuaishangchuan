<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      highlight-current-row
      @row-click="kcItem"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="codename" label="编码" sortable></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: null
    } },
  name: 'kctable',
  data () {
    return {
      tableData: [{
        id: 1,
        address: '上海市普陀区'
      }, {
        id: 2,
        address: '上海市普'
      }, {
        id: 3,
        address: '上海市',
        children: [{
          id: 31,
          address: '上海市普陀'
        }, {
          id: 32,
          address: '上海市普陀'
        }]
      }, {
        id: 4,
        address: '上海'
      }],
      Item: ''
    }
  },
  methods: {
    kcItem (row, column, event) {
      // console.log(this.data)
      if (row != null) {
        this.Item = row
      }

      this.$emit('kcitem', this.Item)
    }

  },
  created () {

  }
}
</script>

<style>
</style>
