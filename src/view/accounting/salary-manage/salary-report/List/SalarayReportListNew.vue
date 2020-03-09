<template>
  <div >
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
      <el-table-column prop="yfgz" label="应发工资(本期收入)" header-align ="right" width="170" align="right" :formatter="parent.nmnyformatter" > </el-table-column>

      <el-table-column label="本期专项扣除"  align="center" header-align ="center">
        <el-table-column prop="yanglaobx" label="基本养老保险费" header-align ="right" width="130" align="right" :formatter="parent.nmnyformatter" ></el-table-column>
        <el-table-column prop="yiliaobx" label="基本医疗保险费" header-align ="right" width="130" align="right" :formatter="parent.nmnyformatter" ></el-table-column>
        <el-table-column prop="shiyebx" label="失业保险费"  header-align ="right" width="100" align="right" :formatter="parent.nmnyformatter" ></el-table-column>
        <el-table-column prop="zfgjj" label="住房公积金" header-align ="right" width="100" align="right" :formatter="parent.nmnyformatter" ></el-table-column>
      </el-table-column>
      <el-table-column prop="ljzxkc" label="累计专项扣除" header-align ="right" width="120"  align="right" :formatter="parent.nmnyformatter" > </el-table-column>
      <el-table-column  v-if="parent.showqybf ==='true'"  label="本期企业承担部分"  header-align ="center">
        <el-table-column v-if="parent.showqybf ==='true'"  prop="qyyanglaobx" label="企业基本养老保险费" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="160"></el-table-column>
        <el-table-column v-if="parent.showqybf ==='true'" prop="qyyiliaobx" label="企业基本医疗保险费" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="160"></el-table-column>
        <el-table-column  v-if="parent.showqybf ==='true'" prop="qyshiyebx" label="企业失业保险费" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="130"></el-table-column>
        <el-table-column v-if="parent.showqybf ==='true'" prop="qyzfgjj" label="企业住房公积金" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="130"></el-table-column>
        <el-table-column v-if="parent.showqybf ==='true'" prop="qygsbx" label="企业工伤保险" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"></el-table-column>
        <el-table-column  v-if="parent.showqybf ==='true'" prop="qyshybx" label="企业生育保险" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"></el-table-column>
      </el-table-column>
      <el-table-column  v-if="parent.showZxfj ==='true'" label="本期专项扣除附加"  header-align ="center">
        <el-table-column v-if="parent.showZxfj ==='true'" prop="znjyzc" label="子女教育支出" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="jxjyzc" label="继续教育支出" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="zfdkzc" label="住房贷款利息支出" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="150"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="zfzjzc" label="住房租金支出" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="sylrzc" label="赡养老人支出" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"></el-table-column>
      </el-table-column>
      <el-table-column v-if="parent.showZxfj ==='true'" label="累计专项扣除附加"  header-align ="center">
        <el-table-column v-if="parent.showZxfj ==='true'" prop="ljznjyzc" label="累计子女教育支出"  header-align ="right" align="right" :formatter="parent.nmnyformatter" width="150"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="ljjxjyzc" label="累计继续教育支出"  header-align ="right" align="right" :formatter="parent.nmnyformatter" width="150"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="ljzfdkzc" label="累计住房贷款利息支出"  header-align ="right" align="right" :formatter="parent.nmnyformatter" width="180"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="ljzfzjzc" label="累计住房租金支出"  header-align ="right" align="right" :formatter="parent.nmnyformatter" width="150"></el-table-column>
        <el-table-column v-if="parent.showZxfj ==='true'" prop="ljsylrzc" label="累计赡养老人支出" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="150"></el-table-column>
      </el-table-column>
      <el-table-column prop="ljsre" label="累计收入额"  header-align ="right" align="right" :formatter="parent.nmnyformatter" width="100"> </el-table-column>
      <el-table-column prop="ljjcfy" label="累计减除费用"  header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"> </el-table-column>
      <el-table-column prop="ynssde" label="累计应纳税所得额" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="150"> </el-table-column>
      <el-table-column prop="shuilv" label="税率%" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="70"> </el-table-column>
      <el-table-column prop="ljynse" label="累计应纳税额" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="120"> </el-table-column>
      <el-table-column prop="yyjse" label="已预缴税额" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="100"> </el-table-column>
      <el-table-column prop="grsds" label="个人所得税(应补退税额)" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="190"> </el-table-column>
      <el-table-column prop="sfgz" label="实发工资" header-align ="right" align="right" :formatter="parent.nmnyformatter" width="100"> </el-table-column>
    </el-table>
    <div class="table-pagination">
      <Pagination :total="parent.total" :page.sync="parent.pageInfo.page" :limit.sync="parent.pageInfo.rows" @pagination="parent.fetchData"></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
export default {
  name: 'SalarayReportListNew',
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
