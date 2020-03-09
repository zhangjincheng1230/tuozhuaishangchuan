<template>
  <div>
    <el-dialog  :close-on-click-modal="false"
                :close-on-press-escape="false" :title="currkmqc ? currkmqc.kminfo + '-未核销期初' : '' + '-未核销期初'"  :visible.sync="visible"  width="850px" >
      <template>
        <div>
          <el-button @click="addline">增行</el-button>
          <el-button @click="$refs.table.removeSelecteds()">删行</el-button>
          <el-button @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </template>
      <vxe-table
        ref="table"
        border
        resizable
        show-overflow
        height="300px"
        :data="whxtabledata"
        @edit-closed="handleRowEditClose"
        :edit-config="{trigger: 'click', mode: 'row', showIcon: false, autoClear: false}">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column field="kmcode" title="编码" header-align="center" width="150" :edit-render="{name: 'input'}" >
          <template v-slot:edit="scope"  >
            <el-input v-model="scope.row.kmcode" ></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="kmname" title="名称" header-align="center" width="280" :edit-render="{name: 'input',autofocus: '.custom-input'}">
          <template v-slot:edit="scope"  >
            <el-input v-model="scope.row.kmname" placeholder="请输入内容" v-popover:popoverfzxm  class="custom-input"></el-input>
            <el-popover v-if = "currkmqc.isfzhs !== '0000000000'" ref="popoverfzxm" trigger="click"
                        transition="fade-in-linear" :visible-arrow="false" width="280" @hide="hidepopover(scope.row)">
              <el-form label-width="70px">
                <el-form-item :label="item.name" v-for="item in fzlbmap" :key="item.code">
                  <el-select  v-model="scope.row['fzhs'+item.code]" style="width: 162px" >
                    <el-option v-for="itemxm in fzxmmap[item.id]"
                               :key="itemxm.id" :value="itemxm.id" :label="itemxm.code + ' '+ itemxm.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-popover>
          </template>
        </vxe-table-column>
        <vxe-table-column field="date" title="业务发生日期" header-align="center" width="150" :edit-render="{name: 'input'}">
          <template v-slot:edit="scope">
            <el-date-picker v-model="scope.row.date" type="date" placeholder="选择日期"   style="width:130px" value-format="yyyy-MM-dd"></el-date-picker>
          </template>
        </vxe-table-column>
        <vxe-table-column field="mny" title="未核销金额" header-align="center" align="right" width="150" :formatter="repformny"
                          :edit-render="{name: 'input', attrs: {type: 'number'}}">
          <template v-slot:edit="scope"  >
            <el-input-number size="small" :precision="2"  :controls="false" v-model="scope.row.mny"
                             placeholder="请输入内容" >
            </el-input-number>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script>
import Big from 'big.js'
import { ACCOUNT_FZHS_DEFAULT } from '@/constants/subject'
export default {
  name: 'whxqcdialog',
  data () {
    return {
      visible: false,
      fzlbmap: {}, // 辅助类别
      fzxmmap: {} // 辅助项目
    }
  },
  props: {
    whxtabledata: {},
    currkmqc: {},
    fztabledata: {} // 辅助期初数据
  },
  watch: {
  },
  created () {
  },
  computed: {
    total () {
      let total = 0
      const rows = this.$refs.table.tableData
      for (const t of rows) {
        total = this.accAdd(total, t.mny)
      }
      return total
    },
    vFzqc () {
      let vFzqc = {}
      const rows = this.$refs.table.tableData
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        let vFzMny = vFzqc[row.kmcode]
        if (vFzMny) {
          vFzqc[row.kmcode] = this.accAdd(vFzMny, row.mny)
        } else {
          vFzqc[row.kmcode] = row.mny
        }
      }
      return vFzqc
    }
  },
  methods: {
    save () {
      let rows = this.$refs.table.tableData
      const isfzhs = this.currkmqc.isfzhs
      if (isfzhs !== ACCOUNT_FZHS_DEFAULT) {
        for (let i = 0; i < rows.length; i++) {
          var row = rows[i]
          for (var j = 0; j < isfzhs.length; j++) {
            if (isfzhs[j] === '1' && row['fzhs' + (j + 1)] === undefined) {
              this.$message({showClose: true, message: '第' + (i + 1) + '行未选择辅助核算', type: 'warning'})
              return
            }
          }
        }
      }

      if (this.total !== this.nvlNum(this.currkmqc.monthqc)) {
        this.$message({showClose: true, message: '未核销期初与本月期初不等，请检查', type: 'warning'})
        return
      }

      if (this.fztabledata) {
        for (var i = 0; i < this.fztabledata.length; i++) {
          var fzqcItem = this.fztabledata[i]
          // 辅助核算期初
          var fzMny = fzqcItem.monthqc ? fzqcItem.monthqc : 0
          var fzCode = fzqcItem.kmcode
          if (this.vFzqc[fzCode] !== fzMny) {
            this.$message({showClose: true, message: '未核销期初与辅助期初不等，请检查', type: 'warning'})
            return
          }
        }
      }

      let formdata = new FormData()
      formdata.append('vdata', JSON.stringify(this.$refs.table.tableData))
      formdata.append('pk_km', this.currkmqc.pk_km)
      this.$api.KmQc.whxqcsave(formdata).then((rs) => {
        if (rs.success) {
          this.$message({showClose: true, message: rs.msg, type: 'success'})
          this.visible = false
          this.$emit('onrefresh')
        } else {
          this.$message({showClose: true, message: rs.msg, type: 'warning'})
        }
      }).catch(e => {
      })
    },
    cancel () {
      this.visible = false
    },
    repformny (obj) {
      let cellValue = obj.cellValue
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    show (fzlbmap, fzxmmap) {
      this.visible = true
      this.fzlbmap = fzlbmap
      this.fzxmmap = fzxmmap
    },
    // 增行
    addline () {
      let record = {
        kmcode: this.currkmqc.kmcode,
        kmname: this.currkmqc.kmname,
        kmdir: this.currkmqc.kmdir,
        pk_km: this.currkmqc.pk_km
      }
      const row = -1
      this.$refs.table.insertAt(record, row)
        .then(({ row }) => this.$refs.table.setActiveCell(row, 'kmname'))
    },
    clearfs () {
      if (this.$refs.table.tableData) {
        for (const tt of this.$refs.table.tableData) {
          for (const str of this.fscolumn) {
            tt[str] = null
          }
        }
      }
    },
    handleRowEditClose (obj) {
      const row = obj.row
      this.hidepopover(row)
    },
    hidepopover (row) {
      let name = ''
      let code = ''
      for (const key in this.fzlbmap) {
        const fzlbid = this.fzlbmap[key].id
        const fzxmid = row['fzhs' + this.fzlbmap[key].code]
        for (const tt of this.fzxmmap[fzlbid]) {
          if (tt.id === fzxmid) {
            name = name + tt.name + '_'
            code = code + tt.code + '_'
            break
          }
        }
      }
      if (code.length > 1) {
        row.kmcode = this.currkmqc.kmcode + '_' + code.substring(0, code.length - 1)
      }
      if (name.length > 1) {
        row.kmname = this.currkmqc.kmname + '_' + name.substring(0, name.length - 1)
      }
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
    }
  }
}
</script>

<style scoped>
  li {
    list-style: none
  }
</style>
