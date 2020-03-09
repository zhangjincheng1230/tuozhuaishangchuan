<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="1120px"
  >
    <div class="form-container" :style="'max-height: ' + maxHeight +'px'">
      <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        size="mini"
        label-width="160px">
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
              <el-select  v-model="formData.cpersonid" filterable @change="bmHandleChange" style="width:174px"
                          default-first-option placeholder="请选择">
                <el-option v-for="item in persondata" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id"  style="width:174px">
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
            <el-form-item label="本期收入"  prop="yfgz" ref ="yfgz">
              <el-input-number @change="srehandleChange" v-model="formData.yfgz" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="累计收入" prop="ljsre" ref ="ljsre">
              <el-input-number @change="handleChange" v-model="formData.ljsre" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">专项扣除</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基本养老保险费" prop="yanglaobx">
              <el-input-number @change="zxkchandleChange" v-model="formData.yanglaobx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基本医疗保险费" prop="yiliaobx">
              <el-input-number @change="zxkchandleChange" v-model="formData.yiliaobx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="失业保险费" prop="shiyebx">
              <el-input-number @change="zxkchandleChange" v-model="formData.shiyebx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="住房公积金" prop="zfgjj">
              <el-input-number @change="zxkchandleChange" v-model="formData.zfgjj" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小计" prop="zxkcxj">
              <el-input-number  v-model="formData.zxkcxj"  :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="累计专项扣除" prop="ljzxkc">
              <el-input-number @change="handleChange"  v-model="formData.ljzxkc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;" v-if="this.showqybf ==='true'">企业承担专项扣除</div>
        <el-row>
          <el-col :span="8"  v-if="this.showqybf ==='true'" >
            <el-form-item label="企业基本养老保险费" prop="qyyanglaobx">
              <el-input-number v-model="formData.qyyanglaobx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8"  v-if="this.showqybf ==='true'" >
            <el-form-item label="企业基本医疗保险费" prop="qyyiliaobx">
              <el-input-number v-model="formData.qyyiliaobx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8"  v-if="this.showqybf ==='true'" >
            <el-form-item label="企业失业保险费" prop="qyshiyebx">
              <el-input-number  v-model="formData.qyshiyebx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"  v-if="this.showqybf ==='true'" >
            <el-form-item label="企业住房公积金" prop="qyzfgjj">
              <el-input-number  v-model="formData.qyzfgjj" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8"  v-if="this.showqybf ==='true'" >
            <el-form-item label="企业工商保险费" prop="qygsbx">
              <el-input-number  v-model="formData.qygsbx"  :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8"  v-if="this.showqybf ==='true'" >
            <el-form-item label="企业生育保险费" prop="qyshybx">
              <el-input-number v-model="formData.qyshybx" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;" v-if="this.showzxfj ==='true'">专项附加扣除</div>
        <el-row>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="子女教育" prop="znjyzc">
              <el-input-number @change="znzxkchandleChange"   v-model="formData.znjyzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="赡养老人" prop="sylrzc">
              <el-input-number @change="syfjkchandleChange"   v-model="formData.sylrzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="住房贷款利息" prop="zfdkzc">
              <el-input-number @change="dkfjkchandleChange"   v-model="formData.zfdkzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="住房租金" prop="zfzjzc">
              <el-input-number @change="zffjkchandleChange"   v-model="formData.zfzjzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="继续教育" prop="jxjyzc">
              <el-input-number @change="jxfjkchandleChange"   v-model="formData.jxjyzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="小计" prop="zxkcfjxj">
              <el-input-number  v-model="formData.zxkcfjxj" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;" v-if="this.showzxfj ==='true'" >累计专项附加扣除</div>
        <el-row>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="累计子女教育支出" prop="ljznjyzc">
              <el-input-number @change="handleChange"  v-model="formData.ljznjyzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="累计赡养老人支出" prop="ljsylrzc">
              <el-input-number @change="handleChange"  v-model="formData.ljsylrzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="累计住房贷款利息支出" prop="ljzfdkzc">
              <el-input-number @change="handleChange"  v-model="formData.ljzfdkzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="累计住房租金支出" prop="ljzfzjzc">
              <el-input-number @change="handleChange"  v-model="formData.ljzfzjzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.showzxfj ==='true'" >
            <el-form-item label="累计继续教育支出" prop="ljjxjyzc">
              <el-input-number @change="handleChange"  v-model="formData.ljjxjyzc" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">税费计算</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="累计减除费用" prop="ljjcfy">
              <el-input-number @change="handleChange" v-model="formData.ljjcfy"  :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应纳税所得额" prop="ynssde">
              <el-input-number v-model="formData.ynssde" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率/预扣率" prop="shuilv">
              <el-input-number v-model="formData.shuilv" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="累计应纳税额" prop="ljynse">
              <el-input-number  v-model="formData.ljynse" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已预缴税额" prop="yyjse">
              <el-input-number @change="handleChange" v-model="formData.yyjse" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人所得税" prop="grsds">
              <el-input-number  v-model="formData.grsds" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="实发工资" prop="sfgz">
              <el-input-number   v-model="formData.sfgz" :precision="2" :controls =false :min="0" :max="999999999" :disabled = true style="width:174px"></el-input-number>
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
import { accAdd, accSubtr, accDiv, accMul } from '@/utils'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SalarayReportDialogNew',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
  },
  props: ['visible', 'data', 'qybf', 'zxfj'],
  data () {
    return {
      rules: {
        cpersonid: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        yfgz: [{ required: true, message: '请输入本期收入', trigger: 'blur' }],
        ljsre: [{ required: true, message: '请输入累计收入', trigger: 'blur' }]
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
    showqybf: {
      get () {
        return this.qybf
      },
      set (flag) {
        this.$emit('update:qybf', flag)
      }
    },
    showzxfj: {
      get () {
        return this.zxfj
      },
      set (flag) {
        this.$emit('update:zxfj', flag)
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
            this.persondata = result.rows.filter(item => item.billtype === '01')
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
    handleChange () {
      this.calGz()
    },
    srehandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljsre')
      this.calGz()
    },
    // 专项附加
    zxkchandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljzxkc')
      const columns = ['yanglaobx', 'yiliaobx', 'shiyebx', 'zfgjj']
      this.formData.zxkcxj = this.calAdd(columns)
      this.calGz()
    }, // 子女教育
    znzxkchandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljznjyzc')
      this.zxfjkchandleChange()
      this.calGz()
    }, // 继续教育
    jxfjkchandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljjxjyzc')
      this.zxfjkchandleChange()
      this.calGz()
    }, // 住房租金
    zffjkchandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljzfzjzc')
      this.zxfjkchandleChange()
    }, // 贷款支出
    dkfjkchandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljzfdkzc')
      this.zxfjkchandleChange()
      this.calGz()
    }, // 赡养老人
    syfjkchandleChange (newValue, oldValue) {
      this.calLjData(newValue, oldValue, 'ljsylrzc')
      this.zxfjkchandleChange()
      this.calGz()
    },
    // 专项附加扣除
    zxfjkchandleChange (newValue, oldValue) {
      const columns = ['znjyzc', 'jxjyzc', 'zfdkzc', 'zfzjzc', 'sylrzc']
      this.formData.zxkcfjxj = this.calAdd(columns)
      this.calGz()
    }, // 计算本期 累加到累计上
    calLjData (newValue, oldValue, column) {
      const temp = accAdd(accSubtr(newValue, oldValue), this.formData[column])
      this.formData[column] = temp
    },
    calGz () {
      // 累计收入额
      const ljsre = this.formData.ljsre
      // 累计减除费用
      const ljjcfy = this.formData.ljjcfy
      // 累计专项扣除 = 累计五险一金
      const ljzxkc = this.formData.ljzxkc
      // 计算累计专项附加抵扣合计

      let columns = ['ljznjyzc', 'ljjxjyzc', 'ljzfdkzc', 'ljzfzjzc', 'ljsylrzc']
      const ljzxdc = this.calAdd(columns)

      // 累计预扣预缴应纳税所得额=累计收入-累计减除费用-累计专项扣除-累计专项附加扣除
      let dous = [ljsre, ljjcfy, ljzxkc, ljzxdc]
      let ynssde = this.subByDouble(dous)

      if (ynssde < 0) { ynssde = 0 }
      this.formData.ynssde = ynssde

      const taxs = this.getTax(ynssde)

      // 计算税率 =累计预扣预缴应纳税所得额对应的税率
      const shuilv = taxs[0]
      this.formData.shuilv = shuilv
      // 计算速算扣除数 =累计预扣预缴应纳税所得额对应的扣除数
      const quickdeduction = taxs[1]

      // 累计应纳税额 =累计预扣预缴应纳税所得额×预扣率-速算扣除数
      let ynse = accSubtr(accDiv(accMul(ynssde, shuilv), 100), quickdeduction)
      if (ynse < 0) { ynse = 0 }

      this.formData.ljynse = ynse
      // 累计已预扣预缴税额
      const yyjse = this.formData.yyjse

      // 本期应预扣预缴税额=累计应纳税额-累计已预扣预缴税额
      let grsds = accSubtr(ynse, yyjse)
      if (grsds < 0) { grsds = 0 }

      this.formData.grsds = grsds
      const yfgz = this.formData.yfgz
      columns = ['zfgjj', 'yanglaobx', 'yiliaobx', 'shiyebx']
      const zxkc = this.calAdd(columns)
      dous = [yfgz, zxkc, grsds]

      let sfgz = this.subByDouble(dous)
      if (sfgz < 0) { sfgz = 0 }
      this.formData.sfgz = sfgz
    },
    getTax: function getTax (taxbase) {
      let Quickdeduction = 0
      let Taxrate = 0
      // 不超过 36000 元 3 0
      // 2 超过 36000 元至 144000 元的部分 10 2520
      // 3 超过 144000 元至 300000 元的部分 20 16920
      // 4 超过 300000 元至 420000 元的部分 25 31920
      // 5 超过 420000 元至 660000 元的部分 30 52920
      // 6 超过 660000 元至 960000 元的部分 35 85920
      // 7 超过 960000 元的部分 45 181920
      const dous = []
      if (taxbase <= 36000) {
        if (taxbase <= 0) {
          Taxrate = 0
        } else {
          Taxrate = 3
        }
        Quickdeduction = 0
      } else if (taxbase <= 144000) {
        Taxrate = 10
        Quickdeduction = 2520
      } else if (taxbase <= 300000) {
        Taxrate = 20
        Quickdeduction = 16920
      } else if (taxbase <= 420000) {
        Taxrate = 25
        Quickdeduction = 31920
      } else if (taxbase <= 660000) {
        Taxrate = 30
        Quickdeduction = 52920
      } else if (taxbase <= 960000) {
        Taxrate = 35
        Quickdeduction = 85920
      } else {
        Taxrate = 45
        Quickdeduction = 181920
      }
      dous[0] = Taxrate
      dous[1] = Quickdeduction
      return dous
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
    getkcnum (vbilltype, qj) {
      let kcnum = 0
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
