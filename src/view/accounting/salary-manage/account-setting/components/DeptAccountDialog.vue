<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="960px">
    <el-form :model="formData" ref="formRef">
      <el-table  :data="formData.rows"  :height=height  class="edit-table"  style="width: 100%">
        <el-table-column  label="序号" prop="index"   align="center"  width="50">
          <template #default="{ row, $index }">
            <div class="row-operate">
              <i class="el-icon-circle-plus-outline" title="增行"  @click="addRow($index)"></i>
              <i class="el-icon-remove-outline" title="删行" @click="delRow($index)"></i>
            </div>
            {{ ($index + 1) }}
          </template>
        </el-table-column>
        <el-table-column label="部门编码"  prop="vdeptcode" class-name="" size="mini" header-align ="center" align ="center" width="100" >
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.vdeptcode'">
              <el-input v-model.trim="row.vdeptcode" :disabled="true"></el-input>
            </TableFormItem>
          </template>
        </el-table-column>
        <el-table-column label="部门名称"  prop="cdeptid" header-align ="center" align ="center" width="165">
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.cdeptid'" :rules="rules.cdeptid">
              <el-select  style="width: 130px"  v-model="row.cdeptid" filterable @change="depthandleChange($index,row)" default-first-option placeholder="请选择"  size="mini">
                <el-option v-for="item in deptData" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id" style="width: 130px" >
                </el-option>
              </el-select>
            </TableFormItem>
            <i style="font-size:15px;color: #409EFF;position: absolute;z-index: 9999; margin-left:80px;top:10px;" class="el-icon-circle-plus" @click="addDept($index)"></i>
          </template>
        </el-table-column>
        <el-table-column label="科目名称"  prop="ckjkmid"  header-align ="center" align ="center" width="450">
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.ckjkmid'" :rules="rules.ckjkmid">
              <el-select v-model="row.ckjkmid" filterable  default-first-option @change="kmhandleChange($index,row)"
                         placeholder="请选择" size="small"  style="width:410px">
                <el-option v-for="item in accountdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                  <span style="float: left">{{ item.codefullname }}</span>
                </el-option>
              </el-select>
            </TableFormItem>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" header-align ="center" align ="center" width="150">
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.memo'" :rules="rules.memo">
              <el-input v-model.trim="row.memo"></el-input>
            </TableFormItem>
          </template>
        </el-table-column>
        <template slot="empty">
          <div>
            <img style="margin: 10px auto; display: block;" src="../../../../../assets/img/data_empty.png"
                 alt="">
            <p style="margin: 10px auto; display: block;">暂无相关数据，点击下方按钮快速新增</p>
            <el-button size="mini" type="primary" style="margin: 10px auto; display: block;" @click="addRow(0)">新增
            </el-button>
          </div>
        </template>
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size ="small" @click="dialogSave">确 定</el-button>
      </div>
    </template>
    <DeptDialog  v-show="dialogFormTitle==='部门档案'"  :visible.sync="dialogDeptFormVisible" :title="dialogFormTitle" :data="deptData" :indexRow="indexRow" @save="onDeptSaved" ></DeptDialog>
  </el-dialog>
</template>
<script>
import TableFormItem from '@/components/TableFormItem/index'
import DeptDialog from '../../components/DeptDialog'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'DeptAccountDialog',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
    TableFormItem,
    DeptDialog
  },
  props: ['visible', 'title', 'data'],
  data () {
    return {
      height: 0,
      deptData: [],
      accountdata: [],
      rules: {
        cdeptid: [{required: true, message: '请选择部门', trigger: 'change'}],
        ckjkmid: [{required: true, message: '请选择科目', trigger: 'change'}],
        memo: [{min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}]
      },
      dialogDeptFormVisible: false,
      dialogFormTitle: '',
      indexRow: -1
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
    dialogTitle: {
      get () {
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    },
    formData: {
      get () {
        return {
          rows: this.data
        }
      }
    }
  },
  created () {
    this.height = window.innerHeight - 390
    this.getdeptdata()
  },
  mounted () {
  },
  methods: {
    refreshData () {
      this.getdeptdata()
    },
    dialogSave () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.formData || !this.formData.rows || this.formData.rows.length === 0) {
          this.errorMsg('部门费用设置数据不能为空！')
          return
        }
        const temp = { kmdata: JSON.stringify(this.formData.rows) }
        this.showLoading('正在保存...')
        this.$api.SalaryManageApi.AccountSetting.saveFyKm(temp).then(result => {
          this.closeLoading()
          if (result.success) {
            this.onDialogClose()
            this.successMsg('保存部门费用成功!')
            this.$parent.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      })
    },
    addRow (index) {
      this.formData.rows.splice(index + 1, 0, {})
    },
    delRow (index) {
      this.formData.rows.splice(index, 1)
    },
    kmhandleChange (index, row) {
      const newvalue = row.ckjkmid
      const km = this.accountdata.find(item => item.id === newvalue)
      if (row) { this.formData.rows[index].kjkmcode = km.kmbm }
    },
    getdeptdata () {
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
    depthandleChange (index, row) {
      const newvalue = row.cdeptid
      const dept = this.deptData.find(item => item.id === newvalue)
      if (row) {
        this.formData.rows[index].vdeptcode = dept.code
        this.formData.rows[index].cdeptid = dept.id
      }
    },
    addDept (row) {
      this.getbillo(AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT, row)
    },
    onDeptSaved (deptdata, row) {
      if (deptdata.id) {
        this.deptData.push(deptdata)
        this.$set(this.formData.rows[row], 'vdeptcode', deptdata.code)
        this.$set(this.formData.rows[row], 'cdeptid', deptdata.id)
      }
    },
    getbillo (id, row) {
      this.$api.SalaryManageApi.StaffInfo.getCode({
        id: id,
        pk_corp: this.$parent.pk_corp
      }).then(result => {
        if (result.success) {
          if (result.data) {
            this.deptData.code = result.data
            this.deptData.name = null
            this.dialogDeptFormVisible = true
            this.dialogFormTitle = '新增部门'
            this.indexRow = row
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    onDialogOpen () {
      this.accountdata = this.$parent.kmdata
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.closeDialog()
    },
    closeDialog () {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
<style scoped>
  >>>.el-table__empty-text {
    visibility: visible;
  }
</style>
