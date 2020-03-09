<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="onDialogOpen"
      @opened="onDialogOpened"
      @close="onDialogClose"
      @closed="onDialogClosed"
      v-loading="loading"
      :element-loading-text="loadingText"
      :element-loading-spinner="loadingSpinner"
      width="450px">
      <div class="form-container" :style="'height: ' + maxHeight +'px'">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="110px">
          <el-form-item label="科目编码" prop="kmbm">
            <el-input v-model.trim="formData.kmbm" @change="onCodeChange" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="科目名称" prop="kmmc">
            <el-input v-model.trim="formData.kmmc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上级科目">
            <el-input v-model="parentSubject" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="科目类型">
            <el-select v-model="formData.kmlx" disabled
                       placeholder="请选择" style="width: 100%">
              <el-option
                v-for="category in categories"
                :key="category.value"
                :label="category.label"
                :value="category.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科目方向">
            <el-select v-model="formData.kmfx" disabled
                       placeholder="请选择" style="width: 100%">
              <el-option
                v-for="direction in directions"
                :key="direction.value"
                :label="direction.label"
                :value="direction.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="辅助核算">
            <el-checkbox v-model="enableAuxiliary" @change="onAuxiliaryCheck"></el-checkbox>
          </el-form-item>
          <el-form-item label="" v-if="enableAuxiliary">
            <el-checkbox-group
              v-model="auxiliary">
              <el-checkbox v-for="item in auxiliaryTypes" :label="item.code" :key="item.code">{{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="数量核算">
            <el-checkbox
              v-model="formData.sfsz"
              @change="onNumberCheck"
              true-label="是"
              false-label="否"></el-checkbox>
          </el-form-item>
          <el-form-item label="计量单位" v-if="formData.sfsz === '是'">
            <el-input v-model.trim="formData.jldw" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="外汇核算">
            <el-checkbox
              v-model="formData.whhs"
              :disabled="currencyDisable"
              true-label="是"
              false-label="否"></el-checkbox>
          </el-form-item>
          <template v-if="formData.whhs === '是'">
            <el-form-item label="外汇核算币种">
              <el-input
                v-model="formData.whhsmc"
                :readonly="true">
                <template #suffix>
                  <i
                    @click="currencyDialogVisible = true"
                    class="el-input__icon el-icon-search" style="cursor: pointer">
                  </i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="不汇兑调整">
              <el-checkbox
                v-model="formData.unhdtz"
                true-label="是"
                false-label="否"></el-checkbox>
            </el-form-item>
          </template>
          <el-form-item label="发生额方向控制">
            <el-checkbox
              v-model="formData.fsefxkz"
              true-label="是"
              false-label="否"></el-checkbox>
          </el-form-item>
          <el-form-item label="余额方向控制">
            <el-checkbox
              v-model="formData.yefxkz"
              true-label="是"
              false-label="否"></el-checkbox>
          </el-form-item>
          <el-form-item label="往来核销">
            <el-checkbox
              v-model="formData.wlhx"
              :disabled="verifyDisable"
              true-label="是"
              false-label="否"></el-checkbox>
          </el-form-item>
          <el-form-item label="非现金科目" v-if="showCashSetting">
            <el-checkbox
              v-model="formData.unxjkm"
              :disabled="verifyDisable"
              true-label="是"
              false-label="否"></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="saveData">保 存</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="confirmDialogVisible"
      @open="onConfirmDialogOpen"
      @close="onConfirmDialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="450px">
      <div>
        您正在为科目
        <span style="color: red;">{{parentSubject}}</span>
        增加第一个下级科目，系统将把该科目的数据全部转移到新增的下级科目中，
        <span style="color: red;">该流程不可逆</span>，是否要继续?
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="doSaveData"
            :disabled="confirmButtonDisable">
            {{confirmButtonText}}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <CurrencyDialog
      :visible.sync="currencyDialogVisible"
      :single-select="false"
      :default-selection="currency"
      :fixed-selection="fixedCurrencyIdArray"
      @unselect-fixed="modifyFixedCurrencyWarning"
      @select="onSelectCurrency">
    </CurrencyDialog>
  </div>
</template>

<script>
import loadingMixin from '@/mixins/loading'
import {CATEGORY} from '@/constants/subject'
import {DIRECTIONS, SUBJECT_AUXILIARY_DEFAULT} from '@/constants'
import CurrencyDialog from '@/components/reference/CurrencyDialog'

export default {
  name: 'SubjectEditDialog',
  components: {
    CurrencyDialog
  },
  mixins: [loadingMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    subject: {
      type: Object
    }
  },
  data () {
    return {
      fields: ['kmbm', 'kmmc', 'kmlx', 'kmfx', 'sfsz',
        'jldw', 'whhs', 'whhsid', 'whhsbm', 'whhsmc', 'unhdtz', 'fsefxkz', 'yefxkz', 'wlhx', 'gsid', 'unxjkm'],
      formData: {
        whhs: '否'
      },
      parentSubject: '无上级科目',
      enableAuxiliary: false,
      auxiliary: [],
      categories: CATEGORY,
      directions: DIRECTIONS,
      currencyDisable: false,
      verifyDisable: false,
      intervalId: null,
      confirmDialogVisible: false,
      confirmButtonText: '确定',
      checkCache: {
        beginData: null
      },
      currencyDialogVisible: false,
      rules: {
        kmbm: [
          {required: true, message: '请输入科目编码', trigger: 'blur'}
        ],
        kmmc: [
          {required: true, message: '请输入科目名称', trigger: 'blur'},
          {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
        ]
      }
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
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    title () {
      return this.isEdit ? '修改科目' : '新增科目'
    },
    codeRuleArray () {
      const ruleArray = this.$store.getters.getSubjectCodeRule.split('/')
      return ruleArray.map(val => Number((val)))
    },
    showCashSetting () {
      let cashSubject = '1012'
      let corpType = this.$store.getters.getLoginCorp.ctype
      if (corpType === '00000100AA10000000000BMQ' || corpType === '00000100000000Ig4yfE0005') {
        cashSubject = '1009'
      }
      return this.formData.kmbm && this.formData.kmbm.startsWith(cashSubject)
    },
    currency () {
      return this.formData.whhsid ? this.formData.whhsid.split(',') : []
    },
    confirmButtonDisable () {
      return this.confirmButtonText !== '确定'
    },
    fixedCurrencyIdArray () {
      return this.checkCache.currencyRefId
    }
  },
  created () {
  },
  methods: {
    getNewCode (code, level) {
      this.$api.BasicSettingApi.Subject.getNewCode({
        code,
        level
      }).then(result => {
        this.formData.kmbm = result.data
      })
    },
    onDialogOpen () {
      const formData = {}
      this.parentSubject = '无上级科目'
      if (this.subject) {
        this.fields.forEach(field => {
          formData[field] = this.subject[field]
        })
        formData.whhs = this.subject.whhs === '是' ? '是' : '否'
        if (this.isEdit) {
          formData.id = this.subject.id
          if (this.subject.kmcc === 1) {
            this.parentSubject = '无上级科目'
          } else {
            let kmcc = this.subject.kmcc - 1
            const parentSubject = this.$store.state.accounting.subjectRefData
              .find(item => this.subject.kmbm.startsWith(item.kmbm) && item.kmcc === kmcc)
            this.parentSubject = parentSubject.codefullname
          }
          formData.id = this.subject.id
        } else {
          this.parentSubject = this.subject.kmbm + ' ' + this.subject.kmmc
          formData.kmbm = ''
          formData.kmmc = ''
        }
        this.enableAuxiliary = this.subject.isfzhs !== SUBJECT_AUXILIARY_DEFAULT
        this.auxiliary = this.getAuxiliaryArray(this.subject.isfzhs)
        this.formData = formData
        if (this.isEdit) {
          this.checkOnEdit()
        } else {
          this.getNewCode(this.subject.kmbm, this.subject.kmcc)
        }
      } else {
        this.formData = {}
      }
    },
    onDialogOpened () {
      this.$el.querySelector('.form-container').scrollTop = 0
    },
    saveData () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            this.showLoading('保存中...')
            this.$api.BasicSettingApi.Subject.checkParentRef({
              code: this.formData.kmbm
            }).then(res => {
              if (res.success) {
                this.closeLoading()
                if (res.data) {
                  this.confirmDialogVisible = true
                } else {
                  this.doSaveData()
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.doSaveData()
          }
        }
      })
    },
    doSaveData () {
      this.showLoading('保存中...')
      this.confirmDialogVisible = false
      let api = this.isEdit ? this.$api.BasicSettingApi.Subject.updateSubject
        : this.$api.BasicSettingApi.Subject.saveSubject
      api(this.getSaveData()).then(result => {
        this.closeLoading()
        if (result.success) {
          this.$emit('save', result.rows)
          this.closeDialog()
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    getSaveData () {
      let data = {...this.formData}
      if (data.whhs !== '是') {
        delete data.whhsid
        delete data.whhsbm
        delete data.whhsmc
      }
      if (this.enableAuxiliary) {
        data.isfzhs = this.getAuxiliarySetting()
      } else {
        data.isfzhs = SUBJECT_AUXILIARY_DEFAULT
      }
      return data
    },
    getAuxiliarySetting () {
      let strArray = [...SUBJECT_AUXILIARY_DEFAULT]
      this.auxiliary.forEach(code => (strArray[code - 1] = '1'))
      return strArray.join('')
    },
    getAuxiliaryArray (settingStr) {
      if (!settingStr) {
        settingStr = SUBJECT_AUXILIARY_DEFAULT
      }
      let strArray = [...settingStr]
      const array = []
      strArray.forEach((check, index) => {
        if (check === '1') {
          array.push(index + 1)
        }
      })
      return array
    },
    onCodeChange (code) {
      if (this.checkCodeRule(code)) {
        const parentSubject = this.findParentSubject(code)
        if (parentSubject) {
          this.parentSubject = parentSubject.codefullname
          this.formData.kmlx = parentSubject.kmlx
          this.formData.kmfx = parentSubject.kmfx
        } else {
          this.parentSubject = '无上级科目'
        }
      } else {
        this.$message.error('当前编码不符合科目编码规则')
      }
    },
    checkOnEdit () {
      this.$api.BasicSettingApi.Subject.checkOnEdit({
        id: this.subject.id,
        kmbm: this.subject.kmbm,
        whhs: this.subject.whhs
      }).then(res => {
        if (res.success) {
          this.checkCache = res.data
          if (this.checkCache.currencyRef) {
            this.currencyDisable = true
          }
          if (this.checkCache.parentVerification) {
            this.verifyDisable = true
          }
        }
      })
    },
    onNumberCheck (val) {
      if (this.isEdit && val !== this.subject.sfsz && this.checkCache.ref) {
        let val = this.formData.sfsz
        let msg = val === '是' ? '科目已经使用,是否继续修改?'
          : ' 科目已经使用,取消数量核算将无法查询之前录入的数量,也不能查询数量账簿,是否修改,请确认'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).catch(() => {
          this.formData.sfsz = val === '是' ? '否' : '是'
        })
      }
    },
    onAuxiliaryCheck (val) {
      if (this.isEdit) {
        if (val && this.subject.yz !== '是') {
          this.$message.error('非末级科目不能添加辅助核算')
          this.enableAuxiliary = false
        } else if (val !== (this.subject.isfzhs !== SUBJECT_AUXILIARY_DEFAULT) &&
          this.checkCache.ref) {
          this.$confirm('该科目已有数据发生，是否继续修改?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).catch(() => {
            this.enableAuxiliary = !val
          })
        }
      }
    },
    checkCodeRule (code) {
      const ruleArray = this.codeRuleArray
      let valid = true
      const codeLen = code.length
      let count = 0
      for (let i = 0; i < ruleArray.length; i++) {
        count += ruleArray[i]
        if (count === codeLen) {
          break
        } else if (count > codeLen) {
          valid = false
          break
        }
      }
      if (codeLen < count) {
        valid = false
      }
      return valid
    },
    findParentSubject (code) {
      const ruleArray = this.codeRuleArray
      let parentLevel = 0
      const codeLen = code.length
      let count = 0
      for (let i = 0; i < ruleArray.length; i++) {
        count += ruleArray[i]
        if (count === codeLen) {
          parentLevel = i
          break
        }
      }
      let parentSubject
      if (parentLevel === 0) {
        parentSubject = null
      } else {
        parentSubject = this.$store.state.accounting.subjectRefData.find(item => code.startsWith(item.kmbm) &&
          item.kmcc === parentLevel)
      }
      return parentSubject
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.currencyDisable = false
      this.verifyDisable = false
      this.checkCache = {}
      this.$refs.formRef.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    },
    onConfirmDialogOpen () {
      let numberShow = 5
      this.confirmButtonText = numberShow + 's'
      let intervalId = setInterval(() => {
        numberShow--
        this.confirmButtonText = numberShow + 's'
        if (numberShow <= 0) {
          this.confirmButtonText = '确定'
          clearInterval(intervalId)
          this.intervalId = null
        }
      }, 1000)
      this.intervalId = intervalId
    },
    onConfirmDialogClose () {
      if (this.intervalId != null) {
        clearInterval(this.intervalId)
      }
    },
    modifyFixedCurrencyWarning () {
      this.$message.warning('币种被期初或凭证引用,不能修改')
    },
    onSelectCurrency (currencies) {
      let idArray = []
      let codeArray = []
      let nameArray = []
      currencies.forEach(currency => {
        idArray.push(currency.id)
        codeArray.push(currency.code)
        nameArray.push(currency.name)
      })
      this.formData.whhsid = idArray.join(',')
      this.formData.whhsbm = codeArray.join(',')
      this.formData.whhsmc = nameArray.join(',')
    }
  }
}
</script>
<style scoped>
  .form-container {
    padding-right: 10px;
    overflow: auto;
  }
</style>
