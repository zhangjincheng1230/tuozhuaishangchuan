<template>
  <div>
    <el-dialog title="打印"  :visible.sync="visible"  width="380px">
      <el-form :model="printForm" ref="formData">
        <el-form-item label="模板选择：">
          <el-select  v-model="printForm.type"
                      style="width: 194px">
            <el-option
              v-for="item in printTempRef"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面边距：">
          <div style="display: inline-block">
            左<el-input
            v-model.trim="printForm.left"
            style="width: 50px"></el-input>毫米
          </div>
          <div style="display: inline-block; margin-left: 10px">
            上<el-input
            v-model.trim="printForm.top"
            style="width: 50px"></el-input>毫米
          </div>
        </el-form-item>
        <el-form-item label="字体大小：">
          <el-select
            v-model="printForm.font"
            style="width: 194px">
            <el-option
              v-for="item in fontSizeRef"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印日期：" >
          <el-date-picker
            v-model="printForm.printdate"
            value-format="yyyy-MM-dd"
            :clearable ="true"
            type="date"
            placeholder="选择日期"
            style="width:140px;">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="printReport">打 印</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
export default {
  name: 'PrintDialog',
  data () {
    return {
      visible: false,
      printForm: {
        periodrange: ['2019-03', '2019-04'],
        activation: 'Y',
        type: '1',
        font: '9',
        left: '5',
        top: '40',
        dyrq: 'czrq',
        printdate: formatDate(new Date()),
        isPaging: ''
      },
      printTempRef: [
        {
          value: '1',
          label: 'A4纸模板'
        },
        {
          value: '2',
          label: 'B5纸模板'
        }
      ],
      fontSizeRef: [
        { value: '5' },
        { value: '6' },
        { value: '7' },
        { value: '8' },
        { value: '9' },
        { value: '10' },
        { value: '11' },
        { value: '12' },
        { value: '13' },
        { value: '14' }
      ]
    }
  },
  props: {
    nodename: {},
    periodrange: {}
  },
  watch: {
    // 纸张类型编辑事件
    'printForm.type' (newValue, oldValue) {
      this.updateLeftAndTop()
    },
    // 横纵向编辑事件
    'printForm.activation' (newValue, oldValue) {
      this.updateLeftAndTop()
    }
  },
  created () {
    this.querySettingMsg()
  },
  methods: {
    // 查询报表设置
    querySettingMsg () {
      this.$api.printSetting.printQuerySetting(this.nodename, this.$store.getters.currentCorp.pk_gs).then(result => {
        if (result.success) {
          let printsetting = null
          if (result.rows) {
            printsetting = JSON.parse(result.rows.print_setting)
          }
          if (!printsetting) {
            return
          }
          this.printForm = printsetting
          // font-size 以后转成 font
          if (printsetting['font-size'] != null && printsetting['font-size'].length > 0) {
            this.printForm.font = printsetting['font-size']
          }
          this.updateBooleanToString(printsetting)
          // this.printForm.periodrange = this.periodrange
        } else {
        }
      }).catch(e => {
      })
    },
    // 更改老的历史数据 以前存的true 和 false 全部改成 Y,N
    updateBooleanToString (printsetting) {
      // 老数据的true 全部转换成Y N 是否横纵向
      if (printsetting.activation != null && printsetting.activation.length > 0) {
        if (printsetting.activation === 'true') {
          this.printForm.activation = 'Y'
        } else if (printsetting.activation === 'false') {
          this.printForm.activation = 'N'
        } else {
          this.printForm.activation = printsetting.activation
        }
      }
      // 老数据的true 全部转换成Y N 显示辅助类别
      if (printsetting.showlb != null && printsetting.showlb.length > 0) {
        if (printsetting.showlb === 'true') {
          this.printForm.showlb = 'Y'
        } else if (printsetting.showlb === 'false') {
          this.printForm.showlb = 'N'
        } else {
          this.printForm.showlb = printsetting.showlb
        }
      }
      // 老数据的true 全部转换成Y N 显示辅助编码
      if (printsetting.showbm != null && printsetting.showbm.length > 0) {
        if (printsetting.showbm === 'true') {
          this.printForm.showbm = 'Y'
        } else if (printsetting.showbm === 'false') {
          this.printForm.showbm = 'N'
        } else {
          this.printForm.showbm = printsetting.showbm
        }
      }
      // 老数据的true 全部转换成Y N 是否分页
      if (printsetting.isPaging != null && printsetting.isPaging.length > 0) {
        if (printsetting.isPaging === 'true') {
          this.printForm.isPaging = 'Y'
        } else if (printsetting.isPaging === 'false') {
          this.printForm.isPaging = 'N'
        } else {
          this.printForm.isPaging = printsetting.isPaging
        }
      }
    },
    // 更新边距
    updateLeftAndTop () {
      if (this.printForm.type === '2') {
        this.printForm.left = '5'
        this.printForm.top = '40'
      } else {
        // 横向
        if (this.printForm.activation === 'Y') {
          this.printForm.left = '40'
          this.printForm.top = '5'
        } else {
          this.printForm.left = '5'
          this.printForm.top = '40'
        }
      }
    },
    // 保存设置
    saveSettingMsg () {
      this.$api.printSetting.saveSetting(this.getParamToSaveSetting()).then(result => {
        if (result.success) {
          this.visible = false
        } else {
        }
      }).catch(e => {
      })
    },
    getParamToSaveSetting () {
      return {
        nodename: this.nodename,
        print_setting: JSON.stringify(this.printForm),
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        corpids: this.$store.getters.currentCorp.pk_gs
      }
    },
    // 打印确定
    printReport () {
      this.saveSettingMsg()
      this.printForm.periodrange = this.periodrange
      this.printForm.pageOrt = this.printForm.activation // 打印方向
      this.$emit('confirmPrint', this.printForm)
    },
    // 打印取消
    cancel () {
      this.visible = false
    },
    show () {
      this.visible = true
    },
    printDateTypeChange (val) {
      this.printForm.printdate = formatDate(new Date())
    }
  }
}
</script>

<style scoped>
</style>
