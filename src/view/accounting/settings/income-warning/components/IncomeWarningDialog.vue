<template>
  <div>
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               @open="onDialogOpen"
               @close="onDialogClose"
               @closed="onDialogClosed"
               width="430px">
      <div class="form-container" :style="'height: ' + maxHeight +'px'" style="overflow-x: hidden;overflow-y: auto">
        <el-form :model="formData" :rules="rules" ref="formData">
          <el-form-item label="预警项目名称" prop="xmmc" :label-width="formLabelWidth">
            <el-input ref="xmmc_attr" v-model.trim="formData.xmmc" :disabled="formData.editStatus" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="科目及编码" prop="subjnames" :label-width="formLabelWidth">
              <el-select v-model="formData.subjnames"
                         @change="onSingleSubjectChange"
                         :disabled="formData.editStatus"
                         placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="subj in subSubjectRef"
                  :key="subj.id"
                  :label="subj.kmbm + '_' + subj.kmmc"
                  :value="subj.id">
                </el-option>
                <template slot="prefix">
                  <i @click.stop="openKm()" class="el-icon-search"></i>
                </template>
              </el-select>

            <!--<el-select v-model="formData.subjs"
                       multiple
                       @change="onSubjectChange"
                       :disabled="formData.editStatus"
                       placeholder="请选择" style="width: 100%">
              <el-option
                v-for="subj in subSubjectRef"
                :key="subj.id"
                :label="subj.kmbm + '_' + subj.kmmc"
                :value="subj.id">
              </el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="预警上限" prop="srsx" :label-width="formLabelWidth">
            <el-input-number :precision="2" v-model="formData.srsx" :disabled="formData.editStatus" :controls =false  style="width: 73%"></el-input-number>元
            <el-tooltip v-show="formData.flg == '是'" effect="light" placement="right">
              <div slot="content">
                <div v-if="'小型微利企业资产总额' == formData.xmmc">
                  季度平均值＝（季初资产总额+季末资产总额）÷2
                </div>
                <div v-else-if="'小型微利企业年度应纳税所得额' == formData.xmmc">
                  查账征收：取季末利润表本年累计的利润总额<br/>
                  核定征收：取季末利润表本年累计（营业收入+营业外收入）*税务机关核定的应税所得率
                </div>
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="预警提醒：超过" prop="yjz" :label-width="formLabelWidth">
            <el-input-number :precision="2" v-model="formData.yjz" :controls =false  style="width: 73%"></el-input-number>元时，提醒
          </el-form-item>
          <el-form-item label="预警周期" prop="period_type" :label-width="formLabelWidth">
            <el-select v-model="formData.period_type"
                       :disabled="formData.editStatus"
                       placeholder="请选择" style="width: 100%">
              <el-option
                v-for="type in periodtypes"
                :key="type.id"
                :label="type.value"
                :value="type.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="" :label-width="formLabelWidth">
            <el-checkbox v-model="formData.isLoginRemind" true-label="Y" false-label="N" autocomplete="off">登录时提醒</el-checkbox>
            <el-checkbox v-if="!formData.editStatus" v-model="formData.isInputRemind" true-label="Y" false-label="N" autocomplete="off">录入科目时提醒</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="" :label-width="formLabelWidth">
            <el-checkbox v-if="!formData.editStatus" v-model="formData.has_history" @change="hisChange" true-label="Y" false-label="N" autocomplete="off">维护历史发生金额</el-checkbox>
          </el-form-item>
        </el-form>
        <el-form :model="hisFormData" ref="hisFormData">
          <table v-show="formData.editHisFormStatus" id="his_table" class="table-bordered" style="margin-top: 15px;">
            <thead>
            <tr>
              <th>日期</th>
              <th>金额</th>
              <th>日期</th>
              <th>金额</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,idx) in hiss">
              <td>{{item.one}}</td><td><el-input-number :precision="2" v-model="hisFormData[item.one]" style="width: 100px" :controls =false></el-input-number></td>
              <template v-if="idx == 5">
              </template>
              <template v-else>
                <td >{{item.two}}</td><td><el-input-number :precision="2" v-model="hisFormData[item.two]" style="width: 100px" :controls =false></el-input-number></td>
              </template>

            </tr>
            </tbody>
          </table>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="saveData">保 存</el-button>
        </div>
      </template>
    </el-dialog>
    <SubjectReferenceDialog
      :visible.sync="kmDialogVisible"
      :defaultSelection="kmSelections"
      :singleSelect="false"
      @select="selectSubject">
    </SubjectReferenceDialog>
  </div>
</template>

<script>
import { getPreviousPeriod } from '@/utils'
import SubjectReferenceDialog from '@/components/reference/SubjectDialog'
import loadingMixin from '@/mixins/loading'
export default {
  name: 'IncomeWarningDialog',
  components: {
    SubjectReferenceDialog
  },
  props: ['visible', 'account'],
  mixins: [loadingMixin],
  data () {
    return {
      maxHeight: 400,
      kmDialogVisible: false,
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      formData: {
        period_type: 3
      },
      hisFormData: {},
      formLabelWidth: '120px',
      rules: {
        xmmc: [
          { required: true, message: '请输入预警项目名称', trigger: 'blur' }
        ],
        subjnames: [
          { required: true, message: '请选择科目', trigger: 'blur' }
        ],
        srsx: [
          { required: true, message: '请输入预警上限', trigger: 'blur' }
        ],
        yjz: [
          { required: true, message: '请输入预警值', trigger: 'blur' }
        ],
        period_type: [
          { required: true, message: '请输入预警值', trigger: 'blur' }
        ]
      },
      periodtypes: [
        {id: 0, value: '月度'},
        {id: 1, value: '季度'},
        {id: 2, value: '年度'},
        {id: 3, value: '连续 12 月'}
      ],

      kmSelections: []
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
    isEdit () {
      return this.account && this.account.pk_sryj
    },
    title () {
      return this.isEdit ? '修改预警值' : '新增预警值'
    },
    subSubjectRef () {
      return this.$store.getters.subjectRef
    },
    getTips () {
      if (this.formData.xmmc == '小型微利企业资产总额') {
        return '季度平均值＝（季初资产总额+季末资产总额）÷2'
      } else if (this.formData.xmmc == '小型微利企业年度应纳税所得额') {
        return '查账征收：取季末利润表本年累计的利润总额<br/>核定征收：取季末利润表本年累计（营业收入+营业外收入）*税务机关核定的应税所得率'
      }

      return ''
    },
    hiss () {
      let jzdate = this.$store.getters.currentCorp.bdate
      let beginDate = new Date(jzdate)
      let periods = []
      for (let i = 1; i <= 11; i++) {
        beginDate = getPreviousPeriod(beginDate, 1)
        periods.push(beginDate)
      }

      let ss = []
      let obj = {}
      for (let j = 0; j < 5; j++) {
        obj = {}
        obj['one'] = periods[j]

        obj['two'] = periods[j + 6]

        ss.push(obj)
      }
      obj = {}
      obj['one'] = periods[5]
      ss.push(obj)

      return ss
    }
  },
  watch: {

  },
  methods: {
    selectSubject (subjects) {
      if (subjects && subjects.length > 0) {
        this.formData.kmbm = ''
        this.formData.subjs = ''
        this.formData.subjnames = ''
        subjects.reduce((temp, sub) => {
          this.formData.kmbm = this.formData.kmbm == '' ? sub.kmbm : this.formData.kmbm + ',' + sub.kmbm
          this.formData.subjs = this.formData.subjs == '' ? sub.id : this.formData.subjs + ',' + sub.id
          this.formData.subjnames = this.formData.subjnames == '' ? sub.codename : this.formData.subjnames + ',' + sub.codename
        }, '')
      }
    },
    openKm () {
      if (this.formData.subjs) {
        this.kmSelections = this.formData.subjs.split(',')
      }
      if (!this.formData.editStatus) {
        this.kmDialogVisible = true
      }
    },
    onSingleSubjectChange (kmid) {
      if (kmid) {
        this.formData.kmbm = ''
        this.formData.subjs = ''
        this.formData.subjnames = ''
        let subj = this.subSubjectRef.find(subj => subj.id === kmid)
        if (subj) {
          this.formData.kmbm = subj.kmbm
          this.formData.subjs = subj.id
          this.formData.subjnames = subj.codename
        }
      }
    },
    // onSubjectChange (subjIds) {
    //   if (subjIds && subjIds.length > 0) {
    //     this.formData.kmbm = ''
    //     subjIds.reduce((temp, sub) => {
    //         let subj = this.subSubjectRef.find(subj => subj.id === sub)
    //         if (subj) {
    //             this.formData.kmbm = this.formData.kmbm == ''? subj.kmbm : this.formData.kmbm + "," + subj.kmbm
    //             console.log(this.formData.kmbm);
    //         }
    //     }, '')
    //
    //   }
    // },
    saveData () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.srsx < this.formData.yjz) {
            this.$parent.errorMsg('预警值不能大于预警上限')
            return
          }
          if (this.formData.subjs) {
            this.formData.pk_accsubj = this.formData.subjs
          } else {
          }
          if (this.formData.has_history == 'Y') {
            let arr = []
            for (let variable in this.hisFormData) {
              if (this.hisFormData.hasOwnProperty(variable)) {
                arr.push({period: variable, occur_mny: this.hisFormData[variable]})
              }
            }
            this.formData.history = arr.length > 0 ? JSON.stringify(arr) : ''
          } else {
            this.formData.history = ''
          }

          this.formData.children = null
          this.showLoading()
          this.$api.BasicSettingApi.IncomeWarning.save(
            this.formData
          ).then(result => {
            this.closeLoading()
            if (result.success) {
              this.$emit('update:visible', false)
              this.$message.success('保存成功!')
              this.closeDialog()
              this.$emit('save', result.rows)
              this.$emit('refresh', result.rows)
            } else {
              this.$parent.errorMsg(result.msg)
            }
          }).catch(e => {
            this.closeLoading()
          })
        }
      })
    },
    onDialogOpen () {
      if (this.isEdit) {
        let formData = Object.assign({}, this.account)
        formData.subjnames = ''
        delete formData.code
        delete formData.name
        this.formData = formData

        if (this.formData.subjs) {
          this.formData.kmbm = ''
          this.formData.subjnames = ''
          let ss = this.formData.subjs.split(',')
          ss.reduce((temp, subid) => {
            let subj = this.subSubjectRef.find(subj => subj.id === subid)
            if (subj) {
              this.formData.kmbm = this.formData.kmbm == '' ? subj.kmbm : this.formData.kmbm + ',' + subj.kmbm
              this.formData.subjnames = this.formData.subjnames == '' ? subj.codename : this.formData.subjnames + ',' + subj.codename
            }
          }, '')
        }

        if (this.formData.has_history === '是') {
          this.formData.has_history = 'Y'
          this.formData.editHisFormStatus = true
          if (this.formData.children && this.formData.children.length > 0) {
            this.hisFormData = {}
            for (let i = 0; i < this.formData.children.length; i++) {
              let his = this.formData.children[i]
              this.hisFormData[his.period] = his.occur_mny
            }
          }
        } else {
          this.hisFormData = {}
          this.formData.editHisFormStatus = false
        }
      } else {
        let formData = Object.assign({})
        formData.subjnames = ''
        formData.isLoginRemind = 'N'
        formData.isInputRemind = 'N'
        formData.has_history = 'N'
        this.formData = formData
        this.hisFormData = {}
        this.formData.editHisFormStatus = false
      }
      if (this.formData.editStatus) {
        this.rules['subjnames'][0].required = false
      } else {
        this.rules['subjnames'][0].required = true
      }

      // 定位到第一行
      this.$nextTick(() => {
        this.$refs.xmmc_attr.focus()
      })
    },
    hisChange (val) {
      if (val && val === 'Y') {
        this.formData.editHisFormStatus = true
      } else {
        this.formData.editHisFormStatus = false
      }
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formData.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .table-bordered {
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
    border-spacing: 0;
  }
  .table-bordered>thead>tr>th {
    text-align: center;
  }
  .table-bordered>tbody>tr>td,
  .table-bordered>thead>tr>th {
    border: 1px solid #ddd;
    padding: 6px;
  }

  .form-container {
    overflow: auto;
  }
</style>
