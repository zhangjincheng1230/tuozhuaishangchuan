<template>
  <div>
    <div class="kj-head">
      <div class="kj-button-group">
        <el-button  @click="saveInfo">保存</el-button>
        <el-button  @click="cancelEdit">取消</el-button>
      </div>
    </div>
    <div class="kj-main">
      <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        size="mini"
        label-width="150px">
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">期间信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="期间"  prop="qj">
              <el-input v-model="formData.qj" :disabled="true" style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">基础信息</div>
        <el-row >
          <el-col :span="8">
            <el-form-item label="工号" prop="cpersonid">
              <el-select  v-model="formData.cpersonid" filterable @change="bmHandleChange"
                          default-first-option placeholder="请选择" style="width:174px">
                <el-option v-for="item in persondata" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id" style="width:174px">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="ygname">
              <el-input  v-model="formData.ygname"  :disabled="true" style="width:174px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件编码" prop="zjbm">
              <el-input v-model="formData.zjbm"  :disabled="true" style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">收入信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="本期收入"  prop="yfgz">
              <el-input-number @change="srehandleChange" v-model="formData.yfgz" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">税费计算</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应纳税所得额" prop="ynssde">
              <el-input-number  v-model="formData.ynssde" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率" prop="shuilv">
              <el-input-number  v-model="formData.shuilv" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应扣缴税额" prop="grsds">
              <el-input-number  v-model="formData.grsds" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="实发工资" prop="sfgz">
              <el-input-number v-model="formData.sfgz" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-input v-model="formData.zjlx" type="hidden"></el-input>
          <el-input v-model="formData.pk_salaryreport" type="hidden"></el-input>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SalarayReportCardRemn',
  mixins: [MessageUtil, Loading],
  props: ['data'],
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
    parent () {
      return this.$parent.$parent
    },
    formInfo: {
      get () {
        return this.data
      },
      set (data) {
        this.$emit('update:data', data)
      }
    }
  },
  mounted () {
    const formData = Object.assign({}, this.formInfo)
    if (formData.curOptType === 'new') {
      this.formData = { qj: formData.qj, billtype: formData.billtype }
    } else {
      this.formData = formData
    }
    this.getPersonData()
  },
  methods: {
    getPersonData () {
      this.$api.SalaryManageApi.StaffInfo.queryB({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.STAFF,
        pk_corp: this.$parent.pk_corp,
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
      const yfgz = this.formData.yfgz
      let ynssde = Number(yfgz)
      if (ynssde <= 0) { ynssde = 0 }

      const kcnum = this.getkcnum(ynssde)
      const taxs = this.getTax(ynssde, kcnum)
      const slv = taxs[0]
      const quickdeduction = taxs[1]
      let grsds = ((ynssde - kcnum) * slv / 100 - quickdeduction)
      if (grsds <= 0) { grsds = 0 }

      let sfgz = ynssde - grsds
      if (sfgz <= 0) { sfgz = 0 }

      let taxbase = ynssde - Number(kcnum)
      if (taxbase <= 0) { taxbase = 0 }

      this.formData.ynssde = taxbase
      this.formData.shuilv = slv
      this.formData.grsds = grsds
      this.formData.sfgz = sfgz
    },
    getTax (salaryBeforeTax, kcnum) {
      const taxbase = salaryBeforeTax - kcnum
      // 应纳税所得额 = 劳务报酬（少于4000元） - 800元
      //
      // 应纳税所得额 = 劳务报酬（超过4000元） × （1 - 20%）
      //
      // 应纳税额 = 应纳税所得额 × 适用税率 - 速算扣除数

      // 1 不超过20,000元 20% 0
      // 2 超过20,000元至50,000元的部分 30% 2,000
      // 3 超过50,000元的部分 40% 7,000
      let Taxrate = 0// 这里税率没有除以百分比；
      let Quickdeduction = 0
      if (taxbase <= 0) { // 低于个税起征点
        Taxrate = 0
        Quickdeduction = 0
      } else if (taxbase <= 20000) {
        Taxrate = 20
        Quickdeduction = 0
      } else if (taxbase <= 50000) {
        Taxrate = 30
        Quickdeduction = 2000
      } else {
        Taxrate = 40
        Quickdeduction = 7000
      }
      const dous = []
      dous[0] = Taxrate
      dous[1] = Quickdeduction
      return dous
    },
    getkcnum (taxbase) {
      let kcnum = 0
      if (taxbase <= 800) {
        kcnum = 800
      } else if (taxbase < 4000) {
        kcnum = 800
      } else {
        kcnum = taxbase * 0.2
      }
      return kcnum.toFixed(2)
    },
    getaccsetdata (isnew, cpersonids, row) {
      const param = {
        pk_corp: this.parent.pk_corp,
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
    saveInfo () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return
        }
        this.$parent.saveInfo(this.formData)
      })
    },
    cancelEdit () {
      this.$parent.cancelEdit()
    }
  }
}
</script>

<style scoped>

</style>
