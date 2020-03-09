<template>
    <div class="table-container">
        <el-table
                :data="tabledata"
                highlight-current-row
                show-overflow-tooltip
                v-loading="loading"
                element-loading-text="数据加载中，请稍候..."
                element-loading-spinner="el-icon-loading"
                stripe
                border
                height="100%"
                style="width: 100%"
        >
            <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50">
            </el-table-column>
            <el-table-column
                    property="rq"
                    label="日期"
                    header-align="center"
                    width="100"
            ></el-table-column>
            <el-table-column
                    property="year"
                    label="年度"
                    header-align="center"
                    width="100"
            ></el-table-column>
            <el-table-column
                    property="qj"
                    label="期间"
                    header-align="center"
                    width="100"
            ></el-table-column>
            <el-table-column
                    property="pzh"
                    label="凭证号"
                    header-align="center"
                    width="100"
            >
              <template slot-scope="scope" v-if="scope.row.pzh != null">
                记<el-link  type="primary"  @click.stop.prevent="linkPzByid(scope.row.pk_tzpz_h)">{{scope.row.pzh}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
                    property="zy"
                    label="摘要"
                    show-overflow-tooltip
                    header-align="center"
                    width="180"
            ></el-table-column>
            <el-table-column
                    property="kmbm"
                    label="科目编码"
                    show-overflow-tooltip
                    header-align="center"
                    width="100"
            ></el-table-column>
            <el-table-column
                    property="kmmc"
                    label="科目名称"
                    show-overflow-tooltip
                    header-align="center"
                    width="200"
            ></el-table-column>
            <el-table-column
                    property="bz"
                    label="币种"
                    show-overflow-tooltip
                    header-align="center"
                    width="100"
            ></el-table-column>
            <el-table-column
                    property="hl"
                    label="汇率"
                    header-align="center"
                    align="right"
                    width="100"
                    show-overflow-tooltip
                    :formatter="repformnyHuiLv"
            ></el-table-column>
            <el-table-column label="借方"   header-align="center">
                <el-table-column
                        property="ybjf"
                        label="原币"
                        header-align="center"
                        align="right"
                        width="120"
                        show-overflow-tooltip
                        :formatter="repformnywb"
                ></el-table-column>
                <el-table-column
                        property="jfmny"
                        label="本位币"
                        header-align="center"
                        align="right"
                        width="120"
                        show-overflow-tooltip
                        :formatter="repformny"
                ></el-table-column>
            </el-table-column>
            <el-table-column label="贷方"   header-align="center">
                <el-table-column
                        property="ybdf"
                        label="原币"
                        header-align="center"
                        align="right"
                        width="120"
                        show-overflow-tooltip
                        :formatter="repformnywb"
                ></el-table-column>
                <el-table-column
                        property="dfmny"
                        label="本位币"
                        header-align="center"
                        align="right"
                        width="120"
                        show-overflow-tooltip
                        :formatter="repformny"
                ></el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  name: 'xsztable_wb',
  props: {
    tabledata: {
      type: Array
    },
    loading: {
      type: Boolean
    }
  },
  data () {
    return {
      huilvPre: this.$store.getters.huilvPre // 汇率精度
    }
  },
  methods: {
    repformnyHuiLv (row, column, cellValue) { // 汇率精度
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, this.huilvPre)
    },
    // 联查凭证
    linkPzByid (id_voucher) {
      if (!this.$hasPermission('voucher-edit')) {
        return
      }
      if (!id_voucher) {
        this.$message({showClose: true, message: '无凭证！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: id_voucher
        }
      })
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    repformnywb (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 4)
    },
    getTableData () {
      console.log(this.tableData)
    }
  }
}
</script>

<style scoped>
</style>
