<template>
    <div class="table-container">
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
                    header-align="center"
                    width="180"
            ></el-table-column>
            <el-table-column
                    property="kmbm"
                    label="科目编码"
                    header-align="center"
                    width="100"
            ></el-table-column>
            <el-table-column
                    property="kmmc"
                    label="科目名称"
                    header-align="center"
                    width="200"
            ></el-table-column>
            <el-table-column
                    property="jfmny"
                    label="借方"
                    header-align="center"
                    align="right"
                    width="120"
                    :formatter="repformny"
            ></el-table-column>
            <el-table-column
                    property="dfmny"
                    label="贷方"
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
  name: 'xsztable',
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
    }
  },
  methods: {
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
    getTableData () {
      console.log(this.tableData)
    }
  }
}
</script>

<style scoped>
</style>
