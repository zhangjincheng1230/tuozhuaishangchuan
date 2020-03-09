<template>
  <div class="kj-main">
    <el-container style = "height:calc(100% - 30px)">
      <el-main style = "padding:0px;width:calc(85%);">
        <el-table
          :data="tabledata"
          highlight-current-row
          v-loading="loading"
          :span-method="objectSpanMethod"
          element-loading-text="数据加载中，请稍候..."
          element-loading-spinner="el-icon-loading"
          stripe
          border
          height="100%"
          ref="tableRef"
          style="width: 100%">
          <el-table-column label="序号" type="index" header-align ="center" align="center" fixed width="50"> </el-table-column>
          <el-table-column  prop="spbm" label="存货编码" header-align ="center" align="left" fixed width="100"></el-table-column>
          <el-table-column prop="spmc" label="存货名称" header-align ="center" align="left"  show-overflow-tooltip  fixed width="120"> </el-table-column>
          <el-table-column prop="spfl" label="存货分类" header-align ="center" align="left" fixed width="80"> </el-table-column>
          <el-table-column prop="spgg" label="规格(型号)" header-align ="center" align="left"  show-overflow-tooltip   fixed width="120"> </el-table-column>
          <el-table-column prop="jldw" label="计量单位" header-align ="center" align="left" width="80"> </el-table-column>
          <el-table-column  prop="dbilldate" label="日期" header-align ="center" align="left" width="85"> </el-table-column>
          <el-table-column  prop="dbillid" label="单据号" header-align ="center" align="left"  min-width="120">
            <template slot-scope="scope">
              <span @click="lcData(scope.row)"
                    class="spanlink" >{{scope.row.dbillid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="zy"  label="摘要"   show-overflow-tooltip  header-align ="center" align="left" width="100"> </el-table-column>
          <el-table-column label="收入" header-align="center">
            <TableColumnPre prop="srsl" label="数量" :pretype = 3></TableColumnPre>
            <TableColumnPre prop="srdj" label="单价" :pretype = 2></TableColumnPre>
            <TableColumnPre prop="srje" label="金额" ></TableColumnPre>
          </el-table-column>
          <el-table-column label="发出" header-align="center">
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
      <km-check-box-query  ref="kmcheckboxquery" :treedata="treedata" :currselectids.sync="currselectids" :mulselect.sync="mulselect" :treeTitles="['单存货查询', '多存货查询']" :nodename="this.$parent.nodename" :bsavesetting="true"></km-check-box-query>
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
import { orderBy } from 'natural-orderby'
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
    }
  },
  data () {
    return {
      currselectids: [],
      selectids: [],
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
        if (this.treedata != null && this.treedata.length > 0) {
          if (this.treedata[1] != null && this.treedata[1].children != null && this.treedata[1].children.length > 0) {
            return [this.treedata[1].children[0].id]
          } else {
            return [this.treedata[1].id]
          }
        }
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
          if (this.selectids && this.selectids.length > 0) {
            a = this.selectids
            this.$refs.kmcheckboxquery.setCheckIds(a)
          } else {
            a = this.defaultcurrid
          }
        }
        for (const str of a) {
          for (const obj of this.alltabledata) {
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
        results = orderBy(results, v => v.spbm)
        this.putHeadName(results[0])
      } else {
        this.putHeadName('')
      }
      this.putSpanArr(results)
      return results
    }
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  },
  mounted () {
  },
  methods: {
    // 赋值右边树check值
    setDefaultIds (currselectids) {
      if (currselectids && currselectids.length > 0) {
        this.selectids = currselectids
      }
    },
    // 联查单据
    lcData (row) {
      if (row && row.pk_ictrade_h) {
        let routeParam = {routeParam: {id: row.pk_ictrade_h}}
        if (row.cbilltype === 'HP75') { // 出库单
          this.$router.push({name: 'icbill-saleout', params: routeParam})
        } else if (row.cbilltype === 'HP70') { // 入库单
          this.$router.push({name: 'icbill-purchin', params: routeParam})
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
    },
    putHeadName (data) {
      let value = ''
      if (data != null && data !== undefined && !this.mulselect) { // 单选
        if (data.kmbm != null && data.km.length > 0) {
          value = data.kmbm + '   ' + data.km
        }
      }
      this.$emit('updatesinglekmname', value)
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 2) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
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
            if (item.pk_sp === tabledata[index - 1].pk_sp) {
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
