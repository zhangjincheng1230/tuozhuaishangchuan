<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :append-to-body="true"
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
        <el-form-item label="编码" prop="jldwbm">
          <el-input v-model.trim="formData.jldwbm" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="jldwmc">
          <el-input v-model.trim="formData.jldwmc" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input v-model.trim="formData.bz" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button v-if="!isEdit&&!isRef" type="primary" @click="saveadd">保存新增</el-button>
        <el-button type="primary" @click="save(false)">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import * as MsgUtil from '../../../msg-util'
import loadingMixin from '@/mixins/loading'
export default {
  name: 'InventoryClassDialog',
  mixins: [loadingMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isRef: {
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
      rules: {
        jldwbm: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        jldwmc: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        bz: [
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
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
    dialogTitle: {
      get () {
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    },
    isEdit () {
      return this.formData && this.formData.id
    }
  },
  mounted: function mounted () {
  },
  methods: {
    save (isadd) {
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.InventoryManageApi.IcsetMesunit.save({
            ...this.formData
          }).then(result => {
            this.closeLoading()
            if (result.success) {
              this.$emit('save', result.data)
              this.$emit('saved', result.data)
              if (!isadd) {
                this.closeDialog()
              } else {
                this.onDialogOpen()
              }
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
          })
        } else {
          this.closeLoading()
        }
      })
    },
    saveadd () {
      this.save(true)
    },
    onDialogOpen () {
      this.formData = Object.assign({}, this.data)
      if (!this.formData.id) {
        this.$api.InventoryManageApi.IcsetMesunit.queryDjCode().then(res => {
          this.formData.jldwbm = res.data
        })
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
</style>
