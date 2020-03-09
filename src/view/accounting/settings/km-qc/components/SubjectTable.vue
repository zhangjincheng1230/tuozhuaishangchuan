<template>
  <el-table
    ref = "myTable"
    :data="tableData"
    style="width: 100%;"
    height="100%"
    row-key="qcid"
    border
    highlight-current-row
    @current-change="handleCurrentChange"
    @row-dblclick="dbclick"
    default-expand-all
    class="tb-edit"
    :tree-props="{children: 'children'}">
    <el-table-column fixed type="index" label="序号" align="center">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="kminfo" label="科目" sortable width="300" header-align="center">
      <template #default="{row}">
        <template v-if="row.kmlev === 1 && (!row.children || row.children.length === 0)">
          <div class="prefix-indent"></div>
          {{row.kminfo}}
          <a v-if="row.isfzhs !== '0000000000'" href="javascript: void(0)" title="查看辅助核算期初" @click="$emit('showfzqc', row)" class="show_fzqc"></a>
        </template>
        <template v-else>
          {{row.kminfo}}
          <a v-if="row.isfzhs !== '0000000000'" href="javascript: void(0)" title="查看辅助核算期初" @click="$emit('showfzqc', row)" class="show_fzqc"></a>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="opdate" label="录入日期" width="100" header-align="center">
    </el-table-column>
    <el-table-column
      prop="kmdir" label="方向" :formatter="formatDirection" width="50" header-align="center">
    </el-table-column>
    <el-table-column  key="jldw" :class-name="bshownum ?  '' : 'hidenumclass'" v-if="bshownum"
      prop="jldw" label="计量单位"   width="100"  header-align="center">
    </el-table-column>
    <el-table-column key="bnqcnum" :class-name="bshownum ?  '' : 'hidenumclass'" v-if="bshownum"
      property="bnqcnum" label="本年期初数量"  header-align="center" align="right" width="150" :formatter="repformnyNum">
     <template slot-scope="scope">
        <el-input-number v-show="rowEdit(scope.row)" size="small" :precision="numPre"  :controls="false"
                         v-model="scope.row.bnqcnum" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'bnqcnum')">
        </el-input-number>
        <span>{{scope.row.bnqcnum | forThousands(numPre)}}</span>
      </template>
    </el-table-column>
    <el-table-column v-if = "bwb" key="ybnqc" property="ybnqc" label="原币本年期初"  header-align="center"
                     align="right" width="150" :formatter="repformny">
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" size="small" :precision="2"  :controls="false"
                         v-model="scope.row.ybnqc" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row , 'ybnqc' )">
        </el-input-number>
        <span>{{scope.row.ybnqc | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column property="nqc" label="本年期初金额" key="nqc" header-align="center" align="right"
                     width="150" :formatter="repformny">
      <template slot-scope="scope">
        <el-input-number
          v-if="rowEdit(scope.row)" size="small" :precision="2"  :controls="false" v-model="scope.row.nqc"
          placeholder="请输入内容" @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'nqc')">
        </el-input-number>
        <span>{{scope.row.nqc | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column  :class-name="bshownum ?  '' : 'hidenumclass'"
                      key="bnfsnum" property="bnfsnum" label="本年借方发生数量"
                     header-align="center" align="right" width="150" :formatter="repformnyNum" >
      <template slot-scope="scope">
        <el-input-number v-show="rowEdit(scope.row)" size="small" :precision="numPre"  :controls="false"
                         v-model="scope.row.bnfsnum" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'bnfsnum' )">
        </el-input-number>
        <span>{{scope.row.bnfsnum | forThousands(numPre)}}</span>
      </template>
    </el-table-column>
    <el-table-column v-if = "bwb" key = "ybnjf" property="ybnjf" label="原币本年借方发生"
                     header-align="center" align="right" width="150" :formatter="repformny"  >
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" :disabled="bdisablefs"  size="small" :precision="2"  :controls="false"
                         v-model="scope.row.ybnjf" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'ybnjf')">
        </el-input-number>
        <span>{{scope.row.ybnjf | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column  property="njf" label="本年借方发生金额" key="njf"  header-align="center"
                      align="right" width="150" :formatter="repformny" >
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" :disabled="bdisablefs"  size="small" :precision="2"  :controls="false"
                         v-model="scope.row.njf" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'njf')">
        </el-input-number>
        <span>{{scope.row.njf | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column  :class-name="bshownum ?  '' : 'hidenumclass'" property="bndffsnum" label="本年贷方发生数量" key="bndffsnum"
                     header-align="center" align="right" width="150" :formatter="repformnyNum" >
      <template slot-scope="scope">
        <el-input-number v-show="rowEdit(scope.row)" size="small" :precision="numPre"  :controls="false"
                         v-model="scope.row.bndffsnum" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'bndffsnum')">
        </el-input-number>
        <span>{{scope.row.bndffsnum | forThousands(numPre)}}</span>
      </template>
    </el-table-column>
    <el-table-column v-if = "bwb" property="ybndf" label="原币本年贷方发生" key="ybndf"  header-align="center"
                     align="right" width="150" :formatter="repformny"  >
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" :disabled="bdisablefs"  size="small" :precision="2"  :controls="false"
                         v-model="scope.row.ybndf" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row,'ybndf')">
        </el-input-number>
        <span>{{scope.row.ybndf | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column
      property="ndf" label="本年贷方发生金额" key="ndf"  header-align="center" align="right" width="150" :formatter="repformny">
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" :disabled="bdisablefs"  size="small" :precision="2"  :controls="false"
                         v-model="scope.row.ndf" placeholder="请输入内容"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row,'ndf')">
        </el-input-number>
        <span>{{scope.row.ndf | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column  :class-name="bshownum ?  '' : 'hidenumclass'" property="monthqmnum" label="本月期初数量"  key="monthqmnum" header-align="center"
                     align="right" width="150" :formatter="repformnyNum" >
      <template slot-scope="scope">
        <el-input-number v-show="rowEdit(scope.row)" size="small" :precision="numPre"  :controls="false"
                         v-model="scope.row.monthqmnum" placeholder="请输入内容" @focus="bfocus"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'monthqmnum')">
        </el-input-number>
        <span>{{scope.row.monthqmnum | forThousands(numPre)}}</span>
      </template>
    </el-table-column>
    <el-table-column v-if = "bwb" property="ybmonthqc" label="原币本月期初"  key="ybmonthqc" header-align="center"
                     align="right" width="150" :formatter="repformny"  >
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" size="small" :precision="2"  :controls="false"
                         v-model="scope.row.ybmonthqc" placeholder="请输入内容" @focus="bfocus"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row,'ybmonthqc')">
        </el-input-number>
        <span>{{scope.row.ybmonthqc | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column property="monthqc" label="本月期初金额" key="monthqc"  header-align="center"
                     align="right" width="150" :formatter="repformny">
      <template slot-scope="scope">
        <el-input-number v-if="rowEdit(scope.row)" size="small" :precision="2"  :controls="false"
                         v-model="scope.row.monthqc" placeholder="请输入内容" @focus="bfocus"
                         @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row,'monthqc')">
        </el-input-number>
        <span>{{scope.row.monthqc | forThousands}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="isleaf" label="是否末级" width="100" align="center">
      <template #default="{ row }">
        <el-checkbox v-model="row.isleaf" true-label="是" disabled></el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { DIRECTIONS } from '@/constants/index'
import Big from 'big.js'
import { ACCOUNT_FZHS_DEFAULT } from '@/constants/subject'

export default {
  name: 'SubjectTable',
  props: {
    currency: {},
    edit: {},
    bshownum: {},
    exrate: {}, // 外币汇率
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    tabName: {} // 页签名字
  },
  filters: {
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.myTable.doLayout()
    })
  },
  data () {
    return {
      currentRow: null,
      numPre: this.$store.getters.numPre, // 数量精度
      huilvPre: this.$store.getters.huilvPre // 汇率精度
    }
  },
  computed: {
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    // 是否外币
    bwb () {
      if (this.currency && this.currency.id) {
        return this.currency.id !== '00000100AA10000000000BKT' && this.currency.id !== 'zhbwb'
      } else {
        return false
      }
    },
    // 不包含
    nochildtabledata () {
      let json = []
      this.getSubJson(this.tableData, json)
      return json
    },
    bdisablefs () { // 根据公司建账日期，
      const corp = this.$store.getters.currentCorp
      if (corp.bdate) {
        if (corp.bdate.substring(5, 7) === '01') { // 如果是1月份，则不能编辑
          return true
        }
      }
      return false
    }
  },
  created () {
  },
  methods: {
    bfocus (event) {
      event.target.blur()
    },
    selectRow (tt) {
      this.$refs.myTable.toggleRowSelection(tt)
      this.$refs.myTable.setCurrentRow(tt)
    },
    // 行是否编辑
    rowEdit (row) {
      if (row.isfzhs !== ACCOUNT_FZHS_DEFAULT) {
        return false
      }
      if (row.isleaf === '是' && this.edit) {
        return true
      }
      return false
    },
    // 行双击
    dbclick (row) {
      if (row.isfzhs === ACCOUNT_FZHS_DEFAULT) {
        return
      }
      this.$emit('showfzqc', row)
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    repformnyNum (row, column, cellValue) { // 数量精度
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, this.numPre)
    },
    // repformnyHuiLv (row, column, cellValue) { // 汇率精度
    //   debugger
    //   if (!Number.isFinite(cellValue) || cellValue === 0) {
    //     return ''
    //   }
    //   return this.$options.filters.forThousands(cellValue, this.huilvPre)
    // },
    formatDirection (row, column, cellValue) {
      return DIRECTIONS.find(item => item.value === cellValue).label
    },
    getSelectedRow () {
      return this.currentRow
    },
    handleCurrentChange (row, event, column) {
      this.$emit('select', row, this.getFirstRow(row))
    },
    // 除法函数
    accDiv (arg1, arg2) {
      return Number(new Big(this.nvlNum(arg1)).div(this.nvlNum(arg2)))
    },
    // 乘法函数
    accMul (arg1, arg2) {
      return Number(new Big(this.nvlNum(arg1)).mul(this.nvlNum(arg2)))
    },
    // 加法函数
    accAdd (arg1, arg2) {
      return Number(new Big(this.nvlNum(arg1)).add(this.nvlNum(arg2)))
    },
    // 减法函数
    accSubtr (arg1, arg2) {
      return Number(new Big(this.nvlNum(arg1)).sub(this.nvlNum(arg2)))
    },
    nvlNum (value) {
      if (value === undefined || value === '' || value === null) {
        return 0
      }
      return value
    },
    getSubJson (jsonData, json) {
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i]) {
          json.push(jsonData[i])
        }
        if (jsonData[i] && jsonData[i].hasOwnProperty('children')) { // 递归方法循环子节点的数据并加入json中
          this.getSubJson(jsonData[i].children, json)
        }
      }
    },
    handleEdit (newvalue, oldvalue, index, row, columnkey) {
      if (this.edit) {
        let chazhi = this.accSubtr(arguments[0], arguments[1])
        let chazhis = [chazhi] // 需要更改的值
        let columns = [columnkey] // 需要更改的字段
        if (columnkey === 'nqc' || columnkey === 'njf' || columnkey === 'ndf') { //
          this.calBwbMny(row, chazhis, columns)
        } else if (columnkey === 'bnqcnum' || columnkey === 'bnfsnum' || columnkey === 'bndffsnum') { //
          this.calBwbNum(row, chazhis, columns)
        } else if (columnkey === 'ybnqc' || columnkey === 'ybnjf' || columnkey === 'ybndf') { //
          let ce = row.kmdir === 0 ? this.accSubtr(row.ybnjf, row.ybndf) : this.accSubtr(row.ybndf, row.ybnjf)
          let oldmonthqc = row.ybmonthqc
          row.ybmonthqc = this.accAdd(row.ybnqc, ce)
          // 原币金额
          chazhis[chazhis.length] = this.accSubtr(row.ybmonthqc, oldmonthqc)
          columns[columns.length] = 'ybmonthqc'
          // 计算本币
          if (this.currency.convmode === 0) {
            let bwb_new = this.accMul(row[columnkey], this.exrate)
            chazhis[chazhis.length] = this.accSubtr(bwb_new, row[columnkey.substring(2)])
            columns[columns.length] = columnkey.substring(2)
            row[columnkey.substring(2)] = bwb_new
          } else {
            let bwb_new = this.accDiv(row[columnkey], this.exrate)
            chazhis[chazhis.length] = this.accSubtr(bwb_new, row[columnkey.substring(2)])
            columns[columns.length] = columnkey.substring(2)
            row[columnkey.substring(2)] = bwb_new
          }
          // 计算本位币
          this.calBwbMny(row, chazhis, columns)
        }
        // 父级赋值
        if (row.parent_id) {
          console.log(columns)
          this.putParentRow(row, chazhis, columns)
        }
      }
    },
    calBwbMny (row, chazhis, columns) {
      let ce = row.kmdir === 0 ? this.accSubtr(row.njf, row.ndf) : this.accSubtr(row.ndf, row.njf)
      let oldmonthqc = row.monthqc
      row.monthqc = this.accAdd(row.nqc, ce)
      // 本月期初差值
      const monthqcChazhi = this.accSubtr(row.monthqc, oldmonthqc)
      chazhis[chazhis.length] = monthqcChazhi
      columns[columns.length] = 'monthqc'
    },
    calBwbNum (row, chazhis, columns) {
      let ce = row.kmdir === 0 ? this.accSubtr(row.bnfsnum, row.bndffsnum) : this.accSubtr(row.bndffsnum, row.bnfsnum)
      let oldmonthqc = row.monthqmnum
      row.monthqmnum = this.accAdd(row.bnqcnum, ce)
      // 本月数量
      chazhis[chazhis.length] = this.accSubtr(row.monthqmnum, oldmonthqc)
      columns[columns.length] = 'monthqmnum'
    },
    getFirstRow (row) {
      if (!row.parent_id) {
        return row
      }
      for (let tt of this.nochildtabledata) {
        if (tt.qcid === row.parent_id) {
          if (tt.parent_id) {
            return this.getFirstRow(tt)
          } else {
            return tt
          }
        }
      }
    },
    putParentRow (row, chazhis, columns) {
      for (let tt of this.nochildtabledata) {
        if (tt.qcid === row.parent_id) {
          for (let i = 0; i < columns.length; i++) {
            if (tt.kmdir === row.kmdir) {
              tt[columns[i]] = this.accAdd(tt[columns[i]], chazhis[i])
            } else {
              tt[columns[i]] = this.accSubtr(tt[columns[i]], chazhis[i])
            }
          }
          if (tt.parent_id) {
            this.putParentRow(tt, chazhis, columns)
          }
        }
      }
    }
  }
}
</script>
<style scoped>
  .el-table .cell {
    white-space: pre-line;
  }
  .tb-edit .el-input-number {
    display: none
  }
  .tb-edit .current-row .el-input-number {
    display: block
  }
  .tb-edit .current-row .el-input-number+span {
    display: none
  }
  .show_fzqc {
    position: absolute;
    right: 0px;
    width: 18px;
    height: 18px;
    background: url(../../../../../assets/img/chakan.png);
    background-position: 3px 4px;
    background-repeat: no-repeat;
  }
  >>> .hidenumclass {
    display: none;
  }
  .prefix-indent {
    display: inline-block;
    width: 20px;
    margin-right: 3px;
  }
</style>
