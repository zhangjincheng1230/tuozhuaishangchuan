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
          v-model="searchkeywords" placeholder="科目编码或科目名称定位"
          @change="filterdata"
          style="width: 200px;height:10px;float: right">
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
        :data="formData"
        highlight-hover-row
        highlight-current-row
        :edit-config="{trigger: 'click', mode: 'cell'}"
        :sort-config="{trigger: 'cell', defaultSort: {field: 'kmbm', order: 'asc'}}"
        :optimization = "optimization"
        class="edit-table"
        @edit-actived="editActivedEvent"
        @edit-closed="editClosedEvent">
        <vxe-table-column type="checkbox" width="60" align = "center"></vxe-table-column>
        <vxe-table-column field="kmbm" title="科目编码" width="165" header-align = "center" sortable :formatter="formatkmbm" :edit-render="{name: 'select', options: subjectRef ,events: {change: kmafteredit}}"></vxe-table-column>
        <vxe-table-column field="kmmc" title="科目名称" width="110" header-align = "center"></vxe-table-column>
        <vxe-table-column field="qcnum" title="期初数量" align = "right" header-align = "center" :formatter = "vxeformatterNum" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numprecision}}"></vxe-table-column>
        <vxe-table-column field="qcmny" title="期初金额"  align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
        <vxe-table-column field="bqsrnum" title="本期入库数量"  align = "right" header-align = "center" :formatter = "vxeformatterNum"  :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numprecision}}"></vxe-table-column>
        <vxe-table-column field="bqsrmny" title="本期入库金额"  align = "right" header-align = "center" :formatter = "vxeformatterMny"  :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
        <vxe-table-column field="bqprice" title="本期平均单价"  align = "right" header-align = "center" :formatter = "vxeformatterPrice" ></vxe-table-column>
        <vxe-table-column field="bqfcnum" title="本期出库数量"  align = "right" header-align = "center" :formatter = "vxeformatterNum"  :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numprecision}}"></vxe-table-column>
      </vxe-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="oncalc" style="float: left">计 算</el-button>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button  @click="onaddline(-1)">增 行</el-button>
        <el-button  @click="ondelline">删 行</el-button>
        <el-button type="primary" @click="oncreatepz">生成凭证</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {VEX_MAXLENGTH} from '@/constants'
export default {
  name: 'NoICIndustryDialog',
  props: ['visible', 'jztype', 'qmclvo'], // (jztype -- 1 代表材料) (jztype -- 3 代表销售)
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
      if (this.jztype === 1) {
        return '结转期末材料成本'
      } else if (this.jztype === 3) {
        return '结转期末销售成本'
      } else {
        return '结转成本'
      }
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
    },
    optimization () {
      return {scrollY: {gt: VEX_MAXLENGTH}}
    }
  },
  // vxe-table create
  created () {

  },
  methods: {
    // 过滤数据
    filterdata () {
      if (this.searchkeywords !== '' && this.searchkeywords.length > 0) {
        let data = this.$refs.xTable.tableData
        for (let i = 0; i < data.length; i++) {
          if (data[i].kmbm.indexOf(this.searchkeywords) >= 0 || data[i].kmmc.indexOf(this.searchkeywords) >= 0) {
            this.$refs.xTable.setCurrentRow(data[i])
            break
          }
        }
      }
    },
    editActivedEvent ({row, column}, event) {
    },
    editClosedEvent ({row, column}, event) {
    },
    activeRowMethod ({ row, rowIndex }) {
      return rowIndex !== 1
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
      const kmbms = []
      if (this.$refs.xTable.tableData.length > 0) {
        this.$refs.xTable.tableData.map((item) => {
          kmbms.push(item.kmbm)
        })
      }
      this.loading = true
      const paramters = {begindate: this.qmclvo.qj + '-01', enddate: this.qmclvo.qj + '-01', pk_gs: this.qmclvo.pk_gs, kmbms: JSON.stringify(kmbms), jztype: this.jztype}
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
      this.loading = true
      const noicjzvos = JSON.stringify(this.$refs.xTable.tableData)
      let cbjzCount = ''
      if (this.jztype === 1) { //  材料
        cbjzCount = 1
      } else if (this.jztype === 3) { //  销售
        cbjzCount = 6
      }
      const paramers = {
        qmvo: this.qmclvo,
        noicjzvos: noicjzvos,
        zgdata: [],
        cbjzCount: cbjzCount,
        jztype: this.jztype
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
    },
    onDialogOpen () {
      this.formData = []
      this.searchkeywords = ''
      const paramters = { pk_gs: this.qmclvo.pk_gs, jztype: this.jztype }
      this.$api.qmcl.queryCBJZKM(paramters).then(result => {
        if (result.success === true) {
          this.subjectRefdata = result.rows
        } else {
          this.subjectRefdata = []
        }
      }).catch(e => {
        this.subjectRefdata = []
      })
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
</style>
