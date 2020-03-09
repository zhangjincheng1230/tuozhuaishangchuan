<template>
  <div>
    <el-dialog title="现金流量明细"  :visible.sync="visible"  :modal="false" width="850px" >
      <el-table
        :data="tabledata"
        highlight-current-row
        stripe
        border
        height="300px"
        style="width: 100%;overflow:auto"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          property="pzh"
          label="凭证号"
          header-align="center"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.pzh != null">
            记<el-link  type="primary"  @click.stop.prevent="linkPzByid(scope.row.pzid)">{{scope.row.pzh}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          property="dopedate"
          label="操作日期"
          header-align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="zy"
          label="摘要"
          header-align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="code"
          label="对方科目编码"
          header-align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="name"
          label="对方科目名称"
          header-align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="xm"
          label="项目"
          header-align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="jffs"
          label="金额"
          header-align="center"
          align="right"
          width="100"
          :formatter="repformny"
        ></el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="visible = false">确定</el-button>
          <el-button @click="excelExport">导出</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'xjllmx',
  data () {
    return {
      visible: false,
      tabledata: null,
      corpname: null,
      qj: null,
      corpid: null
    }
  },
  props: {
    // tabledata: {}
  },
  watch: {
  },
  created () {
  },
  computed: {
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
    show (data, corpname, qj, corpid) {
      this.visible = true
      this.tabledata = data
      this.corpname = corpname
      this.qj = qj
      this.corpid = corpid
    },
    // 导出excel
    excelExport () {
      const excelparam = {
        corpName: this.corpname,
        titleperiod: this.qj,
        corpIds: this.corpid,
        list: JSON.stringify(this.tabledata)
      }
      this.$api.XjllReport.exportXjllMxExcel('现金流量明细', Object.assign(excelparam))
      // this.visible = false
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    }
  }
}
</script>

<style scoped>
</style>
