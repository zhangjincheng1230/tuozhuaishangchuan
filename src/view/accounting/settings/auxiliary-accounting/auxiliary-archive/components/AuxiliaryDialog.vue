<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             @open="onDialogOpen"
             @opened="onDialogOpened"
             @close="onDialogClose"
             @closed="onDialogClosed"
             width="500px">
    <div class="form-container" :style="'max-height: ' + maxHeight +'px'">
      <el-form
        :model="formData"
        :rules="rules"
        :validate-on-rule-change="false"
        ref="formRef"
        label-width="150px">
        <el-form-item label="编码" prop="code" >
          <el-input v-model.trim="formData.code" autocomplete="off" style="width:220px" ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            ref="nameInput"
            @keyup.enter.native="nameKeyEnter"
            v-model.trim="formData.name" autocomplete="off" style="width:220px" ></el-input>
        </el-form-item>
        <template v-if="type === TYPE_CONST.CUSTOMER || type === TYPE_CONST.SUPPLIER">
          <el-form-item label="统一社会信用代码" prop="credit_code">
            <el-input v-model.trim="formData.credit_code" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model.trim="formData.address" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone_num">
            <el-input v-model.trim="formData.phone_num" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="bank">
            <el-input v-model.trim="formData.bank" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="账户" prop="account_num">
            <el-input
              @keyup.enter.native="save"
              v-model.trim="formData.account_num" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="type === TYPE_CONST.STAFF">
          <el-form-item label="员工类型" prop="billtype">
            <el-select v-model="formData.billtype" :disabled="isEdit"  @change="yglxhandleChange" style="width:220px">
              <el-option
                v-for="item in staffType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="证照类型"
            prop="zjlx">
            <el-select v-model="formData.zjlx"  style="width:220px" @change="zjlxhandleChange" >
              <el-option
                v-for="item in getAddress" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证照号码" prop="zjbm">
            <el-input v-model.trim="formData.zjbm" autocomplete="off" style="width:220px" @change="zjhmhandleChange"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="vphone">
            <el-input v-model.trim="formData.vphone" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="国籍" prop="varea">
            <el-select v-model="formData.varea" filterable default-first-option @change="vareahandleChange" style="width:220px">
              <el-option
                v-for="item in nationality"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="isex">
            <el-select v-model="formData.isex"  style="width:220px">
              <el-option
                v-for="item in staffSex"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthdate">
            <el-date-picker
              v-model="formData.birthdate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width:220px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任职受雇日期" prop="employedate">
            <el-date-picker
              v-model="formData.employedate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width:220px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出生国家(地区)" prop="vbirtharea">
            <el-select v-model="formData.vbirtharea" filterable style="width:220px">
              <el-option
                v-for="item in nationality"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="formData.zjlx === '' || formData.zjlx === '身份证' || formData.zjlx === '护照' || formData.zjlx === '其他' ">
              <el-form-item label="首次入境时间" prop="entrydate">
                <el-date-picker v-model="formData.entrydate" value-format="yyyy-MM-dd" style="width:220px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="预计离境时间" prop="leavedate">
                <el-date-picker v-model="formData.leavedate" value-format="yyyy-MM-dd" style="width:220px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
          </div>
          <div v-else>
              <el-form-item label="首次入境时间" prop="entrydate" :rules="[{ required: true, message: '请录入首次入境时间', trigger: 'change' }]">
                <el-date-picker v-model="formData.entrydate" value-format="yyyy-MM-dd" style="width:220px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="预计离境时间" prop="leavedate" :rules="[{ required: true, message: '请录入预计离境时间', trigger: 'change' }]">
                <el-date-picker v-model="formData.leavedate" value-format="yyyy-MM-dd" style="width:220px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
          </div>
          <el-form-item label="部门" prop="vdeptname">
            <el-select v-model="formData.vdeptname" filterable  style="width:220px">
              <el-option
                v-for="item in departmentData"
                :key="item.id"
                :label="item.code + ' ' + item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="vmemo">
            <el-input @keyup.enter.native="save" v-model.trim="formData.vmemo" autocomplete="off"  style="width:220px"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="type === TYPE_CONST.INVENTORY">
          <el-form-item label="规格(型号)" prop="spec">
            <el-input v-model.trim="formData.spec" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model.trim="formData.unit" autocomplete="off" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="结算单价" prop="jsprice">
            <el-input-number
              @keyup.enter.native="save"
              v-model="formData.jsprice" :precision=pricePre :controls="false"  :min="-99999999" :max="999999999" style="width:220px"  ></el-input-number>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
const customerRules = {
  credit_code: [
    { min: 0, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
  ],
  address: [
    { min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
  ],
  phone_num: [
    { min: 0, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  bank: [
    { min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
  ],
  account_num: [
    { min: 0, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}
const staffRules = {
  code: [{ required: true, message: '请录入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请录入姓名', trigger: 'blur' }],
  billtype: [{ required: true, message: '请录入员工类型', trigger: 'change' }],
  zjlx: [{ required: true, message: '请输入证件类型', trigger: 'change' }],
  vphone: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value) {
          const phonepattern = '^(1[3-9][0-9])\\d{8}$'
          const r = value.match(phonepattern)
          if (r === null) {
            callback(new Error('手机号码格式不正确!'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  varea: [{ required: true, message: '请录入国籍', trigger: 'change' }],
  isex: [{ required: true, message: '请录入性别', trigger: 'change' }],
  birthdate: [{ required: true, message: '请录入出生日期', trigger: 'change' }],
  vbirtharea: [{ required: true, message: '请录入出生国家(地区)', trigger: 'change' }],
  employedate: [{ required: true, message: '请录入任职受雇日期', trigger: 'change' }]
}
const inventoryRules = {
  unit: [
    { required: true, message: '请输入计量单位', trigger: 'blur' }
  ]
}
export default {
  name: 'AuxiliaryDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formData: {},
      labelPosition: 'top',
      TYPE_CONST: AUXILIARY_CONST.AUXILIARY_TYPE,
      staffType: AUXILIARY_CONST.STAFF_TYPE,
      staffSex: AUXILIARY_CONST.STAFF_SEX,
      certificateType: AUXILIARY_CONST.CERTIFICATE_TYPE,
      nationality: AUXILIARY_CONST.NATIONALITY,
      pricePre: this.$store.getters.pricePre,
      departmentData: []
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
    isEdit () {
      return this.data.id !== undefined
    },
    title () {
      return '新增'
    },
    typeName () {
      return this.$store.state.accounting.auxiliaryTypes.find(row => row.id === this.type).name
    },
    staffRequired () {
      return this.formData.billtype !== '05'
    },
    rules () {
      let rules = {
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
      const validatePass = (rule, value, callback) => {
        const zjlx = this.formData.zjlx
        if (zjlx && value) {
          if (zjlx === '身份证') {
            const idpattern = '^((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)[0-9]{4})(([1|2][0-9]{3}[0|1][0-9][0-3][0-9][0-9]{3}[Xx0-9])|([0-9]{2}[0|1][0-9][0-3][0-9][0-9]{3}))$'
            const r = value.match(idpattern)
            if (r === null) {
              callback(new Error('居民身份证号不合规范!'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
      switch (this.type) {
        case this.TYPE_CONST.CUSTOMER:
        case this.TYPE_CONST.SUPPLIER:
          rules = Object.assign(rules, customerRules)
          break
        case this.TYPE_CONST.STAFF:
          if (this.staffRequired) {
            rules = Object.assign(rules, {
              billtype: [
                { required: true, message: '请选择员工类型', trigger: 'change' }
              ],
              zjbm: [{ required: true, message: '请输入证件号码', trigger: 'blur' },
                { validator: validatePass, trigger: 'blur' }]
            }, staffRules)
          }
          break
        case this.TYPE_CONST.INVENTORY:
          rules = Object.assign(rules, inventoryRules)
          break
        default:
          break
      }
      return rules
    },
    getAddress () {
      if (this.formData.billtype === '03') {
        return AUXILIARY_CONST.FOREIGN_CERTIFICATE_TYPE
      } else {
        return AUXILIARY_CONST.CERTIFICATE_TYPE
      }
    }
  },
  methods: {
    getNewCode () {
      this.$api.BasicSettingApi.Auxiliary.getNewCode({
        id: this.type
      }).then(result => {
        this.formData.code = result.data
      })
    },
    fetchDepartmentData () {
      let id = AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT
      this.$api.BasicSettingApi.Auxiliary.queryArchive({id: id}).then(res => {
        if (res.success) {
          this.departmentData = res.rows
        }
      })
    },
    getDefaultFormData () {
      let formData = {
        code: '',
        pid: this.type
      }
      if (this.type === this.TYPE_CONST.STAFF) {
        formData.billtype = '05'
        formData.zjlx = '其他'
        formData.varea = '中国'
        formData.vbirtharea = '中国'
        formData.isex = 1
      }
      return formData
    },
    save () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.Auxiliary.saveArchive({
            ...this.formData,
            sourcename: this.typeName,
            type: this.isEdit ? 'edit' : 'add'
          }).then(result => {
            if (result.success) {
              this.$emit('save', result.rows)
              if (this.isEdit) {
                this.closeDialog()
              } else {
                this.formData = this.getDefaultFormData()
                this.getNewCode()
                this.$refs.nameInput.focus()
              }
            } else {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'success',
                dangerouslyUseHTMLString: true
              })
            }
          })
        }
      })
    },
    nameKeyEnter () {
      if (this.type !== this.TYPE_CONST.CUSTOMER && this.type !== this.TYPE_CONST.SUPPLIER &&
        this.type !== this.TYPE_CONST.INVENTORY && this.type !== this.TYPE_CONST.STAFF) {
        this.save()
      }
    },
    onDialogOpen () {
      if (!this.isEdit) {
        let formData = this.getDefaultFormData()
        if (this.type === this.TYPE_CONST.STAFF) {
          this.fetchDepartmentData()
        }
        this.formData = formData
        this.getNewCode()
      } else {
        this.formData = Object.assign({}, this.data)
      }
    },
    onDialogOpened () {
      this.$refs.nameInput.focus()
    },
    yglxhandleChange (newvalue) {
      if (this.formData.billtype === '03') {
        this.formData.zjlx = '港澳居民来往内地通行证'
        this.formData.varea = '中国香港'
        this.formData.vbirtharea = '中国香港'
      } else {
        this.formData.zjlx = '身份证'
        this.formData.varea = '中国'
        this.formData.vbirtharea = '中国'
      }
      this.formData.isex = 1
      this.formData.employedate = this.$store.getters.getLoginDate
      this.$refs.formRef.clearValidate()
    },
    vareahandleChange (value) {
      if (!this.formData.vbirtharea) {
        this.formData.vbirtharea = value
      }
    },
    zjhmhandleChange (newvalue) {
      const zjlx = this.formData.zjlx
      const len = newvalue.length
      if (zjlx === '身份证' && len === 18) {
        this.formData.isex = this.IdCard(newvalue, 2)
        this.formData.birthdate = this.IdCard(newvalue, 1)
      } else {

      }
    },
    zjlxhandleChange (newvalue) {
      if (newvalue === '身份证' || newvalue === '护照') {
        this.formData.letea = '中国'
        this.formData.vbirtharea = '中国'
        if (this.formData.zjbm) {
          const zjbm = self.formData.zjbm
          const len = zjbm.length
          if (newvalue === '身份证' && len === 18) {
            this.formData.isex = this.IdCard(zjbm, 2)
            this.formData.birthdate = this.IdCard(zjbm, 1)
          } else {

          }
        }
      } else {
        if (newvalue === '港澳居民居住证' || newvalue === '港澳居民来往内地通行证') {
          this.formData.varea = '中国香港'
          this.formData.vbirtharea = '中国香港'
        } else if (newvalue === '台湾居民来往大陆通行证' || newvalue === '台湾身份证') {
          this.formData.varea = '中国台湾'
          this.formData.vbirtharea = '中国台湾'
        } else {
          this.formData.varea = ''
          this.formData.vbirtharea = ''
        }
      }
      this.$refs.formRef.clearValidate()
    },
    IdCard (idCard, num) {
      if (num === 1) {
        // 获取出生日期
        var birth = idCard.substring(6, 10) + '-' + idCard.substring(10, 12) + '-' + idCard.substring(12, 14)
        return birth
      }
      if (num === 2) {
        // 获取性别
        if (parseInt(idCard.substr(16, 1)) % 2 === 1) {
          // 男
          return 1
        } else if (parseInt(idCard.substr(16, 1)) % 2 === 0) {
          // 女
          return 2
        } else {
          return ''
        }
      }
      if (num === 3) {
        // 获取年龄
        const myDate = new Date()
        const month = myDate.getMonth() + 1
        const day = myDate.getDate()
        let age = myDate.getFullYear() - idCard.substring(6, 10) - 1
        if (idCard.substring(10, 12) < month || (idCard.substring(10, 12) === month && idCard.substring(12, 14) <= day)) {
          age++
        }
        return age
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
>>> .el-dialog__body {
  padding: 0;
}
.form-container {
  padding: 10px 15px;
  overflow: auto;
}
</style>
