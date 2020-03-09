<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :title="currkmqc ? currkmqc.kminfo + '-辅助期初' : ''  + '-辅助期初'"  :visible.sync="visible"
               width="1150px" >
      <template>
        <div v-if = "this.currency.id !=='zhbwb'">
          <el-button @click="addline">增行</el-button>
          <el-button @click="$refs.table.removeSelecteds()">删行</el-button>
          <el-button @click="clearfs">清除发生</el-button>
          <el-button @click="save">保存</el-button>
          <el-button @click="fzdr" v-show="bshowdr">导入</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </template>
      <vxe-table
        ref="table"
        border
        resizable
        show-overflow
        height="300px"
        :data="tabledata"
        @scroll="scrollHandle"
        @edit-closed="handleRowEditClose"
        :edit-config="{trigger: 'click', mode: 'row', showIcon: false, autoClear: false}">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column field="kmcode" title="编码" header-align="center" width="150" :edit-render="{name: 'input'}">
          <template v-slot:edit="scope"  >
            <el-input v-model="scope.row.kmcode"></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="kmname" title="名称" header-align="center" width="300" :edit-render="{name: 'input',autofocus: '.custom-input'}">
          <template v-slot:edit="scope"  >
            <el-input v-model="scope.row.kmname" placeholder="请输入内容" v-popover:popoverfzxm  class="custom-input"></el-input>
            <el-popover  v-model = "bpopovershow" ref="popoverfzxm" trigger="click" transition="fade-in-linear"
                        placement="bottom-start" :visible-arrow="false" width="280" @hide="hidepopover(scope.row)">
              <el-form label-width="70px">
                <el-form-item :label="item.name" v-for="item in fzlbmap" :key="item.code">
                  <el-select ref="selectref" v-model="scope.row['fzhs'+item.code]" @change="fzxmSelectChange(scope)" style="width: 162px" >
                    <el-option v-for="itemxm in fzxmmap[item.id]"
                               :key="itemxm.id" :value="itemxm.id" :label="itemxm.code + ' '+ itemxm.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div style="float:left" @click="commonAssistClick(scope, $event)">
                  <el-checkbox v-model="isCommonAssist" @change="commonAssistChange(scope)"  >辅助检索</el-checkbox>
                </div>
              </el-form>
            </el-popover>
          </template>
        </vxe-table-column>
        <vxe-table-column  v-if="iskc" key="spec" field="spec" title="规格（型号）" header-align="center" width="110" :edit-render="{name: 'input'}">
          <template v-slot:edit="scope"  >
            <el-input v-model="scope.row.spec"  style = "width:90px"  ></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column v-if="isnum"  key="jldw" field="jldw" title="计量单位" header-align="center" width="110" :edit-render="{name: 'input'}">
          <template v-slot:edit="scope">
            <el-input v-model="scope.row.jldw" style = "width:90px" ></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column  v-if="isnum"  key="bnqcnum" field="bnqcnum" title="本年期初数量" header-align="center" align="right" width="150" :formatter="repformnyNum"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numPre},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column v-if="iswb"   key="ybnqc"  field="ybnqc" title="原币本年期初" header-align="center" align="right" width="150" :formatter="repformny"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column field="nqc"   key="nqc"  title="本年期初金额" header-align="center" align="right" width="150" :formatter="repformny"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column v-if="isnum" key="bnfsnum"   field="bnfsnum" title="本年借方发生数量" header-align="center" align="right" width="150" :formatter="repformnyNum"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numPre},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column   v-if="iswb" key="ybnjf"  field="ybnjf" title="原币本年借方发生" header-align="center" align="right" width="150" :formatter="repformny"
                            :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2,disabled:bdisablefs},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column  field="njf" key="njf"  title="本年借方发生金额" header-align="center" align="right" width="150" :formatter="repformny"
                           :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2,disabled:bdisablefs},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column v-if="isnum"   key="bndffsnum"  field="bndffsnum" title="本年贷方发生数量" header-align="center" align="right" width="150" :formatter="repformnyNum"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numPre},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column  v-if="iswb"   key="ybndf"  field="ybndf" title="原币本年贷方发生" header-align="center" align="right" width="150" :formatter="repformny"
                           :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2,disabled:bdisablefs},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column field="ndf" key="ndf"  title="本年贷方发生金额" header-align="center" align="right" width="150" :formatter="repformny"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2,disabled:bdisablefs},events:{change: handleEdit}}">
        </vxe-table-column>
        <vxe-table-column v-if="isnum"  key="monthqmnum"  field="monthqmnum" title="本月期初数量" header-align="center" align="right" width="150" :formatter="repformnyNum"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numPre},events:{change: handleEdit,focus:bfocus}}">
        </vxe-table-column>
        <vxe-table-column  v-if="iswb" key="ybmonthqc"  field="ybmonthqc" title="原币本月期初" header-align="center" align="right" width="150" :formatter="repformny"
                           :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events:{change: handleEdit,focus:bfocus}}">
        </vxe-table-column>
        <vxe-table-column field="monthqc" title="本月期初金额" header-align="center" align="right" width="150" :formatter="repformny"
                          :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events:{change: handleEdit,focus:bfocus}}">
        </vxe-table-column>
      </vxe-table>
    </el-dialog>
    <!--文件导入-->
    <UploaderDialog
      :visible.sync="impDialogVisible"
      name="impfile"
      :title="importTitle"
      @submit="importExcel"
      :param="uploadParam">
      <template #description>
        <div class="import-description">支持标准模板导入,没有导入模板<el-link type="primary"  @click="expExcel()">点击下载</el-link></div>
      </template>
    </UploaderDialog>
  </div>
</template>

<script>
import Big from 'big.js'
import UploaderDialog from '@/components/UploaderDialog'
export default {
  name: 'fzqcdialog',
  data () {
    return {
      visible: false,
      fzlbmap: {}, // 辅助类别
      fzxmmap: {}, // 辅助项目
      fscolumn: ['nqc', 'ybnqc', 'bnqcnum', 'njf', 'ybnjf',
        'bnfsnum', 'ndf', 'ybndf', 'bndffsnum', 'monthqc',
        'ybmonthqc', 'monthqmnum'],
      impDialogVisible: false,
      importTitle: '辅助期初导入',
      uploadParam: {}, // 上传参数，
      popperOptions: {
        boundariesElement: '#scrollParent',
        placement: 'right'
      },
      bpopovershow: false, // 辅助框是否显示
      numPre: this.$store.getters.numPre, // 数量精度
      tabledata: this.copydata(this.fztabledata),
      isCommonAssist: false // 是否辅助检索
      // huilvPre: this.$store.getters.huilvPre // 汇率精度
    }
  },
  props: {
    fztabledata: {},
    currkmqc: {}, // 当前科目期初数据
    currency: {}, // 当前选择币种对象
    currFirstrowdata: {}, // 当前科目期初的顶级数据
    verifyBeginAccounts: {}
  },
  watch: {
  },
  created () {
  },
  components: {
    UploaderDialog
  },
  computed: {
    // 是否显示导入按钮
    bshowdr () {
      let fzMatch = this.currkmqc.isfzhs.match(/1/g)
      if (fzMatch && fzMatch.length === 1 && this.currkmqc.isfzhs.indexOf('1') !== 2) {
        return true
      } else {
        return false
      }
    },
    isnum () {
      if (this.currkmqc && this.currkmqc.isnum) {
        return this.currkmqc.isnum === '是'
      } else {
        return false
      }
    },
    iskc () {
      if (this.currkmqc && this.currkmqc.isfzhs) {
        return this.currkmqc.isfzhs.charAt(5) === '1'
      } else {
        return false
      }
    },
    iswb () {
      if (this.currency && this.currency.id) {
        return this.currency.id !== '00000100AA10000000000BKT' && this.currency.id !== 'zhbwb'
      } else {
        return '00000100AA10000000000BKT'
      }
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
  methods: {
    // 辅助项目选择变化事件
    fzxmSelectChange (scope) {
      let commonAssist = this.getCommonAuxiliaryData(scope)
      this.checkCommonAuxiliaryExist(commonAssist)
    },
    // 获取辅助检索的参数
    getCommonAuxiliaryData (scope) {
      let commonAssist = new Object()
      commonAssist.pk_accsubj = this.currkmqc.pk_km
      // 辅助id的记录
      let isemptyfz = true
      for (let i = 0; i < 10; i++) {
        if (scope.row['fzhs' + i]) {
          commonAssist['fzhs' + i] = scope.row['fzhs' + i]
          isemptyfz = false
        }
      }
      if (isemptyfz === true) {
        return null
      } else {
        return commonAssist
      }
    },
    // 辅助检索事件
    commonAssistChange (scope) {
      let commonAssist = this.getCommonAuxiliaryData(scope)
      if (commonAssist) {
        if (this.isCommonAssist === true) {
          this.$api.Voucher.saveCommonAssist(commonAssist).then(res => {
            if (res.success) {
            }
          })
        } else {
          this.$api.Voucher.deleteCommonAssist(commonAssist).then(res => {
            if (res.success) {
            }
          })
        }
      }
    },
    checkCommonAuxiliaryExist (commonAssist) {
      if (commonAssist) {
        // 校验是否存在
        this.$api.Voucher.checkCommonAssistExist(commonAssist).then(res => {
          if (res.success) {
            this.isCommonAssist = true
          } else {
            // 自动保存
            this.isCommonAssist = true
            this.$api.Voucher.saveCommonAssist(commonAssist).then(res => {
              if (res.success) {
              }
            })
          }
        })
      } else {
        this.isCommonAssist = false
      }
    },
    copydata (obj) {
      if (obj) {
        return JSON.parse(JSON.stringify(obj))
      }
      return {}
    },
    // 可搜索点击事件
    commonAssistClick (scope, e) {
      let commonAssist = this.getCommonAuxiliaryData(scope)
      console.log(commonAssist)
      if (!commonAssist) {
        e.preventDefault()
      }
    },
    bfocus (a, b) {
      b.target.blur()
    },
    // 滚动条触发事件
    scrollHandle ({type, fixed, scrollTop, scrollLeft, isX, isY}, event) {
      if (this.bpopovershow) {
        this.bpopovershow = false
        this.$refs.selectref[0].handleClose()
      }
    },
    // 辅助期初导入
    fzdr () {
      this.impDialogVisible = true
      this.uploadParam = {
        fzqc: 'Y',
        pk_km: this.currkmqc.pk_km
      }
    },
    // 期初数据下载
    expExcel () {
      let fileName = this.currkmqc.isfzhs.indexOf('1') === 5 ? 'fuzhuqichudaoru02.xls' : 'fuzhuqichudaoru01.xls'
      const excelparam = {
        tempName: fileName,
        pk_km: this.currkmqc.pk_km,
        fzqc: 'Y'
      }
      this.$api.KmQc.expExcel('辅助期初', excelparam)
    },
    // 期初导入
    importExcel (formData) {
      this.$api.KmQc.importExcel(formData).then(res => {
        if (res.success) {
          this.impDialogVisible = false
          this.tabledata = []
          this.$emit('onrefresh')
          this.$message({
            dangerouslyUseHTMLString: true,
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    save () {
      if (this.verifyBeginAccounts[this.currkmqc.kmcode]) {
        this.$message({showClose: true, message: '该科目已录入未核销期初，不允许修改！', type: 'warning'})
        return
      }
      const isfzhs = this.currkmqc.isfzhs
      var rows = this.$refs.table.tableData
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i]
        for (var j = 0; j < isfzhs.length; j++) {
          if (isfzhs[j] === '1' && row['fzhs' + (j + 1)] === undefined) {
            this.$message({showClose: true, message: '第' + (i + 1) + '行未选择辅助核算！', type: 'warning'})
            return
          }
        }
      }
      let formdata = new FormData()
      // 计算科目数据
      this.calcurrkmqc()
      formdata.append('fzdata', JSON.stringify(this.$refs.table.tableData))
      formdata.append('kmdata', JSON.stringify(this.currFirstrowdata))
      formdata.append('pk_km', this.currkmqc.pk_km)
      formdata.append('currency', this.currency.id)
      this.$api.KmQc.fzqcsave(formdata).then((rs) => {
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
      // this.fztabledata = []
      this.visible = false
      this.tabledata = this.copydata(this.fztabledata)
      // this.$emit('onrefresh')
    },
    repformny (obj) {
      let cellValue = obj.cellValue
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    repformnyNum (obj) { // 数量精度
      let cellValue = obj.cellValue
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, this.numPre)
    },
    show (fzlbmap, fzxmmap) {
      this.visible = true
      this.$nextTick(() => {
        this.tabledata = this.copydata(this.fztabledata)
      })
      this.fzlbmap = fzlbmap
      this.fzxmmap = fzxmmap
    },
    // 增行
    addline () {
      let record = {
        kmcode: this.currkmqc.kmcode,
        kmname: this.currkmqc.kmname,
        kmdir: this.currkmqc.kmdir,
        pk_km: this.currkmqc.pk_km,
        jldw: this.currkmqc.jldw ? this.currkmqc.jldw : ''
      }
      for (const t of this.fscolumn) {
        record[t] = undefined
      }
      const row = -1
      this.$refs.table.insertAt(record, row)
        .then(({ row }) => this.$refs.table.setActiveCell(row, 'kmname'))
    },
    // 计算当前科目期初
    calcurrkmqc () {
      const rows = this.$refs.table.tableData
      let total = {}
      for (const str of this.fscolumn) {
        total[str] = 0
      }
      if (rows && rows.length > 0) {
        for (const row of rows) {
          for (const str of this.fscolumn) {
            total[str] = this.accAdd(total[str], row[str])
          }
        }
      }
      for (const str of this.fscolumn) {
        this.currkmqc[str] = total[str]
      }
      this.putChildValue(this.currFirstrowdata)
    },
    putChildValue (data) {
      if (data.qcid === this.currkmqc.qcid) {
        data = this.currkmqc
      } else {
        if (data.children && data.children.length > 0) {
          for (let t of data.children) {
            this.putChildValue(t)
          }
        }
      }
    },
    clearfs () {
      const columns = ['njf', 'ybnjf',
        'bnfsnum', 'ndf', 'ybndf', 'bndffsnum']
      if (this.$refs.table.tableData) {
        for (const tt of this.$refs.table.tableData) {
          for (const str of columns) {
            tt[str] = null
          }
          // 重新计算当前界面的期末值
          tt['monthqc'] = tt['nqc']
          tt['ybmonthqc'] = tt['ybnqc']
          tt['monthqmnum'] = tt['bnqcnum']
        }
      }
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
            if (this.fzlbmap[key].code === 6) {
              row.jldw = tt.unit
              row.spec = tt.spec
            }
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
    handleEdit ({row, rowIndex, $rowIndex, column, columnIndex, $columnIndex}) { // 字段计算
      let columnkey = column.property
      let newvalue = row[columnkey]
      if (columnkey === 'nqc' || columnkey === 'njf' || columnkey === 'ndf') { //
        let ce = this.currkmqc.kmdir === 0 ? this.accSubtr(row.njf, row.ndf) : this.accSubtr(row.ndf, row.njf)
        row.monthqc = this.accAdd(row.nqc, ce)
      } else if (columnkey === 'bnqcnum' || columnkey === 'bnfsnum' || columnkey === 'bndffsnum' || columnkey === 'monthqmnum') {
        let monthqm = 0
        if (this.currkmqc.kmdir === 0) {
          monthqm = this.accSubtr(this.accAdd(row.bnqcnum, row.bnfsnum), row.bndffsnum)
        } else {
          monthqm = this.accSubtr(this.accAdd(row.bnqcnum, row.bndffsnum), row.bnfsnum)
        }
        row.monthqmnum = monthqm
      } else if (columnkey === 'ybnqc' || columnkey === 'ybnjf' || columnkey === 'ybndf' || columnkey === 'ybmonthqc') {
        // 原币计算本币
        const mode = this.currency.convmode
        const exrate = this.currency.exrate
        let res = 0
        if (mode === 0) {
          res = this.accMul(newvalue, exrate)
        } else {
          res = this.accDiv(newvalue, exrate)
        }
        row[columnkey.substring(2)] = res
      }
    },
    handleRowEditClose (obj) {
      const row = obj.row
      this.hidepopover(row)
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
  .import-description {
    text-align: center;
  }
</style>
