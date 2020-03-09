<template>
  <div class="kj-container kj-card">
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
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">基本信息</div>
        <el-row >
          <el-col :span="8">
            <el-form-item label="工号" prop="code" >
              <el-input  v-model="formData.code" :disabled="true"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input  v-model="formData.name"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工类型" prop="billtype">
              <el-select  v-model="formData.billtype"  default-first-option  @change="yglxhandleChange" placeholder="请选择" :disabled="isEdit" style="width:174px">
                <el-option v-for="item in YGTYPE" :key="item.value" :label="item.label" :value="item.value" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item label="证照类型" prop="zjlx">
              <el-select  v-model="formData.zjlx" default-first-option @change="zjlxhandleChange" placeholder="请选择" style="width:174px">
                <el-option v-for="item in zjType" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证照号码" prop="zjbm">
              <el-input  v-model="formData.zjbm"  @change="zjhmhandleChange"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="vphone">
              <el-input  v-model="formData.vphone"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item label="国籍" prop="varea">
              <el-select  v-model="formData.varea" filterable default-first-option @change="vareahandleChange"  placeholder="请选择" style="width:174px">
                <el-option v-for="item in nationals" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="isex">
              <el-select  v-model="formData.isex" default-first-option placeholder="请选择" style="width:174px">
                <el-option v-for="item in SEXTYPE" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="birthdate">
              <el-date-picker v-model="formData.birthdate" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出生国家(地区)" prop="vbirtharea">
              <el-select  v-model="formData.vbirtharea" filterable default-first-option placeholder="请选择" style="width:174px">
                <el-option v-for="item in nationals" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">任职信息</div>
        <el-row >
          <el-col :span="8">
            <el-form-item label="任职受雇从业日期" prop="employedate">
              <el-date-picker v-model="formData.employedate" value-format="yyyy-MM-dd"  style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <div v-if="formData.zjlx === '身份证' || formData.zjlx === '护照'">
            <el-col :span="8">
              <el-form-item label="首次入境时间" prop="entrydate">
                <el-date-picker v-model="formData.entrydate" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计离境时间" prop="leavedate">
                <el-date-picker v-model="formData.leavedate" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </div>
          <div v-else>
            <el-col :span="8">
              <el-form-item label="首次入境时间" prop="entrydate" :rules="[{ required: true, message: '请录入首次入境时间', trigger: 'change' }]">
                <el-date-picker v-model="formData.entrydate" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计离境时间" prop="leavedate" :rules="[{ required: true, message: '请录入预计离境时间', trigger: 'change' }]">
                <el-date-picker v-model="formData.leavedate" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </div>

        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item label="部门" prop="cdeptid">
              <el-select  v-model="formData.cdeptid" filterable clearable
                          default-first-option placeholder="请选择"  style= "width:160px" >
                <el-option v-for="item in deptData" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id" style= "width:160px" >
                </el-option>
              </el-select>
              <i style="font-size:15px;color: #409EFF" class="el-icon-circle-plus" @click="addDept()"></i>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="vmemo">
              <el-input  v-model="formData.vmemo"  style="width:174px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <DeptDialog  v-show="dialogFormTitle==='部门档案'"  :visible.sync="dialogDeptFormVisible" :title="dialogFormTitle" :data="deptData" @save="onDeptSaved" ></DeptDialog>
  </div>
</template>

<script>
import DeptDialog from '../../components/DeptDialog'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'card',
  mixins: [MessageUtil, Loading],
  props: ['data'],
  components: {
    DeptDialog
  },
  data () {
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
    return {
      formData: {},
      rules: {
        code: [{ required: true, message: '请录入工号', trigger: 'blur' }],
        name: [{ required: true, message: '请录入姓名', trigger: 'blur' }],
        billtype: [{ required: true, message: '请录入员工类型', trigger: 'change' }],
        zjlx: [{ required: true, message: '请输入证件类型', trigger: 'change' }],
        zjbm: [{ required: true, message: '请输入证件号码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }],
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
      },
      dialogDeptFormVisible: false,
      dialogFormTitle: '',
      deptData: {},
      zjType: [],
      nationals: []
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
    },
    YGTYPE: {
      get () {
        return AUXILIARY_CONST.STAFF_TYPE
      }
    },
    SEXTYPE: {
      get () {
        return AUXILIARY_CONST.STAFF_SEX
      }
    },
    isEdit () {
      return this.data.id !== undefined
    }
  },
  mounted () {
    const formData = Object.assign({}, this.formInfo)
    if (formData.curOptType === 'new') {
      this.getbillo(AUXILIARY_CONST.AUXILIARY_TYPE.STAFF)
    } else {
      this.formData = formData
    }
    this.getAddress()
    this.getDeptData()
    this.getNationalArea()
  },
  methods: {
    saveInfo () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return
        }
        const saveHead = Object.assign({}, this.formData)
        const id = saveHead.id
        saveHead.pid = AUXILIARY_CONST.AUXILIARY_TYPE.STAFF
        let edit = 'add'
        if (id) {
          edit = 'edit'
        }
        const temp = {
          ...saveHead,
          type: edit,
          pk_corp: this.$parent.pk_corp,
          sourcename: '职员',
          id: id
        }
        this.loading(this, '正在保存...')
        this.$api.SalaryManageApi.StaffInfo.onSave(temp).then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg(result.msg)
            this.$parent.cardShow = false
            this.$parent.editStatus = false
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
    },
    addDept () {
      this.getbillo(AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT)
    },
    onDeptSaved (deptdata) {
      this.deptData.push(deptdata)
      this.formData.cdeptid = deptdata.id
      this.$set(this.formData, 'cdeptid', deptdata.id)
    },
    vareahandleChange (value) {
      if (!this.formData.vbirtharea) {
        this.formData.vbirtharea = value
      }
    },

    yglxhandleChange (newvalue) {
      this.getAddress()
      if (this.formData.billtype === '03') {
        this.formData.zjlx = '港澳居民来往内地通行证'
      } else {
        this.formData.zjlx = '身份证'
      }
      this.$refs.formRef.clearValidate()
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
          this.formData.letea = '中国香港'
          this.formData.vbirtharea = '中国香港'
        } else if (newvalue === '台湾居民来往大陆通行证' || newvalue === '台湾身份证') {
          this.formData.letea = '中国台湾'
          this.formData.vbirtharea = '中国台湾'
        } else {
          this.formData.letea = ''
          this.formData.vbirtharea = ''
        }
      }
      this.$refs.formRef.clearValidate()
    },
    getAddress () {
      if (this.formData.billtype === '03') {
        this.zjType = AUXILIARY_CONST.FOREIGN_CERTIFICATE_TYPE
      } else {
        this.zjType = AUXILIARY_CONST.CERTIFICATE_TYPE
      }
    },
    getbillo (id) {
      this.$api.SalaryManageApi.StaffInfo.getCode({
        id: id,
        pk_corp: this.$parent.pk_corp
      }).then(result => {
        if (result.success) {
          if (result.data) {
            if (id === AUXILIARY_CONST.AUXILIARY_TYPE.STAFF) {
              this.formData = { billtype: '01', isex: 1, zjlx: '身份证', varea: '中国', vbirtharea: '中国', employedate: this.$store.getters.getLoginDate }
              this.formData.code = result.data
            } else if (id === AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT) {
              this.deptData.code = result.data
              this.deptData.name = null
              this.dialogDeptFormVisible = true
              this.dialogFormTitle = '新增部门'
            }
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    getDeptData () {
      this.$api.SalaryManageApi.StaffInfo.queryB({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT,
        pk_corp: this.$parent.pk_corp
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            this.deptData = result.rows
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    getNationalArea: function getNationalArea () {
      const nationals = AUXILIARY_CONST.NATIONALITY
      this.nationals = nationals
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
    }
  }
}
</script>

<style scoped>

</style>
