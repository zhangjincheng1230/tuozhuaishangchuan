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
      <div>
        <div style="width:100% ; padding: 8px 30px;height: 50px; background-color: #E7EAF4;">
          <span>
            <label>期初、本月发生分摊方式：</label>
            <el-radio-group v-model="fentanfangshi">
              <el-radio :label="2">比例</el-radio>
              <el-radio :label="3">金额</el-radio>
            </el-radio-group>
            <span style="padding-left: 50px">
              <label>设置完工比例数：</label>
              <el-input-number
                size="mini" v-model="bili"
                :controls="false" :precision="2" :max="100" :min="0" @change="changewgbl" class="percentMark">
              </el-input-number>
              <label>（注：所有比例数输入为0%到100%）</label>
            </span>
            <el-button size="mini" type="primary" @click="ondeline" style="float: right">删行</el-button>
            <span style="padding-right: 10px;float: right"><el-button size="mini" type="primary" @click="onaddline(-1)" style="float: right">增行</el-button></span>
          </span>
        </div>

        <vxe-table
          border
          resizable
          size = "mini"
          show-overflow
          show-header-overflow
          ref="xTable3"
          :edit-config="{trigger: 'click', mode: 'cell', activeMethod: activeRowMethod}"
          :optimization = "optimization"
          :height="specialheight"
          highlight-hover-row
          highlight-current-row
          class="edit-table"
          :data="formData3">
          <vxe-table-column type="checkbox" width="40" align = "center"></vxe-table-column>
          <vxe-table-column field="kmbm" title="科目编码" width="90px" header-align = "center" :formatter="formatspbm" :edit-render="{name: 'select', options: subjectRef ,events: {change: spafteredit}}"></vxe-table-column>
          <vxe-table-column field="kmmc" title="科目名称" header-align = "center"></vxe-table-column>
          <vxe-table-column field="wgbl" title="完工比例" align = "right" header-align = "center" :formatter = "vxeformatterPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
          <vxe-table-column title="期初" header-align = "center">
            <vxe-table-column field="ncailiao_qc" title="材料" align = "right" header-align = "center" :formatter = "vxeformatterMnyorPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: cailiaoqcedit}}"></vxe-table-column>
            <vxe-table-column field="nrengong_qc" title="人工" align = "right" header-align = "center" :formatter = "vxeformatterMnyorPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: rengongeqcdit}}"></vxe-table-column>
            <vxe-table-column field="nzhizao_qc" title="制造费用" align = "right" header-align = "center" :formatter = "vxeformatterMnyorPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: zhizaoqcedit}}"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="本月发生" header-align = "center">
            <vxe-table-column field="ncailiao_fs" title="材料" align = "right" header-align = "center" :formatter = "vxeformatterMnyorPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: cailiaofsedit}}"></vxe-table-column>
            <vxe-table-column field="nrengong_fs" title="人工" align = "right" header-align = "center" :formatter = "vxeformatterMnyorPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: rengongfsedit}}"></vxe-table-column>
            <vxe-table-column field="nzhizao_fs" title="制造费用" align = "right" header-align = "center" :formatter = "vxeformatterMnyorPercent" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2},events: {change: zhizaofsedit}}"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="本月完工" header-align = "center">
            <vxe-table-column field="ncailiao_wg" title="材料" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column field="nrengong_wg" title="人工" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column field="nzhizao_wg" title="制造费用" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column field="nnum_wg" title="数量" align = "right" header-align = "center" :formatter = "vxeformatterNum" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: numprecision}}"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="本月未完工" header-align = "center">
            <vxe-table-column field="ncailiao_nwg" title="材料" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column field="nrengong_nwg" title="人工" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column field="nzhizao_nwg" title="制造费用" align = "right" header-align = "center" :formatter = "vxeformatterMny" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onCalc" style="float: left">计 算</el-button>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"  @click="onFinish">完 工</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { accDiv, accMul, accAdd, accSubtr } from '@/utils'
import {VEX_MAXLENGTH} from '@/constants'
export default {
  name: 'CostAllocateDialog',
  props: ['visible', 'qmclvo', 'jztype'],
  data () {
    return {
      numprecision: this.$store.getters.numPre,
      formData3: [],
      fentanfangshi: 2,
      bili: 0,
      inventoryRefdata: [],
      title: '工业结转',
      cbjzCount: 5,
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
    subjectRef () {
      return this.inventoryRefdata.map((item) => {
        return {value: item.kmbm, label: item.kmbm + '/' + item.kmmc}
      })
    },
    screenwidth () {
      let width = document.body.clientWidth
      let percent = '90%'
      if (width > 1500) {
        percent = '80%'
      }
      return percent
    },
    specialheight () {
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
  methods: {
    // 计算
    onCalc () {
      this.loading = true
      const paramers = {
        qmvo: this.qmclvo,
        qmwgcpvo: JSON.stringify(this.$refs.xTable3.tableData),
        fsbl: this.fentanfangshi,
        bili: this.bili
      }
      this.$api.qmcl.onIndustryCalc(paramers).then(result => {
        this.loading = false
        if (result.success === true) {
          this.formData3 = result.rows
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 完工
    async onFinish () {
      this.formData3 = this.$refs.xTable3.tableData
      const map = new Map()
      const repeatdata = []
      this.formData3.filter((item) => {
        if (item.kmid != null && item.kmid.length > 0) {
          return item
        }
      }).map((item) => {
        if (map.has(item.kmid + '/' + item.fzid)) {
          repeatdata.push(item.kmmc)
        } else {
          map.set(item.kmid + '/' + item.fzid, item)
        }
      })
      let error
      let iscancel = false
      if (repeatdata != null && repeatdata.length > 0) {
        await this.$confirm('存货' + repeatdata.toString() + '重复，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          error = this.onFentanCheck1()
        }).catch(() => { // 取消操作
          iscancel = true
        })
      } else {
        error = this.onFentanCheck1()
      }
      if (iscancel) {
        return
      }
      if (error !== undefined && error.length > 0) {
        this.showError(error)
        return
      }
      this.loading = true
      const paramers = {qmvo: this.qmclvo, cbjzPara3: JSON.stringify(this.formData3), cbjzCount: this.cbjzCount, jztype: this.jztype}
      this.$api.qmcl.savePzWangong(paramers).then(result => {
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
    },
    onDialogOpen () {
      this.formData3 = []
      this.fentanfangshi = 2
      this.bili = 0
      this.inventoryRefdata = []
      // 加载商品信息
      const paramters = { pk_gs: this.qmclvo.pk_gs, jztype: this.jztype }
      this.$api.qmcl.queryCBJZKMwg(paramters).then(result => {
        if (result.success === true) {
          this.inventoryRefdata = result.rows
        } else {
          this.inventoryRefdata = []
        }
      }).catch(e => {
      })
      // 加载formData3 数据
      const paramers = {qmvo: this.qmclvo, jztype: this.jztype, isgy: 'Y'}
      this.$api.qmcl.queryWangong(paramers).then(result => {
        if (result.success === true) {
          this.formData3 = result.rows
        } else {
          this.formData3 = []
        }
      }).catch(e => {
      })
    },
    formatspbm (obj) {
      if (obj) {
        return obj.row.kmbm
      }
      return ''
    },
    activeRowMethod ({ row, rowIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return false
      }
      return true
    },
    onaddline (index) {
      let kmid = this.inventoryRefdata[0].kmid
      let kmbm = this.inventoryRefdata[0].kmbm
      let kmmc = this.inventoryRefdata[0].kmmc
      let fzid = this.inventoryRefdata[0].fzid
      this.$refs.xTable3.insertAt({kmid: kmid, kmbm: kmbm, kmmc: kmmc, fzid: fzid}, index).then(({ index }) => this.$refs.xTable3.setActiveCell(index, 'kmbm'))
      this.formData3 = this.$refs.xTable3.tableData
    },
    ondeline () {
      const data = this.$refs.xTable3.getSelectRecords()
      if (data && data.length > 0) {
        let abc = data.filter(item => item.kmbm !== '账面金额' && item.kmbm !== '待分配金额')
        this.$refs.xTable3.remove(abc)
        this.formData3 = this.$refs.xTable3.tableData
        this.oncalcrowFenpeiMny()
      } else {
        this.$message({message: '请选择一行进行操作', type: 'error'})
      }
    },
    spafteredit ({ row }, evnt) {
      let value = evnt.target.value
      if (value) {
        row.kmid = this.inventoryRefdata[evnt.target.selectedIndex].kmid
        row.kmbm = this.inventoryRefdata[evnt.target.selectedIndex].kmbm
        row.kmmc = this.inventoryRefdata[evnt.target.selectedIndex].kmmc
        row.fzid = this.inventoryRefdata[evnt.target.selectedIndex].fzid
      }
    },
    onDialogClose () {
      this.closeDialog()
    },
    changewgbl (currentValue) {
      if (this.formData3) {
        this.formData3.map((item, index) => {
          if (index > 1) {
            item.wgbl = currentValue
          }
        })
      }
    },
    // 计算待分配金额
    oncalcrowFenpeiMny () {
      let result1 = 0
      let result2 = 0
      let result3 = 0
      let result4 = 0
      let result5 = 0
      let result6 = 0
      this.formData3.map((item, index) => {
        if (index > 1) {
          result1 = accAdd(item.ncailiao_qc, result1)
          result2 = accAdd(item.nrengong_qc, result2)
          result3 = accAdd(item.nzhizao_qc, result3)
          result4 = accAdd(item.ncailiao_fs, result4)
          result5 = accAdd(item.nrengong_fs, result5)
          result6 = accAdd(item.nzhizao_fs, result6)
        }
      })
      if (this.fentanfangshi === 2) { // 单价 // 比例金额
        this.formData3[1].ncailiao_qc = accSubtr(this.formData3[0].ncailiao_qc, accDiv(accMul(this.formData3[0].ncailiao_qc, result1), 100))
        this.formData3[1].nrengong_qc = accSubtr(this.formData3[0].nrengong_qc, accDiv(accMul(this.formData3[0].nrengong_qc, result2), 100))
        this.formData3[1].nzhizao_qc = accSubtr(this.formData3[0].nzhizao_qc, accDiv(accMul(this.formData3[0].nzhizao_qc, result3), 100))
        this.formData3[1].ncailiao_fs = accSubtr(this.formData3[0].ncailiao_fs, accDiv(accMul(this.formData3[0].ncailiao_fs, result4), 100))
        this.formData3[1].nrengong_fs = accSubtr(this.formData3[0].nrengong_fs, accDiv(accMul(this.formData3[0].nrengong_fs, result5), 100))
        this.formData3[1].nzhizao_fs = accSubtr(this.formData3[0].nzhizao_fs, accDiv(accMul(this.formData3[0].nzhizao_fs, result6), 100))
      } else if (this.fentanfangshi === 3) { // 金额
        this.formData3[1].ncailiao_qc = accSubtr(this.formData3[0].ncailiao_qc, result1)
        this.formData3[1].nrengong_qc = accSubtr(this.formData3[0].nrengong_qc, result2)
        this.formData3[1].nzhizao_qc = accSubtr(this.formData3[0].nzhizao_qc, result3)
        this.formData3[1].ncailiao_fs = accSubtr(this.formData3[0].ncailiao_fs, result4)
        this.formData3[1].nrengong_fs = accSubtr(this.formData3[0].nrengong_fs, result5)
        this.formData3[1].nzhizao_fs = accSubtr(this.formData3[0].nzhizao_fs, result6)
      }
    },
    // 材料
    cailiaoqcedit (obj, cellvalue) {
      if (this.formData3) {
        let result = 0
        this.formData3.map((item, index) => {
          if (index > 1 && index !== obj.rowIndex) {
            result = accAdd(item.ncailiao_qc, result)
          }
        })
        result = accAdd(result, cellvalue)
        if (this.fentanfangshi === 2) { // 单价 // 比例金额
          this.formData3[1].ncailiao_qc = accSubtr(this.formData3[0].ncailiao_qc, accDiv(accMul(this.formData3[0].ncailiao_qc, result), 100))
        } else if (this.fentanfangshi === 3) { // 金额
          this.formData3[1].ncailiao_qc = accSubtr(this.formData3[0].ncailiao_qc, result)
        }
      }
    },
    rengongeqcdit (obj, cellvalue) {
      if (this.formData3) {
        let result = 0
        this.formData3.map((item, index) => {
          if (index > 1 && index !== obj.rowIndex) {
            result = accAdd(item.nrengong_qc, result)
          }
        })
        result = accAdd(result, cellvalue)
        if (this.fentanfangshi === 2) { // 单价 // 比例金额
          this.formData3[1].nrengong_qc = accSubtr(this.formData3[0].nrengong_qc, accDiv(accMul(this.formData3[0].nrengong_qc, result), 100))
        } else if (this.fentanfangshi === 3) { // 金额
          this.formData3[1].nrengong_qc = accSubtr(this.formData3[0].nrengong_qc, result)
        }
      }
    },
    zhizaoqcedit (obj, cellvalue) {
      if (this.formData3) {
        let result = 0
        this.formData3.map((item, index) => {
          if (index > 1 && index !== obj.rowIndex) {
            result = accAdd(item.nzhizao_qc, result)
          }
        })
        result = accAdd(result, cellvalue)
        if (this.fentanfangshi === 2) { // 单价 // 比例金额
          this.formData3[1].nzhizao_qc = accSubtr(this.formData3[0].nzhizao_qc, accDiv(accMul(this.formData3[0].nzhizao_qc, result), 100))
        } else if (this.fentanfangshi === 3) { // 金额
          this.formData3[1].nzhizao_qc = accSubtr(this.formData3[0].nzhizao_qc, result)
        }
      }
    },
    cailiaofsedit (obj, cellvalue) {
      if (this.formData3) {
        let result = 0
        this.formData3.map((item, index) => {
          if (index > 1 && index !== obj.rowIndex) {
            result = accAdd(item.ncailiao_fs, result)
          }
        })
        result = accAdd(result, cellvalue)
        if (this.fentanfangshi === 2) { // 单价 // 比例金额
          this.formData3[1].ncailiao_fs = accSubtr(this.formData3[0].ncailiao_fs, accDiv(accMul(this.formData3[0].ncailiao_fs, result), 100))
        } else if (this.fentanfangshi === 3) { // 金额
          this.formData3[1].ncailiao_fs = accSubtr(this.formData3[0].ncailiao_fs, result)
        }
      }
    },
    rengongfsedit (obj, cellvalue) {
      if (this.formData3) {
        let result = 0
        this.formData3.map((item, index) => {
          if (index > 1 && index !== obj.rowIndex) {
            result = accAdd(item.nrengong_fs, result)
          }
        })
        result = accAdd(result, cellvalue)
        if (this.fentanfangshi === 2) { // 单价 // 比例金额
          this.formData3[1].nrengong_fs = accSubtr(this.formData3[0].nrengong_fs, accDiv(accMul(this.formData3[0].nrengong_fs, result), 100))
        } else if (this.fentanfangshi === 3) { // 金额
          this.formData3[1].nrengong_fs = accSubtr(this.formData3[0].nrengong_fs, result)
        }
      }
    },
    zhizaofsedit (obj, cellvalue) {
      if (this.formData3) {
        let result = 0
        this.formData3.map((item, index) => {
          if (index > 1 && index !== obj.rowIndex) {
            result = accAdd(item.nzhizao_fs, result)
          }
        })
        result = accAdd(result, cellvalue)
        if (this.fentanfangshi === 2) { // 单价 // 比例金额
          this.formData3[1].nzhizao_fs = accSubtr(this.formData3[0].nzhizao_fs, accDiv(accMul(this.formData3[0].nzhizao_fs, result), 100))
        } else if (this.fentanfangshi === 3) { // 金额
          this.formData3[1].nzhizao_fs = accSubtr(this.formData3[0].nzhizao_fs, result)
        }
      }
    },
    // 成本分摊校验
    onFentanCheck1 () {
      let error
      if (this.formData3 !== null && this.formData3.length > 0) {
        this.formData3.map((item, index) => {
          if (index > 1 && (item.kmid === undefined || item.kmid === null || item.kmid.length === 0)) {
            error = '第' + (index + 1) + '行请指定存货'
          }
        })
        if (error !== undefined && error.length > 0) {
          return error
        }
        error = this.onFentanCheck2(this.fentanfangshi, this.bili, this.formData3)
      }
      return error
    },
    // 下一步校验
    onFentanCheck2 (fsbl, bili, row) {
      let errorinfo = ''
      let f_cailiao_qc = 0
      let z_f_cailiao_qc = 0
      let cailiao = 0
      let f_rengong_qc = 0
      let z_f_rengong_qc = 0
      let rengong = 0
      let f_zzfy_qc = 0
      let z_f_zzfy_qc = 0
      let zzfy = 0
      let f_cailiao_bl = 0
      let f_rengong_bl = 0
      let f_zzfy_bl = 0
      let z_f_cailiao = 0
      let z_f_rengong = 0
      let z_f_zzfy = 0
      let f_f_cailiao = 0
      let f_f_rengong = 0
      let f_f_zzfy = 0
      //
      let ncailiao_wg = 0
      let nrengong_wg = 0
      let nzhizao_wg = 0
      let ncailiao_nwg = 0
      let nrengong_nwg = 0
      let nzhizao_nwg = 0
      //
      let sncailiao_wg = 0
      let snrengong_wg = 0
      let snzhizao_wg = 0
      let sncailiao_nwg = 0
      let snrengong_nwg = 0
      let snzhizao_nwg = 0

      row.map((item, index) => {
        if (index === 0) {
          if (item.ncailiao_fs) { z_f_cailiao = Number(item.ncailiao_fs) }
          if (item.nrengong_fs) { z_f_rengong = Number(item.nrengong_fs) }
          if (item.nzhizao_fs) { z_f_zzfy = Number(item.nzhizao_fs) }
          //
          if (item.ncailiao_qc) {
            z_f_cailiao_qc = Number(item.ncailiao_qc)
          }
          if (item.nrengong_qc) {
            z_f_rengong_qc = Number(item.nrengong_qc)
          }
          if (item.nzhizao_qc) {
            z_f_zzfy_qc = Number(item.nzhizao_qc)
          }
          //
          if (item.ncailiao_wg) {
            ncailiao_wg = Number(item.ncailiao_wg)
          }
          if (item.nrengong_wg) {
            nrengong_wg = Number(item.nrengong_wg)
          }
          if (item.nzhizao_wg) {
            nzhizao_wg = Number(item.nzhizao_wg)
          }
          if (item.ncailiao_nwg) {
            ncailiao_nwg = Number(item.ncailiao_nwg)
          }
          if (item.nrengong_nwg) {
            nrengong_nwg = Number(item.nrengong_nwg)
          }
          if (item.nzhizao_nwg) {
            nzhizao_nwg = Number(item.nzhizao_nwg)
          }
        } else if (index === 1) {

        } else {
          if (item.ncailiao_fs) {
            // f_cailiao_bl += Number(item.ncailiao_fs)
            // f_f_cailiao += Number(item.ncailiao_fs)
            // console.info(item.ncailiao_fs)
            f_cailiao_bl = accAdd(f_cailiao_bl, item.ncailiao_fs)
            // console.info(f_cailiao_bl)
            f_f_cailiao = accAdd(f_f_cailiao, item.ncailiao_fs)
          }
          if (item.nrengong_fs) {
            // f_rengong_bl += Number(item.nrengong_fs)
            // f_f_rengong += Number(item.nrengong_fs)
            f_rengong_bl = accAdd(f_rengong_bl, item.nrengong_fs)
            f_f_rengong = accAdd(f_f_rengong, item.nrengong_fs)
          }
          if (item.nzhizao_fs) {
            // f_zzfy_bl += Number(item.nzhizao_fs)
            // f_f_zzfy += Number(item.nzhizao_fs)
            f_zzfy_bl = accAdd(f_zzfy_bl, item.nzhizao_fs)
            f_f_zzfy = accAdd(f_f_zzfy, item.nzhizao_fs)
          }
          //
          if (item.ncailiao_qc) {
            // f_cailiao_qc += Number(item.ncailiao_qc)
            // cailiao += Number(item.ncailiao_qc)
            f_cailiao_qc = accAdd(f_cailiao_qc, item.ncailiao_qc)
            cailiao = accAdd(cailiao, item.ncailiao_qc)
          }
          if (item.nrengong_qc) {
            // f_rengong_qc += Number(item.nrengong_qc)
            // rengong += Number(item.nrengong_qc)
            f_rengong_qc = accAdd(f_rengong_qc, item.nrengong_qc)
            rengong = accAdd(rengong, item.nrengong_qc)
          }
          if (item.nzhizao_qc) {
            // f_zzfy_qc  += Number(item.nzhizao_qc)
            // zzfy += Number(item.nzhizao_qc)
            f_zzfy_qc = accAdd(f_zzfy_qc, item.nzhizao_qc)
            zzfy = accAdd(zzfy, item.nzhizao_qc)
          }
          //
          if (item.ncailiao_wg) {
            // sncailiao_wg  += Number(item.ncailiao_wg)
            sncailiao_wg = accAdd(sncailiao_wg, item.ncailiao_wg)
          }
          if (item.nrengong_wg) {
            // snrengong_wg  += Number(item.nrengong_wg)
            snrengong_wg = accAdd(snrengong_wg, item.nrengong_wg)
          }
          if (item.nzhizao_wg) {
            // snzhizao_wg  += Number(item.nzhizao_wg)
            snzhizao_wg = accAdd(snzhizao_wg, item.nzhizao_wg)
          }
          if (item.ncailiao_nwg) {
            // sncailiao_nwg  += Number(item.ncailiao_nwg)
            sncailiao_nwg = accAdd(sncailiao_nwg, item.ncailiao_nwg)
          }
          if (item.nrengong_nwg) {
            // snrengong_nwg  += Number(item.nrengong_nwg)
            snrengong_nwg = accAdd(snrengong_nwg, item.nrengong_nwg)
          }
          if (item.nzhizao_nwg) {
            // snzhizao_nwg  += Number(item.nzhizao_nwg)
            snzhizao_nwg = accAdd(snzhizao_nwg, item.nzhizao_nwg)
          }
        }
      })
      if (fsbl === 2) { // 比例
        if (z_f_cailiao_qc !== 0) {
          if (f_cailiao_qc !== 100) {
            errorinfo = '期初材料分配比例之和必须为100！请重新计算或者手工分配'
            return errorinfo
          }
        }
        if (z_f_rengong_qc !== 0) {
          if (f_rengong_qc !== 100) {
            errorinfo = '期初人工分配比例之和必须为100！请重新计算或者手工分配'
            return errorinfo
          }
        }
        if (z_f_zzfy_qc !== 0) {
          if (f_zzfy_qc !== 100) {
            errorinfo = '期初制造费用分配比例之和必须为100！请重新计算或者手工分配'
            return errorinfo
          }
        }
        if (z_f_cailiao !== 0) {
          // console.info(z_f_cailiao)
          // console.info(f_cailiao_bl)
          if (f_cailiao_bl !== 100) {
            errorinfo = '本期发生材料分配比例之和必须为100！请重新计算或者手工分配'
            return errorinfo
          }
        }
        if (z_f_rengong !== 0) {
          if (f_rengong_bl !== 100) {
            errorinfo = '本期发生人工分配比例之和必须为100！请重新计算或者手工分配'
            return errorinfo
          }
        }
        if (z_f_zzfy !== 0) {
          if (f_zzfy_bl !== 100) {
            errorinfo = '本期发生制造费用分配比例之和必须为100！请重新计算或者手工分配'
            return errorinfo
          }
        }
      } else if (fsbl === 3) {
        if (Number(cailiao) !== z_f_cailiao_qc) {
          errorinfo = '期初材料费用金额汇总不一致'
          return errorinfo
        }
        if (Number(rengong) !== z_f_rengong_qc) {
          errorinfo = '期初人工费用金额汇总不一致'
          return errorinfo
        }
        if (Number(zzfy) !== z_f_zzfy_qc) {
          errorinfo = '期初制造费用金额汇总不一致'
          return errorinfo
        }
        if (Number(f_f_zzfy) !== z_f_zzfy) {
          errorinfo = '本月发生制造费用金额汇总不一致'
          return errorinfo
        }
        if (Number(z_f_rengong) !== f_f_rengong) {
          errorinfo = '本月发生人工金额汇总不一致'
          return errorinfo
        }
        if (Number(z_f_cailiao) !== f_f_cailiao) {
          errorinfo = '本月发生材料金额汇总不一致'
          return errorinfo
        }
      }
      if (Math.round(ncailiao_wg * 100) !== Math.round(sncailiao_wg * 100)) {
        errorinfo = '完工材料金额不正确！'
        return errorinfo
      }
      if (Math.round(nrengong_wg * 100) !== Math.round(snrengong_wg * 100)) {
        errorinfo = '完工人工金额不正确！'
        return errorinfo
      }
      if (Math.round(nzhizao_wg * 100) !== Math.round(snzhizao_wg * 100)) {
        errorinfo = '完工制造费用金额不正确！'
        return errorinfo
      }
      if (Math.round(ncailiao_nwg * 100) !== Math.round(sncailiao_nwg * 100)) {
        errorinfo = '未完工材料金额不正确！'
        return errorinfo
      }
      if (Math.round(nrengong_nwg * 100) !== Math.round(snrengong_nwg * 100)) {
        errorinfo = '未完工人工金额不正确！'
        return errorinfo
      }
      if (Math.round(nzhizao_nwg * 100) !== Math.round(snzhizao_nwg * 100)) {
        errorinfo = '未完工制造费用金额不正确！'
        return errorinfo
      }

      if (Math.round((z_f_cailiao + z_f_cailiao_qc) * 100) !== Math.round((ncailiao_wg + ncailiao_nwg) * 100)) {
        errorinfo = '材料没有计算完工!'
        return errorinfo
      }
      if (Math.round((z_f_rengong + z_f_rengong_qc) * 100) !== Math.round((nrengong_wg + nrengong_nwg) * 100)) {
        errorinfo = '人工没有计算完工!'
        return errorinfo
      }
      if (Math.round((z_f_zzfy + z_f_zzfy_qc) * 100) !== Math.round((nzhizao_wg + nzhizao_nwg) * 100)) {
        errorinfo = '制造费用没有计算完工!'
        return errorinfo
      }
      if ((z_f_cailiao + z_f_cailiao_qc) !== 0 || (z_f_rengong + z_f_rengong_qc) !== 0 || (z_f_zzfy + z_f_zzfy_qc) !== 0) {
        row.map((item, index) => { // 从第3行开始校验
          if (index > 1 && item.wgbl && item.wgbl > 0) {
            if (item.nzhizao_wg > 0 || item.nrengong_wg > 0 || item.ncailiao_wg > 0) {
              if (!item.nnum_wg || item.nnum_wg === 0) {
                errorinfo = '第' + (index + 1) + '行完工存货没有录入数量'
              }
            }
          }
        })
        return errorinfo
      }
    },
    onDialogClosed () {
      this.formData3 = []
      this.fentanfangshi = 2
      this.bili = 0
      this.inventoryRefdata = []
      this.dialogVisible = false
    },
    closeDialog () {
      this.formData3 = []
      this.fentanfangshi = 2
      this.bili = 0
      this.inventoryRefdata = []
      this.dialogVisible = false
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
    },
    vxeformatterPercent (obj) { // [完工比例]，列
      if (obj && (obj.rowIndex === 0 || obj.rowIndex === 1)) {
        return ''
      }
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue) + '%'
      }
      return '0.00%'
    },
    vxeformatterMny (obj) { //  金额  列
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue)
      }
      return ''
    },
    vxeformatterNum (obj) { // 数量  列
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue, this.numprecision)
      }
      return ''
    },
    vxeformatterMnyorPercent (obj) {
      if (obj.cellValue) {
        if (this.fentanfangshi === 2) { // 比例
          if (obj.rowIndex === 0 || obj.rowIndex === 1) {
            return this.$options.filters.forThousands(obj.cellValue)
          } else {
            return this.$options.filters.forThousands(obj.cellValue) + '%'
          }
        } else if (this.fentanfangshi === 3) { // 金额
          return this.$options.filters.forThousands(obj.cellValue)
        }
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
  .percentMark:after {
    content: "%";
    position: absolute;
    top: 0;
    right: 3px;
  }
  .percentMark >>> .el-input .el-input__inner {
    text-align: right;
  }
</style>
