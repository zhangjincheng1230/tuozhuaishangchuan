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
        <el-form-item label="别名" prop="aliasname">
          <el-input v-model.trim="formData.aliasname" autocomplete="off"  style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="规格(型号)" prop="spec">
          <el-input v-model.trim="formData.spec" autocomplete="off"  style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model.trim="formData.unit" autocomplete="off" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="计算模式" prop="calcmode">
          <el-select   v-model="formData.calcmode"
                       default-first-option placeholder="请选择"  filterable style="width:220px">
            <el-option v-for="item in this.caldata" :key="item.label" :label="item.value" :value="item.label">
              <span style="float: left">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换算关系" prop="hsl">
          <el-input-number v-model="formData.hsl" :precision="4" :controls =false style="width:220px" ></el-input-number>
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
import loadingMixin from '@/mixins/loading'
export default {
  name: 'InventoryAliasDialog',
  mixins: [loadingMixin],
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
      caldata: [{label: 0, value: '别名单位*换算关系=原单位'}, {label: 1, value: '别名单位/换算关系=原单位'}]
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
        aliasname: [
          { required: true, message: '请输入别名', trigger: 'blur' }
        ],
        spec: [{ min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
        unit: [{ min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
        hsl: [
          { required: true, message: '请输入换算关系', trigger: 'blur' }
        ]
      }
      return rules
    }
  },
  mounted: function mounted () {
  },
  methods: {
    save () {
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.GeneralInventoryApi.InventoryAlias.save({
            ...this.formData
          }).then(result => {
            this.closeLoading()
            if (result.success) {
              this.$emit('save', result.rows)
              this.closeDialog()
            } else {
              this.$message.error(result.msg)
            }
          })
        } else {
          this.closeLoading()
        }
      })
    },
    onDialogOpen () {
      this.formData = Object.assign({}, this.data)
      if (this.formData.pk_alias) {
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
