<template>
    <el-container style = "height:calc(100% - 30px)">
        <el-main style = "padding:0px">
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
                        property="fzcode"
                        label="编码"
                        header-align="center"
                        width = "80"
                        show-overflow-tooltip
                        :formatter="formaterFzcode"
                        v-if = "mulselect"
                ></el-table-column>
                <el-table-column
                        property="fzname"
                        label="名称"
                        show-overflow-tooltip
                        header-align="center"
                        :formatter="formaterFzname"
                        v-if = "mulselect"
                        width = "210"
                ></el-table-column>
                <el-table-column
                        property="rq"
                        label="日期"
                        header-align="center"
                        show-overflow-tooltip
                        width="100"
                ></el-table-column>
                <el-table-column
                        property="pzh"
                        label="凭证号"
                        header-align="center"
                        show-overflow-tooltip
                        width="100"
                >
                  <template slot-scope="scope" v-if="scope.row.pzh != null">
                    记<el-link  type="primary"  @click.stop.prevent="linkPzByid(scope.row.pk_tzpz_h)">{{scope.row.pzh}}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                        property="zy"
                        label="摘要"
                        header-align="center"
                        show-overflow-tooltip
                        width="100"
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
                        show-overflow-tooltip
                        width="50"
                ></el-table-column>
                <el-table-column
                        property="ye"
                        label="余额"
                        header-align="center"
                        align="right"
                        show-overflow-tooltip
                        width="150"
                        :formatter="repformny"
                ></el-table-column>
            </el-table>
        </el-main>

      <km-check-box-query ref="kmcheckboxquery"  :key="'tablebwb_check'"  :nodename="nodename" :bsavesetting="true" :treedata="treedata"
                          :currselectids.sync="currselectids" :mulselect.sync="mulselect" ></km-check-box-query>

    </el-container>
</template>

<script>
import { pageData } from '@/utils'
import KmCheckBoxQuery from '@/components/Report/KmCheckBoxQuery'

export default {
  components: {
    KmCheckBoxQuery
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
    },
    pageInfo: {
      type: Object
    }
  },
  data () {
    return {
      filterText: '',
      currselectids: [],
      spanArr: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      switchval: false,
      // tree是否多选
      mulselect: true
      // filterTreeData: []
    }
  },
  computed: {
    defaultcurrid: function () {
      if (this.alltabledata != null && this.alltabledata.length > 0) {
        return [this.alltabledata[0].fzxm]
      }
      return []
    },
    filterTreeData: function () {
      let array = []
      if (!this.mulselect) {
        // 去掉多选
        for (const obj of this.treedata) {
          if (obj.id === 'all') { // 全选
            continue
          }
          array[array.length] = obj
        }
      } else {
        array = this.treedata
      }
      return array
    },
    fzselectdata: function () {
      const reslut = []
      if (this.treedata && this.treedata.length > 0) {
        for (const obj of this.treedata) {
          if (obj.id === 'all') { // 全选
            continue
          }
          reslut[reslut.length] = obj
          if (obj.children != null && obj.children.length > 0) {
            this.looptreedata(reslut, obj.children)
          }
        }
      }
      return reslut
    },
    tabledata: function () {
      let results = []
      let a = this.currselectids
      if (this.alltabledata !== undefined && this.alltabledata != null && this.alltabledata.length > 0) {
        if (this.currselectids == null || this.currselectids.length === 0) {
          a = this.defaultcurrid
        }
        for (const str of a) {
          for (const obj of this.alltabledata) {
            if (str === obj.fzxm || str === obj.fzxm + '~') {
              results[results.length] = obj
            }
          }
        }
      }
      this.$emit('updatetotal', results.length)
      this.$emit('updatecurrdata', results)
      if (results != null && results.length > 0) {
        results = pageData(results, this.pageInfo.page, this.pageInfo.rows)
        this.putHeadName(results[0])
      } else {
        this.putHeadName('')
      }
      this.putSpanArr(results)
      return results
    }
  },
  watch: {
  },
  created () {
    // 查询设置
    // this.querySettingMsg()
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
    handleNodeExpand (a, b, c) {
    },
    switchchange (val) {
      this.filterText = ''
      this.mulselect = !val
      this.currselectids = this.defaultcurrid
      this.$refs.tree.setCheckedNodes([])
      this.saveSettingMsg()
    },
    looptreedata (result, child) {
      for (const obj of child) {
        result[result.length] = obj
        if (obj.children && obj.children.length > 0) {
          this.looptreedata(result, obj.children)
        }
      }
    },
    putHeadName (data) {
      let value = ''
      if (data != null && data !== undefined && !this.mulselect) { // 单选
        if (data.kmcode != null && data.fzcode.length > 0) {
          value = data.kmcode + '   ' + data.kmname
        } else if (data.fzcode && data.fzname) {
          value = data.fzcode + '   ' + data.fzname
        }
      }
      this.$emit('updatesinglekmname', value)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    formaterFzcode (row, column, cellValue) {
      if (row.kmcode) {
        return cellValue + '_' + row.kmcode
      } else {
        return cellValue
      }
    },
    formaterFzname (row, column, cellValue) {
      if (row.kmname) {
        return cellValue + '_' + row.kmname
      } else {
        return cellValue
      }
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
            if (item.fzxm === tabledata[index - 1].fzxm) {
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
