<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="510px"
  >
    <div class="form-container" :style="'max-height: ' + maxHeight +'px'">
      <el-form
        :model="formData"
        :rules="rules"
        :validate-on-rule-change="false"
        ref="formRef"
        label-width="120px"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model.trim="formData.code" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formData.name" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-tooltip
          v-if="showDetail"
          style="margin-right:32px;margin-top:7px;float:right;z-index: 9999;"
          effect="light"
          content="[存货类别]不可修改，否则会造成数据错误"
          placement="bottom"
        >
          <el-image :src="srcList[0]"></el-image>
        </el-tooltip>
        <el-form-item label="存货类别" prop="kmclassify" v-if="showDetail">
          <el-select
            v-model="formData.kmclassify"
            default-first-option
            placeholder="请选择"
            filterable
            style="width:220px"
          >
            <el-option
              v-for="item in kmclassdata"
              :key="item.id"
              :label="item.codefullname"
              :value="item.id"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.codefullname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库科目" prop="chukukmid" v-if="showDetail">
          <el-select
            v-model="formData.chukukmid"
            default-first-option
            placeholder="请选择"
            filterable
            style="width:220px"
          >
            <el-option
              v-for="item in chukukmdata"
              :key="item.id"
              :label="item.codefullname"
              :value="item.id"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.codefullname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格(型号)" prop="spec">
          <el-input v-model.trim="formData.spec" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model.trim="formData.unit" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="结算单价" prop="jsprice">
          <el-input-number
            v-model="formData.jsprice"
            :precision=pricePre
            :controls="false"
            style="width:220px"
          ></el-input-number>
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
import loadingMixin from '@/mixins/loading'
import MessageUtil from '@/mixins/message-util'
export default {
  name: 'InventoryDialog',
  mixins: [MessageUtil, loadingMixin],
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
      kmclassdata: [],
      chukukmdata: [],
      pricePre: this.$store.getters.pricePre,
      srcList: [
        require('@/assets/img/helptool.png')
      ]
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
    isEdit () {
      return this.data.id !== undefined
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
        ],
        kmclassify: [
          { required: true, message: '请输入存货类别', trigger: 'blur' }
        ],
        chukukmid: [
          { required: true, message: '请输入出库科目', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入计量单位', trigger: 'blur' }
        ]
      }
      return rules
    },
    kmdata () {
      const kmRefData = this.$store.state.accounting.subjectRefData
      for (const data of kmRefData) {
        if (data) {
          if (data.yz !== '是') {
            data.disabled = true
          } else {
            data.disabled = false
          }
        }
      }
      return kmRefData
    }
  },
  mounted: function mounted () {
    this.kmclassifydata()
    this.chukukmiddata()
  },
  methods: {
    getNewCode () {
      this.$api.GeneralInventoryApi.InventoryDoc.getCode({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY
      }).then(result => {
        this.formData.code = result.data
      })
    },
    save () {
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.GeneralInventoryApi.InventoryDoc.saveb({
            ...this.formData,
            sourcename: '存货档案',
            type: this.isEdit ? 'edit' : 'add'
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
    kmclassifydata () {
      this.$api.GeneralInventoryApi.InventoryDoc.getKmclassify().then(result => {
        if (result.success) {
          this.kmclassdata = this.kmdata.filter(item => result.rows.includes(item.kmbm))
        }
      }).catch(e => {
      })
      return null
    },
    chukukmiddata () {
      this.$api.GeneralInventoryApi.InventoryDoc.getChukuKm().then(result => {
        if (result.success) {
          this.chukukmdata = this.kmdata.filter(item => result.rows.includes(item.kmbm))
        }
      }).catch(e => {
      })
      return null
    },
    onDialogOpen () {
      if (!this.isEdit) {
        this.formData = {
          code: '001',
          pid: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY
        }
        this.getNewCode()
      } else {
        this.formData = Object.assign({}, this.data)
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
