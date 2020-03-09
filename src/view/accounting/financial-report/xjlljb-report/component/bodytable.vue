<template>
  <div>
    <el-table
      :data="tabledata"
      highlight-current-row
      v-loading="loading"
      element-loading-text="数据加载中，请稍候..."
      element-loading-spinner="el-icon-loading"
      stripe
      border
      height="100%"
      style="width: 100%"
    >
<!--      <el-table-column-->
<!--        label="序号"-->
<!--        type="index"-->
<!--        align="center"-->
<!--        width="50">-->
<!--      </el-table-column>-->
      <el-table-column
        property="xm"
        label="项目"
        header-align="center"
        width="320"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="hc"
        label="行次"
        header-align="center"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        property="bnlj"
        label="本年累计"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="jd1"
        label="第一季度"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="jd2"
        label="第二季度"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="jd3"
        label="第三季度"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="jd4"
        label="第四季度"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="bf_bnlj"
        label="上年同期数"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'bodytable',
  data () {
    return {
      bshowzero: 'N' // 金额为0 显示为0
    }
  },
  props: {
    tabledata: {},
    loading: {},
    jd: {},
    xscurrjd: {}
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.myTable.doLayout()
    })
  },
  computed: {
  },
  methods: {
    setBshowzero (val) {
      this.bshowzero = val
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 2, this.bshowzero === 'Y')
    }
  }
}
</script>

<style scoped>

</style>
