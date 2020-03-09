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
        property="km"
        label="科目"
        header-align="center"
        width="200"
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
        width="200"
      ></el-table-column>
      <el-table-column label="借方"   header-align="center">
        <el-table-column
          property="ybjf"
          label="原币"
          header-align="center"
          align="right"
          width="150"
          :formatter="repformny"
        ></el-table-column>
        <el-table-column
          property="jfmny"
          label="本位币"
          header-align="center"
          align="right"
          width="150"
          :formatter="repformny"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="贷方"   header-align="center">
        <el-table-column
          property="ybdf"
          label="原币"
          header-align="center"
          align="right"
          width="150"
          :formatter="repformny"
        ></el-table-column>
        <el-table-column
          property="dfmny"
          label="本位币"
          header-align="center"
          align="right"
          width="150"
          :formatter="repformny"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'table_wb',
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
