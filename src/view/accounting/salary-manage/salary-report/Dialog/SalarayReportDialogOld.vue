<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="1120px"
  >
    <div class="form-container" :style="'max-height:' + maxHeight +'px'">
      <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        size="mini"
        label-width="150px">
        <span style="font-size: 14px;font-weight: bold;margin-top:2px;">期间信息</span>
        <el-row>
          <el-col :span="8">
            <el-form-item label="期间"  prop="qj">
              <el-input v-model="formData.qj" :disabled="true" style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <span style="font-size: 14px;font-weight: bold;margin-top:2px;">基础信息</span>
        <el-row >
          <el-col :span="8">
            <el-form-item label="工号" prop="cpersonid" >
              <el-select  v-model="formData.cpersonid" filterable @change="bmHandleChange" style="width:174px"
                          default-first-option placeholder="请选择">
                <el-option v-for="item in person" :key="item.id"  :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id"  style="width:174px">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="ygname">
              <el-input  v-model="formData.ygname"  :disabled="true"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件编码" prop="zjbm">
              <el-input v-model="formData.zjbm"  :disabled="true"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <span style="font-size: 14px;font-weight: bold;margin-top:2px;">收入信息</span>
        <el-row>
          <el-col :span="8">
            <el-form-item label="本期收入"  prop="yfgz">
              <el-input-number @change="srehandleChange" v-model="formData.yfgz" :precision="2" :controls =false :min="0" :max="999999999"  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <span  v-if="ishow" style="font-size: 14px;font-weight: bold;margin-top:2px;">专项扣除</span>
        <el-row  v-if="ishow" >
          <el-col :span="8">
            <el-form-item label="基本养老保险费" prop="yanglaobx">
              <el-input-number @change="zxkchandleChange" v-model="formData.yanglaobx" :precision="2" :controls =false :min="0" :max="999999999"  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基本医疗保险费" prop="yiliaobx">
              <el-input-number @change="zxkchandleChange" v-model="formData.yiliaobx" :precision="2" :controls =false :min="0" :max="999999999"  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="失业保险费" prop="shiyebx">
              <el-input-number @change="zxkchandleChange" v-model="formData.shiyebx" :precision="2" :controls =false :min="0" :max="999999999"  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ishow" >
          <el-col :span="8">
            <el-form-item label="住房公积金" prop="zfgjj">
              <el-input-number @change="zxkchandleChange" v-model="formData.zfgjj" :precision="2" :controls =false :min="0" :max="999999999"  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小计" prop="zxkcxj">
              <el-input-number  v-model="formData.zxkcxj"  :precision="2" :controls =false :min="0" :max="999999999" :disabled = true  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <span style="font-size: 14px;font-weight: bold;margin-top:2px;">税费计算</span>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应纳税所得额" prop="ynssde">
              <el-input-number  v-model="formData.ynssde" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率" prop="shuilv">
              <el-input-number  v-model="formData.shuilv" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人所得税" prop="grsds">
              <el-input-number  v-model="formData.grsds" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="实发工资" prop="sfgz">
              <el-input-number  v-model="formData.sfgz" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true  style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-input v-model="formData.zjlx" type="hidden"></el-input>
          <el-input v-model="formData.pk_salaryreport" type="hidden"></el-input>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size="small" @click="saveInfo">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import { accAdd, accSubtr, accDiv, accMul } from '@/utils'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SalarayReportDialogOld',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  props: ['visible', 'data'],
  data () {
    return {
      rules: {
        cpersonid: [{ required: true, message: '请选择员工', trigger: 'blur' }]
      },
      formData: {},
      persondata: []
    }
  },
  computed: {
    maxHeight () {
      return this.$store.getters.maxDialogBodyHeight
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    dialogTitle: {
      get () {
        return this.data.curOptType === 'new' ? '新增' : '修改'
      }
    },
    formInfo: {
      get () {
        let formData = Object.assign({}, this.data)
        return formData
      },
      set (data) {
        this.$emit('update:data', data)
      }
    },
    ishow: {
      get () {
        return this.formData.billtype === '01'
      }
    },
    person: {
      get () {
        return this.persondata.filter(item => item.billtype === this.formData.billtype)
      }
    }
  },
  mounted () {
    this.getPersonData()
  },
  methods: {
    refreshData () {
      this.getPersonData()
    },
    getPersonData () {
      this.$api.SalaryManageApi.StaffInfo.queryB({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.STAFF,
        pk_corp: this.formData.pk_corp,
        billtype: this.formData.billtype
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            this.persondata = result.rows.filter(item => item.billtype !== '05')
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    bmHandleChange (newValue) {
      this.$refs.formRef.clearValidate() // 移除校验结果
      const row = this.persondata.find(item => item.id === newValue)
      this.getaccsetdata(true, newValue, row)
    },
    srehandleChange () {
      this.calGzOld()
    },
    // 专项附加
    zxkchandleChange () {
      const columns = ['yanglaobx', 'yiliaobx', 'shiyebx', 'zfgjj']
      this.formData.zxkcxj = this.calAdd(columns)
      this.calGzOld()
    },
    // 计算小计
    calAdd (columns) {
      const temp = 0
      if (columns == null || columns.length === 0) { return temp }
      const array = []
      for (const col in columns) {
        array.push(this.formData[columns[col]])
      }
      const zxdc = this.addByDouble(array)
      return zxdc
    },
    calGzOld () {
      const qj = this.formData.period
      const yfgz = this.formData.yfgz
      const columns = ['yanglaobx', 'yiliaobx', 'shiyebx', 'zfgjj']
      const total = this.calAdd(columns)
      let ynssde = accSubtr(yfgz, total)
      if (ynssde <= 0) { ynssde = 0 }

      const kcnum = this.getkcnum('01', qj)
      const taxs = this.getTax(ynssde, Number(kcnum))
      const slv = taxs[0]
      const quickdeduction = taxs[1]
      let grsds = accSubtr(accDiv(accMul(accSubtr(ynssde, kcnum), slv), 100), quickdeduction)
      if (grsds <= 0) { grsds = 0 }
      let sfgz = accSubtr(ynssde, grsds)
      if (sfgz <= 0) { sfgz = 0 }

      let taxbase = accSubtr(ynssde, kcnum)
      if (taxbase <= 0) { taxbase = 0 }

      this.formData.ynssde = taxbase
      this.formData.shuilv = slv
      this.formData.grsds = grsds
      this.formData.sfgz = sfgz
    },
    getaccsetdata (isnew, cpersonids, row) {
      const param = {
        pk_corp: this.formData.pk_corp,
        billtype: this.formData.billtype,
        opdate: this.formData.qj,
        isnew: isnew,
        cpersonids: cpersonids
      }
      this.$api.SalaryManageApi.SalaryReport.getSalaryAccSet(param).then(result => {
        if (result.success) {
          if (result.rows[0]) {
            const pk = this.formData.pk_salaryreport
            const qj = this.formData.qj
            const billtype = this.formData.billtype
            this.formData = result.rows[0]
            this.formData.pk_salaryreport = pk
            this.formData.qj = qj
            this.formData.billtype = billtype
          }
          if (row) {
            this.formData.cpersonid = row.id
            this.formData.ygname = row.name
            this.formData.zjbm = row.zjbm
            this.formData.zjlx = row.zjlx
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    addByDouble (dous) {
      let temp = 0
      if (dous === null || dous.length === 0) { return temp }
      for (const dou of dous) {
        temp = accAdd(temp, dou)
      }
      return temp
    },
    subByDouble (dous) {
      let temp = 0
      if (dous === null || dous.length === 0) { return temp }
      const len = dous.length
      for (let i = 0; i < len; i++) {
        if (i === 0) {
          temp = dous[i]
        } else {
          temp = accSubtr(temp, dous[i])
        }
      }
      return temp
    },
    getTax (salaryBeforeTax, kcnum) {
      const dous = []
      const qj = this.period
      if (salaryBeforeTax) {
        // （3W-3.5K）*25%-1005
        // 扣税公式是：
        // （扣除社保医保公积金后薪水-个税起征点）*税率-速算扣除数
        let taxbase = salaryBeforeTax - kcnum
        let Taxrate = 0// 这里税率没有除以百分比；
        let Quickdeduction = 0
        if (qj >= '2018-10') {
          if (taxbase <= 0) { // 低于个税起征点
            Taxrate = 0
            Quickdeduction = 0
          } else if (taxbase <= 3000) {
            Taxrate = 3
            Quickdeduction = 0
          } else if (taxbase <= 12000) {
            Taxrate = 10
            Quickdeduction = 210
          } else if (taxbase <= 25000) {
            Taxrate = 20
            Quickdeduction = 1410
          } else if (taxbase <= 35000) {
            Taxrate = 25
            Quickdeduction = 2660
          } else if (taxbase <= 55000) {
            Taxrate = 30
            Quickdeduction = 4410
          } else if (taxbase <= 80000) {
            Taxrate = 35
            Quickdeduction = 7160
          } else {
            Taxrate = 45
            Quickdeduction = 15160
          }
        } else {
          if (taxbase <= 0) { // 低于个税起征点
            Taxrate = 0
            Quickdeduction = 0
          } else if (taxbase <= 1500) {
            Taxrate = 3
            Quickdeduction = 0
          } else if (taxbase <= 4500) {
            Taxrate = 10
            Quickdeduction = 105
          } else if (taxbase <= 9000) {
            Taxrate = 20
            Quickdeduction = 555
          } else if (taxbase <= 35000) {
            Taxrate = 25
            Quickdeduction = 1005
          } else if (taxbase <= 55000) {
            Taxrate = 30
            Quickdeduction = 2755
          } else if (taxbase <= 80000) {
            Taxrate = 35
            Quickdeduction = 5505
          } else {
            Taxrate = 45
            Quickdeduction = 13505
          }
        }
        dous[0] = Taxrate
        dous[1] = Quickdeduction
      }
      return dous
    },
    getkcnum (vbilltype, qj) {
      var kcnum = 0

      if (vbilltype === '01') {
        kcnum = 3500
        if (qj >= '2018-10') {
          kcnum = 5000
        } else {
          kcnum = 3500
        }
      } else if (vbilltype === '03') {
        kcnum = 4800
        if (qj >= '2018-10') {
          kcnum = 5000
        } else {
          kcnum = 4800
        }
      }
      return kcnum
    },
    saveInfo () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return
        }
        this.saveInfo11(this.formData)
      })
    },
    saveInfo11 (formCardData) {
      const saveHead = Object.assign({}, formCardData)
      const temp = {
        strArr: JSON.stringify(saveHead),
        opdate: formCardData.qj,
        pk_corp: this.formData.pk_corp,
        billtype: formCardData.billtype
      }
      this.showLoading('正在保存...')
      this.$api.SalaryManageApi.SalaryReport.saveInfo(temp).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg(result.msg)
          this.onDialogClose()
          this.$emit('fetchData')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    onDialogOpen () {
      const formData = Object.assign({}, this.formInfo)
      if (formData.curOptType === 'new') {
        this.formData = { qj: formData.qj, billtype: formData.billtype, pk_corp: formData.pk_corp }
      } else {
        this.formData = formData
      }
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .form-container {
    padding: 10px 15px;
    overflow: auto;
  }
  >>>.el-input-number .el-input__inner {
    text-align: right;
  }
</style>
