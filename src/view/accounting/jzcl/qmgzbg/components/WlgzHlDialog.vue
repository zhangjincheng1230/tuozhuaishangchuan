<!-- 往来挂账混乱 -->
<template>
  <div>
    <el-dialog title="异常查看" :modal="false"  :visible.sync="visible"  width="800px">
      <el-table
        border
        ref="multipleTable"
        :data="tabledata"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          property="gzdx"
          width="200"
          header-align="center"
          show-overflow-tooltip
          label="挂账对象">
        </el-table-column>
        <el-table-column
          property="yssum"
          header-align="center"
          align="right"
          show-overflow-tooltip
          label="应收">
          <template slot-scope="scope" v-if="scope.row.yssum !== 0">
            <el-link   @click.stop.prevent="link(scope.row, scope.row.yskmbm, scope.row.yskmmc)">{{scope.row.yssum}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          property="yussum"
          header-align="center"
          align="right"
          show-overflow-tooltip
          label="预收">
          <template slot-scope="scope" v-if="scope.row.yussum !== 0">
            <el-link   @click.stop.prevent="link(scope.row,scope.row.yuskmbm, scope.row.yuskmmc)">{{scope.row.yussum}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          property="yfsum"
          header-align="center"
          align="right"
          show-overflow-tooltip
          label="应付">
          <template slot-scope="scope" v-if="scope.row.yfsum !== 0">
            <el-link  @click.stop.prevent="link(scope.row,scope.row.yfkmbm, scope.row.yfkmmc)">{{scope.row.yfsum }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
        property="yufsum"
        header-align="center"
        align="right"
        show-overflow-tooltip
        label="预付">
          <template slot-scope="scope" v-if="scope.row.yufsum !== 0">
            <el-link   @click.stop.prevent="link(scope.row,scope.row.yufkmbm, scope.row.yufkmmc)">{{scope.row.yufsum}}</el-link>
          </template>
       </el-table-column>
        <el-table-column
          property="qtyssum"
          header-align="center"
          align="right"
          show-overflow-tooltip
          label="其他应收">
          <template slot-scope="scope" v-if="scope.row.qtyssum !== 0">
            <el-link   @click.stop.prevent="link(scope.row,scope.row.qtyskmbm, scope.row.qtyskmmc)">{{scope.row.qtyssum }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          property="qtyfsum"
          header-align="center"
          align="right"
          show-overflow-tooltip
          label="其他应付">
          <template slot-scope="scope" v-if="scope.row.qtyfsum !== 0">
            <el-link   @click.stop.prevent="link(scope.row,scope.row.qtyfkmbm, scope.row.qtyfkmmc)">{{scope.row.qtyfsum }}</el-link>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="visible = false">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WlgzHldialog',
  data () {
    return {
      visible: false,
      tabledata: [],
      paramstr: ''
    }
  },
  props: {
  },
  methods: {
    show (dataarray,paramstr) {
      this.tabledata = dataarray
      this.paramstr = paramstr
      this.visible = true
    },
    // 联查科目总账
    link (row,kmbm,kmmc) {
      if (!this.$hasPermission('auxiliary-balance-report')) {
        return
      }
      this.$router.push({
        name: 'auxiliary-balance-report',
        params: {
          routerParam: Object.assign({fzlbcode: parseInt(row.fzlb), fzcode: row.fzhsCode, fzxm: row.fzhsCode, kms_first: kmbm, kms_last: kmbm, kmmc: kmmc}, JSON.parse(this.paramstr))
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
