<!--本年累计列在前-->
<template>
  <div class = "kj-main">
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
        property="hs"
        label="行次"
        header-align="center"
        align="center"
        width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="bnljje"
        label="本年累计金额"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
        show-overflow-tooltip
      >
        <template slot-scope="scope" v-if="scope.row.bnljje !== 0">
          <el-link @click.stop.prevent="linkKmzz(scope.row)">{{scope.row.bnljje | forThousands(2, bshowzero === 'Y')}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        property="byje"
        label="本月金额"
        header-align="center"
        align="right"
        width="120"
        :formatter="repformny"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'bodytablebn',
  data () {
    return {
      bshowzero: 'N' // 金额为0 显示为0
    }
  },
  props: {
    tabledata: {},
    loading: {},
    formParam: {}
  },
  methods: {
    setBshowzero (val) {
      this.bshowzero = val
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 2, this.bshowzero === 'Y')
    },
    // 联查科目总账
    linkKmzz (row) {
      if (!this.$hasPermission('kmzz-report')) {
        return
      }
      if (row) {
        this.$router.push({
          name: 'kmzz-report',
          params: {
            routerParam: {
              period: this.formParam.qjq,
              corpobj: this.formParam.corpobj,
              kms: row.vconkms
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
