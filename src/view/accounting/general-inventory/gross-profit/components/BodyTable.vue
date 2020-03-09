<template>
  <div class="kj-main">
    <el-container style = "height:calc(100% - 30px)">
      <el-main style = "padding:0px;width:calc(85%);">
        <el-table
          :data="tabledata"
          highlight-current-row
          v-loading="loading"
          element-loading-text="数据加载中，请稍候..."
          element-loading-spinner="el-icon-loading"
          stripe
          border
          height="100%"
          ref="tableRef"
          style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="50"> </el-table-column>
          <el-table-column v-if="showDetail" property="vname" label="存货类别" header-align="center"  align="left"  width="100"></el-table-column>
          <el-table-column property="code" label="存货编码" header-align="center" align="left"  width="100"></el-table-column>
          <el-table-column property="name" label="存货名称" show-overflow-tooltip header-align="center" align="left" width="100"></el-table-column>
          <el-table-column  property="spec" label="规格(型号)" show-overflow-tooltip header-align="center" align="left"  width="100" ></el-table-column>
          <el-table-column property="unit" label="计量单位" header-align="center" align="left" width="80" ></el-table-column>
          <TableColumnPre prop="cksl" label="出库数量" :pretype = 3></TableColumnPre>
          <TableColumnPre prop="ckdj" label="出库单价" :pretype = 2></TableColumnPre>
          <TableColumnPre prop="xsdj" label="销售单价" :pretype = 2></TableColumnPre>
          <el-table-column property="mll" label="毛利率" header-align="center" align="right" width="100" :formatter="repformny" ></el-table-column>
        </el-table>
      </el-main>
      <km-check-box-query ref="kmcheckboxquery" :treedata="treedata" :currselectids.sync="currselectids" :mulselect.sync="mulselect" :nodename="this.$parent.nodename" :bsavesetting="true"></km-check-box-query>
    </el-container>
    <div class="table-pagination">
      <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" :pageSizes.sync="pageInfo.pageSizes"  ></Pagination>
    </div>
  </div>
</template>

<script>
import TableColumnPre from '@/components/TableColumnPre/index'
import Pagination from '@/components/Pagination/index'
import KmCheckBoxQuery from '@/components/Report/KmCheckBoxQuery'
import { accDiv, accMul, pageData } from '@/utils'
export default {
  components: {
    Pagination, KmCheckBoxQuery, TableColumnPre
  },
  props: {
    alltabledata: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    treedata: {
      type: Array
    },
    isDetailjz: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currselectids: [],
      spanArr: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      // tree是否多选
      mulselect: true,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      }
      // total: 0
    }
  },
  computed: {
    defaultcurrid: function () {
      if (this.alltabledata != null && this.alltabledata.length > 0) {
        return [this.alltabledata[0].fzid]
      }
      return []
    },
    total: function () {
      return this.currentabledata.length
    },
    currentabledata: function () {
      let results = []
      let a = this.currselectids
      if (this.alltabledata && this.alltabledata.length > 0) {
        if (this.currselectids == null || this.currselectids.length === 0) {
          a = this.defaultcurrid
        }
        for (const obj of this.alltabledata) {
          for (const str of a) {
            if (str === obj.fzid || str === obj.fzid + '~') {
              results[results.length] = obj
            }
          }
        }
      }
      return results
    },
    tabledata: function () {
      let results = []
      if (this.currentabledata != null && this.currentabledata.length > 0) {
        results = pageData(this.currentabledata, this.pageInfo.page, this.pageInfo.rows)
      }
      return results
    },
    showDetail: {
      get () {
        return this.isDetailjz
      },
      set () {
        this.$emit('update:isDetailjz', false)
      }
    }
  },
  methods: {
    // 赋值右边树check值
    setDefaultIds () {
      this.$refs.kmcheckboxquery.setCheckIds(this.currselectids)
    },
    handleNodeExpand (a, b, c) {
    },
    getCurrSelectids () {
      if (this.currselectids == null || this.currselectids.length === 0) {
        return [this.defaultcurrid]
      }
      return this.currselectids
    },
    repformny (row, column, cellValue) {
      if (cellValue) {
        let value = accDiv(accMul(cellValue, 10000), 100.00)
        return this.$options.filters.forThousands(value, 2) + '%'
      }
    }
  }
}
</script>

<style scoped>
</style>
