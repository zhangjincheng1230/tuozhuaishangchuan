<template>
  <div>
    <el-table
      ref = "myTable"
      :data="tabledata"
      highlight-current-row
      v-loading="loading"
      element-loading-text="数据加载中，请稍候..."
      element-loading-spinner="el-icon-loading"
      :fit="true"
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
        property="hs"
        label="行次"
        align="center"
        header-align="center"
        width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="bnlj"
        label="本年累计"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="quarterFirst"
        key="quarterFirst"
        label="第一季度"
        v-if="xscurrjd ? (jd == '03' ) : true"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="quarterSecond"
        key="quarterSecond"
        v-if="xscurrjd ? (jd == '06') : true"
        label="第二季度"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="quarterThird"
        key="quarterThird"
        v-if="xscurrjd ? (jd == '09') : true"
        label="第三季度"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="quarterFourth"
        key="quarterFourth"
        v-if="xscurrjd ? (jd == '12') : true"
        label="第四季度"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="lastquarterFirst"
        key="lastquarterFirst"
        v-if="jd==='03'"
        label="上年同期数"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="lastquarterSecond"
        key="lastquarterSecond"
        v-if="jd==='06'"
        label="上年同期数"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="lastquarterThird"
        key="lastquarterThird"
        v-if="jd==='09'"
        label="上年同期数"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="lastquarterFourth"
        key="lastquarterFourth"
        v-if="jd==='12'"
        label="上年同期数"
        header-align="center"
        align="right"
        width="120"
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
