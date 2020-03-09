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
        label-width="100px">
        <el-form-item label="存货名称" prop="chid">
          <el-select  v-model="formData.chid" filterable @change="bmHandleChange" :disabled="disabled"
            default-first-option placeholder="请选择" style="width:220px">
            <el-option v-for="item in invData" :key="item.id" :label="item.name" :value="item.id" style="width:300px">
              <span style="float: left">{{ item.fullname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存货类别" prop="chlb" v-if="showDetail">
          <el-input v-model.trim="formData.chlb" autocomplete="off" :disabled="true"  style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="规格(型号)" prop="spec">
          <el-input v-model.trim="formData.spec" autocomplete="off" :disabled="true"  style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="jldw">
          <el-input v-model.trim="formData.jldw" autocomplete="off"  :disabled="true"  style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="qcsl">
          <el-input-number v-model="formData.qcsl" :precision=numPre :controls =false @change="slhandleChange" style="width:220px" ></el-input-number>
        </el-form-item>
        <el-form-item label="单价" prop="qcdj">
          <el-input-number v-model="formData.qcdj" :precision=pricePre :controls =false @change="djhandleChange" style="width:220px" ></el-input-number>
        </el-form-item>
        <el-form-item label="金额" prop="qcje">
          <el-input-number v-model="formData.qcje" :precision="2" :controls =false @change="jehandleChange" style="width:220px" ></el-input-number>
        </el-form-item>
        <el-form-item label="启用日期" prop="opdate">
          <el-input v-model.trim="formData.opdate" autocomplete="off" :disabled="true"  style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model.trim="formData.memo" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
      </el-form>
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
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import * as InventoryManageConst from '../../general-inventory-const'
import { accDiv, accMul } from '@/utils'
import loadingMixin from '@/mixins/loading'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
export default {
  name: 'InventoryInitDialog',
  mixins: [loadingMixin, refreshDataMixin, MessageUtil],
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
    },
    isDetailjz: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {},
      invData: [],
      pricePre: this.$store.getters.pricePre,
      numPre: this.$store.getters.numPre,
      disabled: false,
      isSetNum: false
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
    showDetail: {
      get () {
        return this.isDetailjz
      },
      set () {
        this.$emit('update:isDetailjz', false)
      }
    },
    rules () {
      let rules = {
        qcsl: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        qcdj: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        qcje: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ]
      }
      return rules
    }
  },
  mounted: function mounted () {
    this.getInvData()
  },
  methods: {
    refreshData () {
      this.getInvData()
    },
    getInvData () {
      this.$api.GeneralInventoryApi.InventoryDoc.queryB({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY,
        pk_corp: this.$parent.pk_corp
      }).then(result => {
        if (result.success) {
          this.invData = InventoryManageConst.invDataFullName(result.rows)
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    bmHandleChange (newValue) {
      this.$refs.formRef.clearValidate() // 移除校验结果
      const row = this.invData.find(item => item.id === newValue)
      const kmdata = this.$store.state.accounting.subjectRefData.find(item => item.id === row.kmclassify)
      if (kmdata) { this.formData.chlb = kmdata.kmmc }
      this.formData.chid = row.id
      this.formData.spec = row.spec
      this.formData.jldw = row.unit
    },
    save () {
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.GeneralInventoryApi.InventoryInit.save({
            ...this.formData
          }).then(result => {
            this.closeLoading()
            if (result.success) {
              this.$emit('save', result.rows)
              this.closeDialog()
            } else {
              this.errorMsg(result.msg)
            }
          })
        } else {
          this.closeLoading()
        }
      })
    },
    slhandleChange () {
      this.autoCal('qcsl')
    },
    djhandleChange () {
      this.autoCal('qcdj')
    },
    jehandleChange () {
      this.autoCal('qcje')
    },
    autoCal (field) {
      if (this.isSetNum) {
        return
      }
      const qcsl = this.formData.qcsl
      const qcdj = this.formData.qcdj
      const qcje = this.formData.qcje
      if (qcsl && qcdj && (!qcje || field === 'qcsl' || field === 'qcdj')) {
        this.formData.qcje = accMul(this.formData.qcsl, this.formData.qcdj)
      } else if (qcsl && qcje && (!qcdj || field === 'qcsl' || field === 'qcje')) {
        this.formData.qcdj = accDiv(this.formData.qcje, this.formData.qcsl)
      } else if (qcdj && qcje && !qcsl) {
        this.formData.qcsl = accDiv(this.formData.qcje, this.formData.qcdj)
      }
    },
    onDialogOpen () {
      this.formData = Object.assign({}, this.data)
      if (this.formData.qcid) {
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
