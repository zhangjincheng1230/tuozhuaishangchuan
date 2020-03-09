<template>
  <el-table
    :data="tableData"
    highlight-current-row
    border
    class="edit-table">
    <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
    <el-table-column
      prop="xjll_id"
      :formatter="formatName"
      header-align="center"
      label="现金流量项目">
    </el-table-column>
    <el-table-column
      prop="vdirect"
      :formatter="formatDirection"
      align="center"
      width="70"
      label="方向">
    </el-table-column>
    <el-table-column
      prop="nmny"
      :formatter="formatMny"
      header-align="center"
      align="right"
      width="110"
      label="金额">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'VoucherCashFlowTable',
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    cashFlowArchive () {
      let archives = this.$store.getters.cashFlowArchive
      if (archives === null) {
        archives = []
      }
      return archives
    }
  },
  created () {
    this.$store.dispatch('fetchCashFlowArchive')
  },
  methods: {
    formatName (row, column, cellValue) {
      let cashFlow = this.cashFlowArchive.find(item => cellValue === item.id)
      return cashFlow ? cashFlow.xjlxmmc : ''
    },
    formatDirection (row, column, cellValue) {
      if (cellValue === 0) {
        return '流入'
      } else {
        return '流出'
      }
    },
    formatMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    }
  }
}
</script>

<style scoped>

</style>
