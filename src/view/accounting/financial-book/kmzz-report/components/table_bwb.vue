<template>
  <div class="table-container">
    <el-table
      :data="tabledata"
      highlight-current-row
      :span-method="objectSpanMethod"
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
        property="kmbm"
        label="科目编码"
        header-align="center"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link  type="primary"  @click.stop.prevent="linkKmmx(scope.row)">{{scope.row.kmbm}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        property="km"
        label="科目名称"
        header-align="center"
        width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        property="period"
        label="期间"
        header-align="center"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="zy"
        label="摘要"
        header-align="center"
        width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="jf"
        label="借方"
        header-align="center"
        align="right"
        width="150"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="df"
        label="贷方"
        header-align="center"
        align="right"
        width="150"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
      <el-table-column
        property="fx"
        label="方向"
        header-align="center"
        width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="ye"
        label="余额"
        header-align="center"
        align="right"
        width="150"
        show-overflow-tooltip
        :formatter="repformny"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'table_bwb',
  props: {
    alltabledata: {
      type: Array
    },
    queryparam: {}
  },
  computed: {
    tabledata: function () {
      let result = this.alltabledata
      this.putSpanArr(result)
      return result
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 联查科目明细
    linkKmmx (row) {
      if (!this.$hasPermission('kmmx-report')) {
        return
      }
      this.$router.push({
        name: 'kmmx-report',
        params: {
          routerParam: {
            id: 'kmzz',
            kmbm: row.kmbm,
            pk_km: row.pk_accsubj,
            queryParam: this.queryparam
          }
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
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (this.spanArr[rowIndex]) {
          return {rowspan: this.spanArr[rowIndex], colspan: 1}
        } else {
          return {rowspan: 0, colspan: 0}
        }
      } else if (columnIndex === 2) {
        if (this.spanArr[rowIndex]) {
          return {rowspan: this.spanArr[rowIndex], colspan: 1}
        } else {
          return {rowspan: 0, colspan: 0}
        }
      }
    },
    putSpanArr (tabledata) {
      this.spanArr = []
      let contactDot = 0
      if (tabledata != null && tabledata.length > 0) {
        tabledata.forEach((item, index) => {
          if (index === 0) {
            this.spanArr.push(1)
          } else {
            if (item.kmbm === tabledata[index - 1].kmbm) {
              this.spanArr[contactDot] += 1
              this.spanArr.push(0)
            } else {
              contactDot = index
              this.spanArr.push(1)
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
