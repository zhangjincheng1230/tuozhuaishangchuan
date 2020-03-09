<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
        ref="formRef" size="mini" label-width="140px">
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
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SocialInsurDialog',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
  },
  props: ['visible', 'data'],
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
      this.getAccsetData(newValue, row)
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
        this.saveInfo11(this.formData)
      })
    },
    saveInfo11 (formCardData) {
      const saveHead = Object.assign({}, formCardData)
      const temp = {
        strArr: JSON.stringify(saveHead),
        opdate: this.formData.qj,
        pk_corp: this.formData.pk_corp
      }
      this.showLoading('正在保存...')
      this.$api.SalaryManageApi.SocialInsur.saveInfo(temp).then(result => {
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
        this.formData = { qj: formData.qj, pk_corp: formData.pk_corp }
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
