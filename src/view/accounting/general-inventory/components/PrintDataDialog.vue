<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="400px">
    <el-form ref="formRef" :model="formDialogData"  label-width="110px">
      <el-form-item label="模板选择" >
        <el-select size ="small" v-model="formDialogData.type">
          <el-option label="A4纸模板" value="1"></el-option>
          <el-option label="B5纸模板" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印预览方向" v-show="formDialogData.type == 1" >
        <div style="display: inline-block">
          <el-radio-group v-model="formDialogData.activation">
            <el-radio label="Y">横向</el-radio>
            <el-radio label="N">纵向</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="页面边距" >
        左
        <el-input size ="small" v-model="formDialogData.left" style="width:50px"  maxlength=2></el-input>
        毫米
        <span style="margin-left:10px">上</span>
        <el-input size ="small" v-model="formDialogData.top" style="width:50px"  maxlength=2></el-input>
        毫米
      </el-form-item>
      <el-form-item  label="字体大小" >
        <el-select size ="small" v-model="formDialogData.font">
          <el-option label="9" value="9"></el-option>
          <el-option label="8" value="8"></el-option>
          <el-option label="7" value="7"></el-option>
          <el-option label="6" value="6"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="打印日期" >
        <el-date-picker v-model="formDialogData.printdate" type="date"
                        value-format="yyyy-MM-dd" size ="small" picker-options="datePicker()" :editable="false" :clearable="false" ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取消</el-button>
        <el-button type="primary"  size ="small"  @click="confirmPrint()">打印</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { formatDate } from '@/utils'
export default {
  name: 'PrintDataDialog',
  props: ['visible', 'title', 'nodename'],
  data () {
    return {
      formDialogData: {type: '1', activation: 'Y', font: 9, left: 40, top: 5, printdate: formatDate(new Date())}
    }
  },
  watch: {
    // 纸张类型编辑事件
    'formDialogData.type' (newValue, oldValue) {
      this.updateLeftAndTop()
    },
    // 横纵向编辑事件
    'formDialogData.activation' (newValue, oldValue) {
      this.updateLeftAndTop()
    }
  },
  created () {
    this.querySettingMsg()
  },
  mounted: function mounted () {
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
    name: {
      get () {
        return this.nodename
      },
      set () {
        this.$emit('update:nodename', false)
      }
    }
  },
  methods: {
    // 查询报表设置
    querySettingMsg () {
      this.$api.printSetting.printQuerySetting(this.name, this.$store.getters.currentCorp.pk_gs).then(result => {
        if (result.success) {
          if (result.rows) {
            this.formDialogData = Object.assign(this.formDialogData, JSON.parse(result.rows.print_setting))
          }
          if (!this.formDialogData) {
            return
          }
          if (this.formDialogData['font-size'] != null && this.formDialogData['font-size'].length > 0) {
            this.formDialogData.font = this.formDialogData['font-size']
          }
          this.formDialogData.printdate = formatDate(new Date())
          if (this.formDialogData.activation != null && this.formDialogData.activation.length > 0) {
            if (this.formDialogData.activation === 'true') {
              this.formDialogData.activation = 'Y'
            } else if (this.formDialogData.activation === 'false') {
              this.formDialogData.activation = 'N'
            }
          } else {
            this.formDialogData.activation = 'Y'
          }
        } else {
        }
      }).catch(e => {
      })
    },
    confirmPrint () {
      this.saveSettingMsg()
      this.formDialogData.pageOrt = this.formDialogData.activation
      this.$parent.confirmPrint(this.formDialogData)
    },
    // 保存设置
    saveSettingMsg () {
      this.formDialogData['font-size'] = this.formDialogData.font
      this.$api.printSetting.saveSetting(this.getParamToSaveSetting()).then(result => {
        if (result.success) {
        } else {
        }
      }).catch(e => {
      })
    },
    getParamToSaveSetting () {
      return {
        nodename: this.name,
        print_setting: JSON.stringify(this.formDialogData),
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        corpids: this.$store.getters.currentCorp.pk_gs
      }
    },
    onDialogOpen () {
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    },
    datePicker () {
      const self = this.$parent
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.$store.getters.currentCorp.bdate
          return period < jzDate.substring(0, 7)
        }
      }
    },
    // 更新边距
    updateLeftAndTop () {
      if (this.formDialogData.type === '2') {
        this.formDialogData.left = 5
        this.formDialogData.top = 5
      } else {
        // 横向
        if (this.formDialogData.activation === 'Y') {
          this.formDialogData.left = 5
          this.formDialogData.top = 5
        } else {
          this.formDialogData.left = 5
          this.formDialogData.top = 5
        }
      }
      this.formDialogData.font = 6
    }
  }
}
</script>
