<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @open="onDialogOpen"
             @close="onDialogClose"
             @closed="onDialogClosed"
             width="510px">
    <div class="form-container" :style="'max-height: ' + maxHeight +'px'">
      <el-form
        :model="formData"
        :rules="rules"
        :validate-on-rule-change="false"
        ref="formRef"
        label-width="120px">
        <el-form-item  label="存货名称"  prop="spmc">
          <template slot-scope="scope">
            <el-select  v-model="formData.spmc" filterable ref="invselect"  @change="bmHandleChange" :disabled="disabled"
                        default-first-option placeholder="请选择存货" style="width:220px">
              <el-option  v-for="item in invData" :key="item.id" :label="item.spmc" :value="item.id" style="width:300px">
                <span style="float: left">{{ item.fullname }}</span>
              </el-option>
              <template slot="prefix">
                <i @click.stop="openInv" class="el-icon-search"></i>
              </template>
            </el-select>
          </template>
          </el-form-item>
          <el-form-item  label="规格(型号)"  prop="gg">
            <el-input v-model="formData.gg" :disabled="true"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item  label="计量单位"  prop="jldwmc">
            <el-input v-model="formData.jldwmc" :disabled="true"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item  label="科目编码"  prop="kmbm">
            <el-input v-model="formData.kmbm" :disabled="true"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item  label="科目名称"  prop="kmmc">
            <el-input v-model="formData.kmmc" :disabled="true"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item  label="存货分类"  prop="splxmc">
            <el-input v-model="formData.splxmc" :disabled="true"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item  label="数量"  prop="sl">
            <el-input-number v-model="formData.sl" :precision=numPre :controls =false style="width:220px;" ></el-input-number>
          </el-form-item>
          <el-form-item  label="成本"  prop="cb">
            <el-input-number v-model="formData.cb" :precision="2" :controls =false  style="width:220px;" ></el-input-number>
          </el-form-item>
          <el-form-item  label="备注"  prop="bz">
            <el-input v-model="formData.bz" style="width:220px"></el-input>
          </el-form-item>
      </el-form>
      <InventoryRefDialog :visible.sync="dialogInvVisible"  :appendToBody="true"  :queryData="queryData" single-select select-first @selected="handleInvSelect"></InventoryRefDialog>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import * as IcbillManageConst from '../../icbill-manage-const'
import InventoryRefDialog from '@/components/reference/InventoryRefDialog'
import refreshDataMixin from '@/mixins/refresh-data'
import loadingMixin from '@/mixins/loading'
import * as MsgUtil from '../../../msg-util'
export default {
  name: 'InventoryInitDialog',
  mixins: [refreshDataMixin, loadingMixin],
  components: {
    InventoryRefDialog
  },
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
    title: {
      type: String,
      default: '新增'
    }
  },
  data () {
    return {
      formData: {},
      invData: [],
      disabled: false,
      dialogInvVisible: false,
      numPre: this.$store.getters.numPre
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
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    },
    rules () {
      let rules = {
        spmc: [
          { required: true, message: '请选择存货', trigger: 'blur' }
        ],
        sl: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        cb: [
          { required: true, message: '请输入成本', trigger: 'blur' }
        ]
      }
      return rules
    },
    queryData: {
      get () {
        return {isshow: 'N'}
      }
    }
  },
  mounted: function mounted () {
    this.fetchCh()
  },
  methods: {
    refreshData () {
      this.fetchCh()
    },
    fetchCh () {
      this.$api.InventoryManageApi.IcsetInventory.queryBParam({}).then(res => {
        if (res.rows) {
          this.invData = IcbillManageConst.invDataFullName(res.rows)
        }
      })
    },
    bmHandleChange (newValue) {
      const row = this.invData.find(item => item.id === newValue)
      if (row) {
        this.changeInv(row)
      }
    },
    changeInv (row) {
      this.formData = Object.assign({}, row)
      this.formData.spid = row.id
      this.formData.bz = null
      this.formData.jldwmc = row.jldw
      this.formData.gg = row.gg
      this.formData.gsid = this.$parent.pk_corp
      this.formData.id = null
    },
    save () {
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.InventoryManageApi.IcsetInit.saveInfo({
            ...this.formData
          }).then(result => {
            this.closeLoading()
            if (result.success) {
              this.$emit('save', result.rows)
              this.closeDialog()
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
          })
        } else {
          this.closeLoading()
        }
      })
    },
    openInv () {
      this.$refs.invselect.handleClose()
      this.dialogInvVisible = true
    },
    handleInvSelect (invData) {
      if (invData) {
        this.changeInv(invData)
        this.$refs.formRef.clearValidate() // 移除校验结果
      }
    },
    onDialogOpen () {
      this.formData = Object.assign({}, this.data)
      if (this.formData.id) {
        this.disabled = true
      } else {
        this.disabled = false
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
