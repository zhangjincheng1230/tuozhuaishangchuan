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
            width = "80"
            show-overflow-tooltip
            v-if = "mulselect"
          ></el-table-column>
          <el-table-column
            property="km"
            label="科目名称"
            show-overflow-tooltip
            header-align="center"
            v-if = "mulselect"
            width = "210"
          ></el-table-column>
          <el-table-column
            property="rq"
            label="日期"
            show-overflow-tooltip
            header-align="center"
            width="100"
          >

          </el-table-column>
          <el-table-column
            property="pzh"
            label="凭证号"
            show-overflow-tooltip
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
            show-overflow-tooltip
            header-align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            property="bz"
            label="币别"
            show-overflow-tooltip
            header-align="center"
            width="100"
          ></el-table-column>
          <el-table-column label="借方金额"   header-align="center">
            <el-table-column
              property="ybjf"
              label="原币"
              header-align="center"
              align="right"
              width="150"
              show-overflow-tooltip
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="jf"
              label="本位币"
              header-align="center"
              align="right"
              width="150"
              show-overflow-tooltip
              :formatter="repformny"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="贷方金额"   header-align="center">
            <el-table-column
              property="ybdf"
              label="原币"
              show-overflow-tooltip
              header-align="center"
              align="right"
              width="150"
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="df"
              label="本位币"
              show-overflow-tooltip
              header-align="center"
              align="right"
              width="150"
              :formatter="repformny"
            ></el-table-column>
          </el-table-column>

          <el-table-column label="余额"   header-align="center">
            <el-table-column
              property="fx"
              label="方向"
              show-overflow-tooltip
              header-align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              property="ybye"
              label="原币"
              header-align="center"
              align="right"
              width="150"
              show-overflow-tooltip
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="ye"
              label="本位币"
              header-align="center"
              align="right"
              width="150"
              show-overflow-tooltip
              :formatter="repformny"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </el-main>
      <km-check-box-query  :key="'tablewb_check'" :nodename="nodename" :bsavesetting="true" :treedata="treedata" :currselectids.sync="currselectids" :mulselect.sync="mulselect" ></km-check-box-query>
    </el-container>
    <div class="table-pagination">
      <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" :pageSizes.sync="pageInfo.pageSizes"  ></Pagination>
    </div>
  </div>
</template>

<script>
import { pageData } from '@/utils'
import Pagination from '@/components/Pagination/index'
import KmCheckBoxQuery from '@/components/Report/KmCheckBoxQuery'
export default {
  components: {
    Pagination, KmCheckBoxQuery
  },
  props: {
    nodename: {},
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
  watch: {
    routerParam: {
      handler (data) {
        if (data) {
          // 勾选数据清空
          this.currselectids = typeof this.routerParam === 'undefined' ? [] : [this.routerParam.pk_km]
          this.setDefaultIds()
        }
      },
      immediate: true
    }
  },
  computed: {
    defaultcurrid: function () {
      if (this.alltabledata != null && this.alltabledata.length > 0) {
        return [this.alltabledata[0].pk_accsubj]
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
            if (str === obj.pk_accsubj || str === obj.pk_accsubj + '~') {
              results[results.length] = obj
            }
          }
        }
      }
      // this.total = results.length
      // if (results != null && results.length > 0) {
      //   // results = pageData(results, this.pageInfo.page, this.pageInfo.rows)
      //   this.putHeadName(results[0])
      // } else {
      //   this.putHeadName('')
      // }
      // this.putSpanArr(results)
      return results
    },
    tabledata: function () {
      let results = []
      // let a = this.currselectids
      // if (this.alltabledata && this.alltabledata.length > 0) {
      //   if (this.currselectids == null || this.currselectids.length === 0) {
      //     a = this.defaultcurrid
      //   }
      //   for (const str of a) {
      //     for (const obj of this.alltabledata) {
      //       if (str === obj.pk_accsubj || str === obj.pk_accsubj + '~') {
      //         results[results.length] = obj
      //       }
      //     }
      //   }
      // }
      // this.total = results.length
      if (this.currentabledata != null && this.currentabledata.length > 0) {
        results = pageData(this.currentabledata, this.pageInfo.page, this.pageInfo.rows)
        this.putHeadName(results[0])
      } else {
        this.putHeadName('')
      }
      this.putSpanArr(results)
      return results
    }
  },
  methods: {
    setDefaultIds () {
      this.$refs.kmcheckboxquery.setCheckIds(this.currselectids)
    },
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
    // fetchData () {
    //   // this.$refs.selfhead.query()
    //   results = pageData(this., this.pageInfo.page, this.pageInfo.rows)
    // },
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
      if (this.mulselect) {
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
            if (item.pk_accsubj === tabledata[index - 1].pk_accsubj) {
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
