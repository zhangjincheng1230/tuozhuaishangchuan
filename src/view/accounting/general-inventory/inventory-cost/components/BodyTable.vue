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
          <el-table-column label="序号" type="index" align="center" fixed width="50"> </el-table-column>
          <el-table-column v-if="showDetail" property="spfl_name" label="存货类别" align="left" header-align="center" fixed  width="100"></el-table-column>
          <el-table-column property="spbm" label="存货编码" header-align="center" align="left"  fixed width="100"></el-table-column>
          <el-table-column property="spmc" label="存货名称" header-align="center" align="left" show-overflow-tooltip fixed  width="100">
            <template slot-scope="scope" v-if="scope.row.spmc">
              <span @click="linkDetailBill(scope.row)"
                    class="spanlink" >{{scope.row.spmc}}</span>
            </template>
          </el-table-column>
          <el-table-column property="spgg" label="规格(型号)" header-align="center" align="left" show-overflow-tooltip fixed width="100"></el-table-column>
          <el-table-column property="jldw" label="计量单位" header-align="center" align="left" fixed width="80"></el-table-column>
          <el-table-column label="期初" header-align="center">
            <TableColumnPre prop="qcsl" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="qcdj" label="单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="qcje" label="金额" ></TableColumnPre>
          </el-table-column>
          <el-table-column label="入库" header-align="center">
            <TableColumnPre prop="srsl" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="srdj" label="单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="srje" label="金额" ></TableColumnPre>
          </el-table-column>
          <el-table-column label="出库" header-align="center">
            <TableColumnPre prop="fcsl" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="fcdj" label="单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="fcje" label="金额" ></TableColumnPre>
          </el-table-column>
          <el-table-column label="结存" header-align="center">
            <TableColumnPre prop="jcsl" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="jcdj" label="单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="jcje" label="金额" ></TableColumnPre>
          </el-table-column>
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
import { pageData } from '@/utils'
import TableColumnPre from '@/components/TableColumnPre/index'
import Pagination from '@/components/Pagination/index'
import KmCheckBoxQuery from '@/components/Report/KmCheckBoxQuery'
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
        return [this.alltabledata[0].pk_sp]
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
            if (str === obj.pk_sp || str === obj.pk_sp + '~') {
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
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  },
  methods: {
    // 赋值右边树check值
    setDefaultIds () {
      this.$refs.kmcheckboxquery.setCheckIds(this.currselectids)
    },
    // 联查出入库明细表
    linkDetailBill (rowdata) {
      if (rowdata) {
        const strs = rowdata.pk_sp.split('_')
        if (strs) {
          if (!this.$hasPermission('inventory-details')) {
            return
          }
          this.$router.push({
            name: 'inventory-details',
            params: {
              routerParam: {
                id: 'kccbb',
                pk_inventory: strs[0],
                queryParam: this.$parent.queryparam
              }
            }
          })
        }
      }
    },
    handleNodeExpand (a, b, c) {
    },
    getCurrSelectids () {
      if (this.currselectids == null || this.currselectids.length === 0) {
        return [this.defaultcurrid]
      }
      return this.currselectids
    }
  }
}
</script>

<style scoped>
</style>
