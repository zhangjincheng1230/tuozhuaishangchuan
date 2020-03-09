<template>
  <div >
    <el-table
      :data="parent.sortedData"
      highlight-current-row
      @current-change="parent.handleListRowSelect"
      @selection-change="parent.handleListRowSelection"
      show-summary
      :summary-method="parent.getSummaries"
      v-loading="parent.loading"
      element-loading-text="数据处理中，请稍候..."
      element-loading-spinner="el-icon-loading"
      stripe
      border
      :height="parent.height"
      ref="tableRef"
      style="width: 100%">
      <el-table-column label="序号" type="index" align="center" fixed  width="50"></el-table-column>
      <el-table-column type="selection"  width="55" fixed align="center"> </el-table-column>
      <el-table-column prop="ygbm" label="工号" fixed header-align ="center" align="left"  width="70"> </el-table-column>
      <el-table-column prop="ygname" label="姓名" fixed header-align ="center" align="left"  width="100"
                       show-overflow-tooltip >
        <template slot-scope="scope">
            <span @click="parent.editRow(scope.row)"
                    class="spanlink" >{{scope.row.ygname}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="yfgz" label="应发工资" width="90" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column prop="ynssde" label="应纳税所得额" width="120" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column prop="shuilv" label="税率%" width="70" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column prop="grsds" label="应扣缴税额" width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column prop="sfgz" label="实发工资" width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
    </el-table>
    <div class="table-pagination">
      <Pagination :total="parent.total" :page.sync="parent.pageInfo.page" :limit.sync="parent.pageInfo.rows" @pagination="parent.fetchData"></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
export default {
  name: 'SalarayReportListRemn',
  components: {
    Pagination
  },
  computed: {
    parent () {
      return this.$parent.$parent.$parent
    }
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  }
}
</script>

<style scoped>

</style>
