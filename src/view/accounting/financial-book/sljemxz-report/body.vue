<template>
    <el-container style = "height:calc(100% - 30px)">
        <el-main style = "padding:0px">
            <el-table
                    ref="reftable"
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
                        fixed
                        align="center"
                        width="50">
                </el-table-column>
                <el-table-column
                        property="kmbm"
                        label="科目编码"
                        fixed
                        show-overflow-tooltip
                        header-align="center"
                        width = "85"
                ></el-table-column>
                <el-table-column
                        property="kmmc"
                        label="科目名称"
                        fixed
                        show-overflow-tooltip
                        header-align="center"
                        width = "100"
                ></el-table-column>
                <el-table-column
                        property="jldw"
                        label="计量单位"
                        fixed
                        show-overflow-tooltip
                        header-align="center"
                        width = "71"
                ></el-table-column>
                <el-table-column
                      property="opdate"
                      label="日期"
                      fixed
                      show-overflow-tooltip
                      header-align="center"
                      width="85"
                ></el-table-column>
                <el-table-column
                        property="pzh"
                        label="凭证号"
                        fixed
                        show-overflow-tooltip
                        header-align="center"
                        width="67">
                  <template slot-scope="scope" v-if="scope.row.pzh != null">
                    <a class="pz-link" @click.stop.prevent="openVoucher(scope.row.pzhhid)">记{{ scope.row.pzh }}</a>
                  </template>
                </el-table-column>
                <el-table-column
                        property="zy"
                        label="摘要"
                        fixed
                        show-overflow-tooltip
                        header-align="center"
                        width="100"
                ></el-table-column>
              <el-table-column
                label="借方"
                align="center">
                <el-table-column
                  property="nnum"
                  label="数量"
                  show-overflow-tooltip
                  :formatter="repformum"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="nprice"
                  label="单价"
                  show-overflow-tooltip
                  v-if="bodycolumnjfnprice == 'Y'"
                  :formatter="repforprice"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="nmny"
                  label="金额"
                  show-overflow-tooltip
                  :formatter="repformny"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="贷方"
                align="center">
                <el-table-column
                  property="ndnum"
                  label="数量"
                  show-overflow-tooltip
                  :formatter="repformum"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="ndprice"
                  label="单价"
                  v-if="bodycolumndfnprice == 'Y'"
                  show-overflow-tooltip
                  :formatter="repforprice"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="ndmny"
                  label="金额"
                  show-overflow-tooltip
                  :formatter="repformny"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
              </el-table-column>
              <el-table-column
                property="dir"
                label="方向"
                show-overflow-tooltip
                header-align="center"
                width="46"
              >
                <template #default="scope">
                  {{ scope.row.dir == 0 ? "借" : scope.row.dir == 1 ? "贷" : "平" }}
                </template>
              </el-table-column>
              <el-table-column
                label="余额"
                align="center">
                <el-table-column
                  property="nynum"
                  label="数量"
                  show-overflow-tooltip
                  :formatter="repformum"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="nyprice"
                  label="单价"
                  show-overflow-tooltip
                  v-if="bodycolumnyenprice == 'Y'"
                  :formatter="repforprice"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="nymny"
                  label="金额"
                  show-overflow-tooltip
                  :formatter="repformny"
                  header-align="center"
                  align="right"
                  width="120">
                </el-table-column>
              </el-table-column>

            </el-table>
        </el-main>
        <km-check-box-query ref="kmcheckboxquery" :key="'tablebwb_check'"
                          :nodename="nodename"
                          :treedata="treedata"
                          :bsavesetting="true"
                          :currselectids.sync="currselectids"
                          :mulselect.sync="mulselect" >
        </km-check-box-query>
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
    bodycolumnjfnprice: {
      type: String
    },
    bodycolumndfnprice: {
      type: String
    },
    bodycolumnyenprice: {
      type: String
    },
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
    },
    routerParam: {
      type: Object
    }
  },
  data () {
    return {
      filterText: '',
      currselectids: [],
      spanArr: [],
      pricePre: this.$store.getters.pricePre,
      numPre: this.$store.getters.numPre,
      // defaultProps: {
      //     children: 'children',
      //     label: 'kmbm'
      // },
      // switchval: false,
      // tree是否多选
      mulselect: true

    }
  },
  computed: {
    defaultcurrid: function () {
      if (this.alltabledata != null && this.alltabledata.length > 0) {
        return [this.alltabledata[0].id]
      }
      return []
    },
    // fzselectdata: function () {
    //     let reslut = []
    //     if (this.treedata && this.treedata.length > 0) {
    //         for (const obj of this.treedata) {
    //             reslut[reslut.length] = obj
    //             if (obj.children != null && obj.children.length > 0) {
    //                 this.looptreedata(reslut, obj.children)
    //             }
    //         }
    //     }
    //     return reslut
    // },
    currentabledata: function () {
      let results = []
      let a = this.currselectids
      if (this.alltabledata && this.alltabledata.length > 0) {
        if (this.currselectids == null || this.currselectids.length === 0) {
          a = this.defaultcurrid
        }
        for (const obj of this.alltabledata) {
          for (const str of a) {
            if (str === obj.id || str === obj.id + '~') {
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
        this.putHeadName(results[0])
      } else {
        this.putHeadName('')
      }

      this.$emit('updatetotal', results.length)
      this.$emit('updatecurrdata', results)

      this.putSpanArr(results)
      return results
    }
  },
  watch: {
    routerParam: {
      handler (data) {
        if (data) {
          // 勾选数据清空
          this.currselectids = typeof this.routerParam === 'undefined' ? [] : [this.routerParam.pk_km]
        }
      },
      immediate: true
    },
    'currselectids' (newv, oldv) {

    },
    'bodycolumnjfnprice' (newval, oldvalue) {
      this.$nextTick(() => {
        this.$refs.reftable.doLayout()
      })
    },
    'bodycolumndfnprice' (newval, oldvale) {
      this.$nextTick(() => {
        this.$refs.reftable.doLayout()
      })
    },
    'bodycolumnyenprice' (newval, oldvale) {
      this.$nextTick(() => {
        this.$refs.reftable.doLayout()
      })
    }
    // filterText (val) {
    //     this.$refs.tree.setChecked(val, true)
    //     this.$refs.tree.$children[100].$el.focus()
    //     this.$refs.tree.store.nodesMap[val].isCurrent = true
    //     this.$refs.tree.store.nodesMap[val].expanded = true
    //     this.$refs.tree.store.nodesMap[val].parent.expanded = true
    //     const checknodes = this.$refs.tree.getCheckedKeys()
    //     if (this.mulselect) {
    //         this.currselectids = checknodes
    //     } else {
    //         this.currselectids = [val]
    //     }
    // }
  },
  methods: {
    // 赋值右边树check值
    setDefaultIds () {
      this.$refs.kmcheckboxquery.setCheckIds(this.currselectids)
    },
    openVoucher (pzid) {
      if (!this.$hasPermission('voucher-edit')) {
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: pzid
        }
      })
    },
    handleNodeExpand (a, b, c) {
    },
    getCurrSelectids () {
      if (this.currselectids == null || this.currselectids.length === 0) {
        return [this.defaultcurrid]
      }
      return this.currselectids
    },
    // switchchange (val) {
    //     this.filterText = ''
    //     this.mulselect = !val
    //     this.currselectids = this.defaultcurrid
    //     this.$refs.tree.setCheckedNodes([])
    // },
    // looptreedata (result, child) {
    //     for (const obj of child) {
    //         result[result.length] = obj
    //         if (obj.children && obj.children.length > 0) {
    //             this.looptreedata(result, obj.children)
    //         }
    //     }
    // },
    putHeadName (data) {
      let value = ''
      if (data != null && data !== undefined && !this.mulselect) { // 单选
        if (data.kmbm != null) {
          value = data.kmbm + '_' + data.kmmc
        }
        // if (data.kmbm != null && data.fzcode.length > 0) {
        //     value = data.kmbm + '_' + data.kmmc
        // } else {
        //     value = data.fzcode + '   ' + data.fzname
        // }
      }
      this.$emit('updatesinglekmname', value)
    },
    // filterNode (value, data) {
    //     if (!value) return true
    //     return data.label.indexOf(value) !== -1
    // },
    repformum (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, this.numPre)
    },
    repforprice (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, this.pricePre)
    },
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    // clickTree (data, checknodes) {
    //     if (this.mulselect) {
    //         if (checknodes != null && checknodes.checkedKeys.length > 0) {
    //             this.currselectids = checknodes.checkedKeys
    //         } else {
    //             this.currselectids = []
    //         }
    //         // 全选，全消处理
    //         if (data.id === 'all') {
    //             if (this.currselectids.includes('all')) {
    //                 this.currselectids = []
    //                 for (const t of this.fzselectdata) {
    //                     this.currselectids[this.currselectids.length] = t.id
    //                 }
    //                 // 选中全部
    //                 this.$refs.tree.setCheckedKeys(this.currselectids)
    //             } else {
    //                 // 取消全选
    //                 this.currselectids = []
    //                 this.$refs.tree.setCheckedKeys([])
    //             }
    //         }
    //     } else {
    //         this.currselectids = [data.id]
    //     }
    // },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // if (this.mulselect) {
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
      } else if (columnIndex === 3) {
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
      // }
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
  .pz-link {
    color: #2b3de7;
    cursor: pointer;
  }
</style>
