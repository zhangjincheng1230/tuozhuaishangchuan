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
    <div>
      <div style="width:100% ; padding: 8px 30px;height: 50px; background-color: #E7EAF4;">
        <el-input
          v-model="searchkeywords" placeholder="科目编码或科目名称,按Enter键检索" clearable
          @keyup.enter.native="filterdata"
          style="width: 250px;height:10px;float: right">
          <template #suffix>
            <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="filterdata"></i>
          </template>
        </el-input>
        <span style="float: right;padding-top: 5px">检索科目：</span>
      </div>
      <vxe-table
        border
        resizable
        size = "small"
        show-overflow
        show-header-overflow
        ref="xTable"
        :height="dialogheight"
        highlight-hover-row
        highlight-current-row
        :row-class-name="rowClassName"
        :data="formData"
        :edit-config="editconfig"
        :optimization = "optimization"
        class="edit-table"
        :sort-config="{trigger: 'cell', defaultSort: {field: 'kmbm', order: 'asc'}}"
        @edit-actived="editActivedEvent"
        @edit-closed="editClosedEvent">
        <vxe-table-column type="checkbox" width="60" align = "center" v-if = "!icinvtentory"></vxe-table-column>
        <vxe-table-column field="kmbm" title="科目编码"  width="165" sortable v-if = "!icinvtentory" header-align = "center" :formatter="formatkmbm" :edit-render="{name: 'select', options: subjectRef ,events: {change: kmafteredit}}"></vxe-table-column>
        <vxe-table-column field="kmmc" title="科目名称"  width="110"  v-if = "!icinvtentory" header-align = "center"></vxe-table-column>
        <vxe-table-column field="qcnum" title="期初数量"  align = "right" v-if = "!icinvtentory" header-align = "center" :formatter = "vxeformatterNum" :edit-render="iseditNum"></vxe-table-column>
        <vxe-table-column field="qcmny" title="期初金额"  align = "right"  v-if = "!icinvtentory" header-align = "center" :formatter = "vxeformatterMny" :edit-render="iseditMny"></vxe-table-column>
        <vxe-table-column field="bqsrnum" title="本期入库数量"  align = "right"  v-if = "!icinvtentory" header-align = "center" :formatter = "vxeformatterNum" :edit-render="iseditNum"></vxe-table-column>
        <vxe-table-column field="bqsrmny" title="本期入库金额"  align = "right"  v-if = "!icinvtentory" header-align = "center" :formatter = "vxeformatterMny" :edit-render="iseditMny"></vxe-table-column>
        <vxe-table-column field="bqprice" title="本期平均单价"  align = "right"  v-if = "!icinvtentory" header-align = "center" :formatter = "vxeformatterPrice" :edit-render="iseditPrice"></vxe-table-column>
        <vxe-table-column field="bqfcnum" title="本期出库数量"  align = "right"  v-if = "!icinvtentory" header-align = "center" :formatter = "vxeformatterNum" :edit-render="iseditNum"></vxe-table-column>

        <vxe-table-column type="index" width="60" title="序号" v-if = "icinvtentory" align = "center" header-align = "center"></vxe-table-column>
        <vxe-table-column field="kmbm" title="科目编码"  width="165" sortable v-if = "icinvtentory" header-align = "center" :formatter="formatkmbm"></vxe-table-column>
        <vxe-table-column field="kmmc" title="科目名称"  width="110"  v-if = "icinvtentory" header-align = "center"></vxe-table-column>
        <vxe-table-column field="qcnum" title="期初数量"  align = "right" v-if = "icinvtentory" header-align = "center" :formatter = "vxeformatterNum"></vxe-table-column>
        <vxe-table-column field="qcmny" title="期初金额"  align = "right"  v-if = "icinvtentory" header-align = "center" :formatter = "vxeformatterMny"></vxe-table-column>
        <vxe-table-column field="bqsrnum" title="本期入库数量"  align = "right"  v-if = "icinvtentory" header-align = "center" :formatter = "vxeformatterNum"></vxe-table-column>
        <vxe-table-column field="bqsrmny" title="本期入库金额"  align = "right"  v-if = "icinvtentory" header-align = "center" :formatter = "vxeformatterMny"></vxe-table-column>
        <vxe-table-column field="bqprice" title="本期平均单价"  align = "right"  v-if = "icinvtentory" header-align = "center" :formatter = "vxeformatterPrice"></vxe-table-column>
        <vxe-table-column field="bqfcnum" title="本期出库数量"  align = "right"  v-if = "icinvtentory" header-align = "center" :formatter = "vxeformatterNum"></vxe-table-column>
      </vxe-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="oncalc" style="float: left">计 算</el-button>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button  v-show="!icinvtentory" @click="onaddline(-1)">增 行</el-button>
        <el-button  v-show="!icinvtentory" @click="ondelline">删 行</el-button>
        <el-button type="primary" @click="oncreatepz">生成凭证</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {VEX_MAXLENGTH} from '@/constants'
import { accAdd, accDiv, nvlNum } from '@/utils'
export default {
  name: 'NoICSMjzdialog',
  props: ['visible', 'icinvtentory', 'isyjjz', 'qmclvo'],
  data () {
    return {
      numprecision: this.$store.getters.numPre,
      priceprecision: this.$store.getters.pricePre,
      formData: [],
      subjectRefdata: [],
      searchkeywords: '',
      loading: false
    }
  },
  computed: {
    // 是否编辑
    editconfig () {
      if (this.icinvtentory) {
        return {}
      } else {
        return {trigger: 'click', mode: 'cell'}
      }
    },
    optimization () {
      return {scrollY: {gt: VEX_MAXLENGTH}}
    },
    // 编辑数量
    iseditNum () {
      return {name: 'ElInputNumber', props: {controls: false, precision: this.numprecision}, events: {change: this.numchange}}
    },
    // 编辑金额
    iseditMny () {
      return {name: 'ElInputNumber', props: {controls: false, precision: 2}, events: {change: this.numchange}}
    },
    iseditPrice () {
      return {name: 'ElInputNumber', props: {controls: false, precision: this.priceprecision}}
    },
    subjectRef () {
      return this.subjectRefdata.map((item) => {
        return {value: item.kmbm, label: item.kmbm + '/' + item.kmmc}
      })
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    title () {
      return '结转期末销售成本'
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
      let height = '300px'
      if (width > 1500) {
        height = '400px'
      }
      return height
    }
  },
  // vxe-table create
  created () {

  },
  methods: {
    // 过滤数据
    filterdata () {
      if (this.searchkeywords !== '' && this.searchkeywords.length > 0) {
        let currrow = this.$refs.xTable.getCurrentRow()
        let selectIndex = -1
        if (currrow) {
          selectIndex = this.$refs.xTable.fullAllDataRowMap.get(currrow).index
        }
        let data = this.$refs.xTable.tableData
        const len = data.length
        if (selectIndex === len - 1) {
          selectIndex = -1
        }
        for (let i = 0; i < len; i++) {
          if (i > selectIndex && this.isContain(data[i])) {
            this.$refs.xTable.setCurrentRow(data[i])
            break
          }
        }
        this.$refs.xTable.scrollToRow(this.$refs.xTable.getCurrentRow())
      }
    },
    isContain (row) {
      if (row.kmbm.indexOf(this.searchkeywords) >= 0 || row.kmmc.indexOf(this.searchkeywords) >= 0) {
        return true
      }
      return false
    },
    editActivedEvent ({row, column}, event) {
      let xTable = this.$refs.xTable
      let priceColumn = xTable.getColumnByField('bqprice')
      if (this.icinvtentory) {
        priceColumn.editRender.attrs.disabled = !this.calPriceEdit(row)
      }
    },
    editClosedEvent ({row, column}, event) {
      // if (column.property === 'qcnum' || column.property === 'qcmny' || column.property === 'bqsrnum' || column.property === 'bqsrmny') {
      //   let xTable = this.$refs.xTable
      //   // 判断单元格值是否被修改
      //   if (xTable.isUpdateByRow(row, column.property)) {
      //     this.calPrice(row)
      //   }
      // }
    },
    rowClassName ({ row, rowIndex }) {
      let className = ''
      if (this.calPriceEdit(row)) {
        className = 'row-red'
      }
      return className
    },
    calPriceEdit (row) {
      if (row) {
        if (nvlNum(row.bqfcnum) < 0 && nvlNum(row.bqprice) === 0) {
          return true
        }
      }
      return false
    },
    numchange (obj, cellvalue) {
      const column = obj.column
      if (column.property === 'qcnum' || column.property === 'qcmny' || column.property === 'bqsrnum' || column.property === 'bqsrmny') {
        const qcnum = this.formData[obj.rowIndex].qcnum
        const qcmny = this.formData[obj.rowIndex].qcmny
        const bqsrnum = this.formData[obj.rowIndex].bqsrnum
        const bqsrmny = this.formData[obj.rowIndex].bqsrmny
        const temp = accDiv(accAdd(qcmny, bqsrmny), accAdd(qcnum, bqsrnum))
        this.formData[obj.rowIndex].bqprice = this.$options.filters.forThousands(temp, this.priceprecision)
      }
    },
    formatkmbm (obj) {
      if (obj) {
        return obj.row.kmbm
      }
      return ''
    },
    onaddline (index) {
      let kmbm = this.subjectRefdata[0].kmbm
      let kmmc = this.subjectRefdata[0].kmmc
      let kmid = this.subjectRefdata[0].kmid
      let fzid = this.subjectRefdata[0].fzid
      this.$refs.xTable.insertAt({ kmbm: kmbm, kmmc: kmmc, kmid: kmid, fzid: fzid }, index).then(({ index }) => this.$refs.xTable.setActiveCell(index, 'kmbm'))
    },
    ondelline () {
      if (this.$refs.xTable.getSelectRecords() && this.$refs.xTable.getSelectRecords().length > 0) {
        this.$refs.xTable.removeSelecteds()
      } else {
        this.$message({message: '请选择一行进行操作', type: 'error'})
      }
    },
    kmafteredit ({ row }, evnt) {
      let value = evnt.target.value
      if (value) {
        row.kmbm = this.subjectRefdata[evnt.target.selectedIndex].kmbm
        row.kmmc = this.subjectRefdata[evnt.target.selectedIndex].kmmc
        row.kmid = this.subjectRefdata[evnt.target.selectedIndex].kmid
        row.fzid = this.subjectRefdata[evnt.target.selectedIndex].fzid
      }
    },
    oncalc () {
      this.loading = true
      const kmbms = []
      this.$refs.xTable.clearCurrentRow()
      if (this.$refs.xTable.tableData.length > 0) {
        this.$refs.xTable.tableData.map((item) => {
          kmbms.push(item.kmbm)
        })
      }
      const paramters = {begindate: this.qmclvo.qj + '-01', enddate: this.qmclvo.qj + '-01', pk_gs: this.qmclvo.pk_gs, kmbms: JSON.stringify(kmbms), jztype: ''}
      this.$api.qmcl.jisuan(paramters).then(result => {
        this.loading = false
        if (result.success && result.rows) {
          this.formData = result.rows
        } else {
          this.formData = []
        }
      }).catch(e => {
        this.loading = false
      })
    },
    oncreatepz () {
      if (this.$refs.xTable.tableData && this.$refs.xTable.tableData.length === 0) {
        this.$confirm('结转数据为空，是否空结？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.createpz()
        })
      } else {
        this.createpz()
      }
    },
    createpz () {
      if (this.isyjjz !== undefined && this.isyjjz === true) {
        const paramters = {
          exrates: [],
          qmclvos: [this.qmclvo],
          zgdata: [],
          qmjznoiclist: this.formData,
          currentproject: 2,
          list1: [],
          list2: [],
          list3: [],
          list4: [],
          list5: []
        }

        if (this.checkJz(this.formData)) {
          this.showError('存在红色字体行未取到成本单价，请手工录入“本期平均单价”再生成!')
          return
        }
        this.loading = true
        this.$api.yjjz.onYjjz(paramters).then(data => {
          this.loading = false
          data.rows.noicjzvos = this.formData
          this.$emit('updateqmclinfo', data.rows)
          this.closeDialog()
        }).catch(e => {
          this.loading = false
        })
      } else {
        const noicjzvos = JSON.stringify(this.$refs.xTable.tableData)
        if (this.checkJz(this.$refs.xTable.tableData)) {
          this.showError('存在红色字体行未取到成本单价，请手工录入“本期平均单价”再生成!')
          return
        }
        this.loading = true
        const paramers = {
          qmvo: this.qmclvo,
          noicjzvos: noicjzvos,
          zgdata: [],
          cbjzCount: '',
          jztype: ''
        }
        this.$api.qmcl.saveToPz(paramers).then(result => {
          this.loading = false
          if (result.success === true) {
            this.closeDialog()
            result.noicjzvos = noicjzvos
            this.$emit('updateqmclinfo', result)
          } else {
            this.showError(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      }
    },
    checkJz (noicjzvos) {
      for (const data of noicjzvos) {
        if (this.calPriceEdit(data)) {
          return true
        }
      }
      return false
    },
    onDialogOpen () {
      this.formData = []
      this.searchkeywords = ''
      if (!this.icinvtentory) {
        const paramters = {pk_gs: this.qmclvo.pk_gs, jztype: ''}
        this.$api.qmcl.queryCBJZKM(paramters).then(result => {
          if (result.success === true) {
            this.subjectRefdata = result.rows
          } else {
            this.subjectRefdata = []
          }
        }).catch(e => {
          this.subjectRefdata = []
        })
      }
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
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
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
  >>>.vxe-table .vxe-body--row.row-red {
    color: #f41705;
  }

</style>
