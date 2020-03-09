<template>
  <div>
    <el-table
      :data="parent.sortedData"
      highlight-current-row
      @current-change="parent.handleListRowSelect"
      @selection-change="parent.handleListRowSelection"
      :row-class-name="parent.tableRowClassName"
      @row-click="dblclickRow"
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
      <el-table-column prop="ygbm" label="工号" fixed  header-align ="center" align="left"   width="70"> </el-table-column>
      <el-table-column prop="ygname" label="姓名" fixed  header-align ="center" align="left"   width="100"
                       show-overflow-tooltip >
        <template slot-scope="scope">
            <span @click="parent.editRow(scope.row)"
                    class="spanlink" >{{scope.row.ygname}}</span>
        </template>
      </el-table-column>
      <el-table-column key="yfgz" prop="yfgz" label="应发工资" width="90" header-align ="right"  align="right" :formatter="parent.nmnyformatter" > </el-table-column>
      <el-table-column v-if="ishow" key="yanglaobx" prop="yanglaobx" label="基本养老保险费" width="135" header-align ="right"  align="right" :formatter="parent.nmnyformatter" ></el-table-column>
      <el-table-column v-if="ishow" key="yiliaobx" prop="yiliaobx" label="基本医疗保险费" width="135" header-align ="right"  align="right" :formatter="parent.nmnyformatter" ></el-table-column>
      <el-table-column v-if="ishow" key="shiyebx" prop="shiyebx" label="失业保险费"  width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter" ></el-table-column>
      <el-table-column v-if="ishow" key="zfgjj" prop="zfgjj" label="住房公积金" width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter" ></el-table-column>
      <el-table-column key="ynssde" prop="ynssde" label="应纳税所得额" width="130" header-align ="right"  align="right" :formatter="parent.nmnyformatter" > </el-table-column>
      <el-table-column key="shuilv" prop="shuilv" label="税率%" width="70" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column v-if="ishow" key="grsds" prop="grsds" label="个人所得税" width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column v-if="!ishow" key="grsds" prop="grsds" label="应扣缴税额" width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
      <el-table-column key="sfgz" prop="sfgz" label="实发工资" width="100" header-align ="right"  align="right" :formatter="parent.nmnyformatter"> </el-table-column>
    </el-table>
    <div class="table-pagination">
      <Pagination :total="parent.total" :page.sync="parent.pageInfo.page" :limit.sync="parent.pageInfo.rows" @pagination="parent.fetchData"></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
export default {
  name: 'SalarayReportListOld',
  props: ['billtype'],
  components: {
    Pagination
  },
  computed: {
    parent () {
      return this.$parent.$parent.$parent
    },
    ishow () {
      return this.billtype === '01'
    }
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  },
  methods: {
    dblclickRow (row) {
      this.$refs.tableRef.toggleRowSelection(row)
    }
  }
}
</script>

<style scoped>

</style>
