<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             @open="onDialogOpen"
             @close="onDialogClose"
             @closed="onDialogClosed"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :width="screenwidth"
             v-loading="loading"
             element-loading-text="请稍候..."
             element-loading-background="rgba(0, 0, 0, 0)"
             element-loading-spinner="el-icon-loading">
    <div slot="title" class="el-dialog__title">
      <span>{{ title }}</span>
      <el-tooltip content='暂估单价仅供参考，用户可根据实际情况单击“暂估单价”列进行修改'  effect="light" placement="right">
        <i class="el-icon-warning-outline"></i>
      </el-tooltip>
    </div>
    <div>
      <vxe-table
        border
        resizable
        size = "small"
        show-overflow
        show-header-overflow
        ref="xTable"
        :height="dialogheight"
        :data="formData"
        highlight-hover-row
        highlight-current-row
        :edit-config="{trigger: 'click', mode: 'cell'}"
        :optimization = "optimization"
        class="edit-table"
        @edit-actived="editActivedEvent"
        @edit-closed="editClosedEvent">
        <vxe-table-column type="index" width="60" title="序号" align = "center" header-align = "center"></vxe-table-column>
        <vxe-table-column field="kmbm" title="科目编码" width="100" header-align = "center"></vxe-table-column>
        <vxe-table-column field="kmname" title="科目名称" width="150" header-align = "center"></vxe-table-column>
        <vxe-table-column field="oldnum" title="数量差额" align = "right" header-align = "center" :formatter = "vxeformatterNum"></vxe-table-column>
        <vxe-table-column field="newnum" title="暂估数量" align = "right" header-align = "center" :formatter = "vxeformatterNum" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numprecision},events: {change: numchange}}"></vxe-table-column>
        <vxe-table-column field="price" title="暂估单价" align = "right" header-align = "center" :formatter = "vxeformatterPrice" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: priceprecision},events: {change: pricechange}}"></vxe-table-column>
        <vxe-table-column field="mny" title="暂估金额" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: mnychange}}"></vxe-table-column>
      </vxe-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveZanGu">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {VEX_MAXLENGTH} from '@/constants'
import { accDiv, accMul, nvlNum } from '@/utils'
export default {
  name: 'ZanGuDialog',
  props: ['visible', 'isyjjz', 'zgdata', 'qmclvo', 'zgurl', 'noicjzvos', 'cbjzCount', 'jztype'],
  data () {
    return {
      numprecision: this.$store.getters.numPre,
      priceprecision: this.$store.getters.pricePre,
      formData: [],
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    title () {
      return '暂估信息'
    },
    screenwidth () {
      let width = document.body.clientWidth
      let percent = '80%'
      if (width > 1500) {
        percent = '70%'
      }
      return percent
    },
    dialogheight () {
      let width = document.body.clientWidth
      let height = '350px'
      if (width > 1500) {
        height = '450px'
      }
      return height
    },
    optimization () {
      return {scrollY: {gt: VEX_MAXLENGTH}}
    }
  },
  methods: {
    editActivedEvent ({ row, column }, event) {
    },
    editClosedEvent ({ row, column }, event) {
    },
    saveZanGu () {
      // const errorzgdata = this.formData.filter((item) => {
      //   if (Number(item.newnum) < Number(item.oldnum)) {
      //     return item
      //   }
      // })
      // if (errorzgdata && errorzgdata.length > 0) {
      //   this.showError('暂估数量必须大于数量差额')
      //   return
      // }
      let validate = true
      const len = this.formData.length
      for (let i = 0; i < len; i++) {
        if (nvlNum(this.formData[i].mny) === 0) {
          validate = false
          this.showWarn('第' + (i + 1) + '行数据，暂估金额为0!')
          break
        }
        debugger
        if (nvlNum(this.formData[i].newnum) === 0) {
          validate = false
          this.showWarn('第' + (i + 1) + '行数据，暂估数量为0!')
          break
        }
      }
      if (!validate) {
        return
      }
      // const errorzgdata = this.formData.filter((item) => {
      //   if (Number(item.newnum) <= 0) {
      //     return item
      //   }
      // })
      // if (errorzgdata && errorzgdata.length > 0) {
      //   this.showError('暂估数量必须大于0')
      //   return
      // }
      if (this.zgurl === 1) { // 启用库存
        this.loading = true
        const paramers = {
          qmvo: this.qmclvo,
          zgdata: JSON.stringify(this.$refs.xTable.tableData)
        }
        this.$api.qmcl.onsinglecbjz(paramers).then(result => {
          this.loading = false
          if (result.success === true) {
            this.closeDialog()
            this.$emit('updateqmclinfo', result)
          } else {
            this.showError(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else if (this.zgurl === 2) { // 不启用库存
        this.loading = true
        const paramers = {
          qmvo: this.qmclvo,
          noicjzvos: this.noicjzvos,
          zgdata: JSON.stringify(this.$refs.xTable.tableData),
          cbjzCount: this.cbjzCount === undefined ? '' : this.cbjzCount,
          jztype: this.jztype === undefined ? '' : this.jztype
        }
        this.$api.qmcl.saveToPz(paramers).then(result => {
          this.loading = false
          if (result.success === true) {
            this.closeDialog()
            this.$emit('updateqmclinfo', result)
          } else {
            this.showError(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else if (this.isyjjz !== undefined && this.isyjjz === true && this.zgurl === 3) { // 一键结转
        let noicjzvos = []
        if (this.noicjzvos !== undefined && this.noicjzvos.length > 0) {
          noicjzvos = this.noicjzvos
        }
        const paramters = {
          exrates: [],
          qmclvos: [this.qmclvo],
          zgdata: this.zgdata,
          qmjznoiclist: noicjzvos,
          currentproject: 2,
          list1: [],
          list2: [],
          list3: [],
          list4: [],
          list5: []
        }
        this.loading = true
        this.$api.yjjz.onYjjz(paramters).then(data => {
          this.loading = false
          this.closeDialog()
          this.$emit('updateqmclinfo', data.rows)
        }).catch(e => {
          this.loading = false
        })
      }
    },
    onDialogOpen () {
      this.formData = this.formData.concat(this.zgdata)
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.formData = []
      this.dialogVisible = false
    },
    closeDialog () {
      this.formData = []
      this.dialogVisible = false
    },
    numchange (obj, cellvalue) {
      let price = this.formData[obj.rowIndex].price
      this.formData[obj.rowIndex].mny = accMul(cellvalue, price)
    },
    pricechange (obj, cellvalue) {
      let newnum = this.formData[obj.rowIndex].newnum
      this.formData[obj.rowIndex].mny = accMul(cellvalue, newnum)
    },
    mnychange (obj, cellvalue) {
      let newnum = this.formData[obj.rowIndex].newnum
      this.formData[obj.rowIndex].price = accDiv(cellvalue, newnum)
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
    },
    showWarn (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'warning'})
    },
    vxeformatterNum (obj) {
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue, this.numprecision)
      }
      return ''
    },
    vxeformatterPrice (obj) {
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue, this.priceprecision)
      }
      return ''
    },
    vxeformatterMny (obj) {
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue)
      }
      return ''
    }
  }
}
</script>

<style scoped>
  >>> .vxe-cell{
    padding: 0;
  }
  >>> .el-dialog__body {
    padding: 15px 20px 15px 20px;
  }
</style>
