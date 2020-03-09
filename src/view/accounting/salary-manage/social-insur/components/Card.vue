<template>
  <div class="kj-container kj-card" >
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
        ref="formRef" size="mini" label-width="150px">
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">期间信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="期间"  prop="qj">
              <el-input v-model="formData.qj" :disabled="true" style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">基本信息</div>
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
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">养老保险信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数"  prop="yfbx_js">
              <el-input-number  v-model="formData.yfbx_js" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例" prop="yfbx_bl">
              <font>
                <el-input-number v-model="formData.yfbx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固额" prop="yfbx_mny">
              <el-input-number v-model="formData.yfbx_mny" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业比例" prop="qyyfbx_bl">
              <font>
                <el-input-number v-model="formData.qyyfbx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">医疗保险信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数"  prop="ylbx_js">
              <el-input-number v-model="formData.ylbx_js" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例" prop="ylbx_bl">
              <font>
                <el-input-number v-model="formData.ylbx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固额" prop="ylbx_mny">
              <el-input-number v-model="formData.ylbx_mny" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业比例" prop="qyylbx_bl">
              <font>
                <el-input-number v-model="formData.qyylbx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">失业保险信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数"  prop="sybx_js">
              <el-input-number v-model="formData.sybx_js" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例" prop="sybx_bl">
              <font>
                <el-input-number v-model="formData.sybx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固额" prop="sybx_mny">
              <el-input-number v-model="formData.sybx_mny" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业比例" prop="qysybx_bl">
              <font>
                <el-input-number v-model="formData.qysybx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">公积金信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数"  prop="gjj_js">
              <el-input-number v-model="formData.gjj_js" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="个人比例" prop="gjj_bl">
              <font>
                <el-input-number v-model="formData.gjj_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固额" prop="gjj_mny">
              <el-input-number v-model="formData.gjj_mny" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业比例" prop="qygjj_bl">
              <font>
                <el-input-number v-model="formData.qygjj_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">工伤保险信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数"  prop="gsbx_js">
              <el-input-number v-model="formData.gsbx_js" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业比例" prop="qygsbx_bl">
              <font>
                <el-input-number v-model="formData.qygsbx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">生育保险信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="基数"  prop="shybx_js">
              <el-input-number v-model="formData.shybx_js" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业比例" prop="qyshybx_bl">
              <font>
                <el-input-number v-model="formData.qyshybx_bl" :precision="2" :controls =false :min="0" :max="999" style="width:174px"></el-input-number><span>%</span>
              </font>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-input v-model="formData.cpersonid" type="hidden"></el-input>
          <el-input v-model="formData.zjlx" type="hidden"></el-input>
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
  name: 'Card',
  mixins: [MessageUtil, Loading],
  props: ['data'],
  data () {
    return {
      formData: {},
      rules: {
        cpersonid: [{ required: true, message: '请选择员工', trigger: 'blur' }]
      },
      persondata: []
    }
  },

  computed: {
    formInfo: {
      get () {
        return this.data
      },
      set () {
        this.$emit('update:data', false)
      }
    }
  },
  mounted () {
    const formData = Object.assign({}, this.formInfo)
    if (formData.curOptType === 'new') {
      this.formData = { qj: formData.qj }
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
        billtype: '01'
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
      this.getAccsetData(row.id, row)
    },
    getAccsetData (cpersonids, row) {
      this.$api.SalaryManageApi.SocialInsur.getSalaryAccSet({
        opdate: this.formData.qj,
        pk_corp: this.formData.pk_corp,
        cpersonids: cpersonids
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            const id = this.formData.pk_salaryreport
            this.formData = result.rows
            this.formData.pk_sqlarybase = id
            if (row) {
              this.formData.cpersonid = row.id
              this.formData.ygname = row.name
              this.formData.zjbm = row.zjbm
              this.formData.zjlx = row.zjlx
            }
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
        const saveHead = Object.assign({}, this.formData)
        const temp = {
          strArr: JSON.stringify(saveHead),
          opdate: this.formData.qj,
          pk_corp: this.$parent.pk_corp
        }
        this.showLoading('正在保存...')
        this.$api.SalaryManageApi.SocialInsur.saveInfo(temp).then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg(result.msg)
            this.$parent.editStatus = false
            this.$parent.cardShow = false
            this.$parent.initperiod = this.formData.qj
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      })
    },
    cancelEdit () {
      this.$parent.editStatus = false
      this.$parent.cardShow = false
      this.$parent.initperiod = this.formData.qj
    }
  }
}
</script>
<style scoped>

</style>
