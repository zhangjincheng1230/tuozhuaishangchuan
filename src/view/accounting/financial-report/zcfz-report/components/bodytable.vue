<template>
  <div >
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
      <!--<el-table-column
        label="序号"
        type="index"
        align="center"
        width="50">
      </el-table-column>-->
      <el-table-column
        property="zc"
        label="资产"
        header-align="center"
        show-overflow-tooltip
        width="200"
      ></el-table-column>
      <el-table-column
        property="hc1"
        label="行次"
        header-align="center"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        property="qmye1"
        label="期末余额"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      >
        <template slot-scope="scope" v-if="scope.row.qmye1 !== 0">
          <el-link @click.stop.prevent="linkKmzz(scope.row, 'Y')">{{scope.row.qmye1 | forThousands(2, bshowzero === 'Y')}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        property="ncye1"
        label="年初余额"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="fzhsyzqy"
        label="负债和所有者权益(或股东权益）"
        show-overflow-tooltip
        header-align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        property="hc2"
        label="行次"
        header-align="center"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        property="qmye2"
        label="期末余额"
        header-align="center"
        align="right"
        width="120"
        show-overflow-tooltip
        :formatter="repformny"
      >
        <template slot-scope="scope" v-if="scope.row.qmye2 !== 0">
          <el-link   @click.stop.prevent="linkKmzz(scope.row, 'N')">{{scope.row.qmye2 | forThousands(2, bshowzero === 'Y')}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        property="ncye2"
        label="年初余额"
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
    linkKmzz (row, bzc) {
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
              kms: bzc === 'Y' ? row.zcconkms : row.fzconkms
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
