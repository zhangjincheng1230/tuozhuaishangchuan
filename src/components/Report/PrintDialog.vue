<template>
    <div>
        <el-dialog title="打印"  :visible.sync="visible" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="420px">
            <el-form :model="printForm" ref="formData"   label-width="100px">
                <el-form-item label="模板选择">
                    <el-select  v-model="printForm.type"
                            style="width: 210px">
                        <el-option
                                v-for="item in printTempRef"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="打印预览方向" v-show="isshowDir" >
                    <div style="display: inline-block">
                        <el-radio-group v-model="printForm.activation">
                            <el-radio label="Y">横向</el-radio>
                            <el-radio label="N">纵向</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="页面边距">
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
                <el-form-item label="字体大小">
                    <el-select
                            v-model="printForm.font"
                            style="width: 210px">
                        <el-option
                                v-for="item in fontSizeRef"
                                :key="item.value"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="打印日期" >
                  <el-radio-group  v-model="printForm.dyrq"  @change="printDateTypeChange">
                    <ul >
                        <li style="line-height: 36px">
                          <el-radio style="line-height: 36px" label="czrq">操作日期</el-radio>
                          <el-date-picker
                            v-if="printForm.dyrq === 'czrq'"
                            v-model="printForm.printdate"
                            value-format="yyyy-MM-dd"
                            :clearable ="true"
                            type="date"
                            placeholder="选择日期"
                            style="width:140px;">
                          </el-date-picker>
                        </li>
                        <li style="line-height: 36px" >
                          <el-radio style="line-height: 36px"  label="jsrq">查询结束日期</el-radio>
                          <el-date-picker
                            v-if="printForm.dyrq==='jsrq'"
                            v-model="printForm.printdate"
                            value-format="yyyy-MM-dd"
                            :clearable ="true"
                            type="date"
                            placeholder="选择日期"
                            style="width:140px;">
                          </el-date-picker>
                        </li>
                        <li style="line-height: 36px" ><el-radio  style="line-height: 36px" label="bdyrq">不打印日期</el-radio></li>
                    </ul>
                   </el-radio-group>
                </el-form-item>
              <el-form-item label="打印期间"  v-if = "printdatescope">
                <el-date-picker
                  v-model= "periodrange"
                  type="monthrange"
                  unlink-panels
                  :size="'small'"
                  range-separator="-"
                  value-format="yyyy-MM"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:210px"
                  >
                </el-date-picker>
              </el-form-item>
              <el-form-item v-if="pagename.length>0" >
                <el-checkbox v-model="printForm.isPaging" true-label="Y" false-label="N">{{pagename}}</el-checkbox>
              </el-form-item>
              <el-form-item v-if="nodename === '辅助明细账'" >
                <el-checkbox v-model="printForm.showlb"  true-label="Y" false-label="N">显示辅助类别</el-checkbox>
              </el-form-item>
              <el-form-item v-if="nodename === '辅助明细账'">
                <el-checkbox  v-model="printForm.showbm" true-label="Y" false-label="N" >显示辅助编码</el-checkbox>
              </el-form-item>
              <el-form-item label="打印方式：" v-if="nodename === '折旧明细账'">
                <el-select v-model="printForm.isPaging"
                  style="width: 210px">
                  <el-option
                    v-for="item in zcprinttypes"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设置打印项" v-if="printForm.isPaging === 'N' && nodename === '折旧明细账'" >
                <table  class="columnset-table"  style="display:table;border-spacing: 0;width: 260px;" id = "more-conditions">
                  <tbody>
                  <tr >
                    <td colspan="2" style = "text-align: center;width:40%">行项目</td>
                    <td colspan="2" style = "text-align: center;width:60%">列项目</td>
                  </tr>
                  <tr>
                    <td>小计</td>
                    <td><el-checkbox type="checkbox" v-model="printForm.xjtotal" :true-label="'Y'" :false-label="'N'"></el-checkbox></td>
                    <td>类别</td>
                    <td><el-checkbox type="checkbox" v-model="printForm.lb" :true-label="'Y'" :false-label="'N'"></el-checkbox></td>
                  </tr>
                  <tr>
                    <td>合计</td>
                    <td><el-checkbox type="checkbox" v-model="printForm.hjtotal" :true-label="'Y'" :false-label="'N'"></el-checkbox></td>
                    <td>资产编码</td>
                    <td><el-checkbox type="checkbox" v-model="printForm.zcbm" :true-label="'Y'" :false-label="'N'"></el-checkbox></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>折旧日期</td>
                    <td><el-checkbox type="checkbox" v-model="printForm.zjrq" :true-label="'Y'" :false-label="'N'"></el-checkbox></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>预计使用年限</td>
                    <td><el-checkbox type="checkbox" v-model="printForm.zjnx" :true-label="'Y'" :false-label="'N'" ></el-checkbox></td>
                  </tr>
                  </tbody>
                </table>
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
        isPaging: 'N',
        xjtotal: 'N',
        lb: 'N',
        hjtotal: 'N',
        zcbm: 'N',
        zjrq: 'N',
        zjnx: 'N'
      },
      zcprinttypes: [ // 资产打印方式
        {
          value: 'N',
          label: '资产汇总打印'
        },
        {
          value: 'Y',
          label: '资产分页打印'
        },
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
    enddate: {},
    nodename: {},
    periodrange: {},
    printdatescope: {
      type: Boolean,
      default: false
    }, // 是否打印区间
    bshowDir: {
      type: Boolean,
      default: true
    }, // 显示打印预览方向
    defaultleft: {
      type: String,
      default: '5'
    }, // 默认左边距
    defaulttop: {
      type: String,
      default: '5'
    }, // 默认边距
    printTempRef: {
        type: Array,
        default () {
            return [
                { value: '1', label: 'A4纸模板' },
                { value: '2', label: 'B5纸模板' },
                { value: '4', label: 'A5纸模板' }
            ]
        }
    }
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
  computed: {
    pagename () {
      if (this.nodename === '辅助明细账') {
        return '按辅助名称分页打印'
      } else if (this.nodename === '科目明细账' || this.nodename === '科目总账') {
        return '按科目分页打印'
      } else {
        return ''
      }
    },
    // 打印期间是否显示 (批量显示)
    // printdatescope () {
    //   if (this.nodename === '资产负债表' || this.nodename === '利润表' || this.nodename === '分部利润表' || this.nodename === '现金流量表') {
    //     return true
    //   }
    //   return false
    // },
    // 打印预览方向
    isshowDir () {
      // if (this.nodename === '发生额及余额表' || this.nodename === '资产总账' || this.nodename === '资产明细账') {
      //   return false
      // }
      if (this.printForm.type === 1) {
        return false
      }
      if (!this.bshowDir) { // 如果默认不显示，则取默认值
        return this.bshowDir
      }
      return true
    }
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
          for (let key in this.printForm) {
            if (printsetting[key]) {
              this.printForm[key] = printsetting[key]
            }
          }
          if (this.printForm['dyrq'] && this.printForm['dyrq'] === 'czrq') {
            this.printForm['printdate'] = formatDate(new Date())
          }
          // font-size 以后转成 font
          if (printsetting['font-size'] != null && printsetting['font-size'].length > 0) {
            this.printForm.font = printsetting['font-size']
          }
          // 更改老的历史数据 以前存的true 和 false 全部改成 Y,N
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
      if (this.isshowDir === true) { // 若果显示横纵向
        if (this.printForm.type === '2' || this.printForm.type === '4') {
          this.printForm.left = '5'
          this.printForm.top = '5'
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
      } else {
        this.printForm.left = this.defaultleft
        this.printForm.top = this.defaulttop
      }
      if (this.printForm.type === '1') { // A4 字体
        this.printForm.font = '9'
      } else {
        this.printForm.font = '7'
      }
    },
    // 保存设置
    saveSettingMsg () {
      this.$api.printSetting.saveMulColumn(this.getParamToSaveSetting()).then(result => {
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
        corpids: this.$store.getters.currentCorp.pk_gs,
        updatecolumn: 'print_setting'
      }
    },
    // 打印确定
    printReport () {
      this.saveSettingMsg()
      this.printForm.periodrange = this.periodrange
      this.printForm.pageOrt = this.printForm.activation // 打印方向
      this.$emit('confirmPrint', JSON.parse(JSON.stringify(this.printForm)))
    },
    // 打印取消
    cancel () {
      this.visible = false
    },
    show () {
      this.visible = true
      this.printDateTypeChange(this.printForm.dyrq)
    },
    printDateTypeChange (val) {
      if (val === 'czrq') { // 操作日期
        this.printForm.printdate = formatDate(new Date())
      } else if (val === 'jsrq') { // 查询结束日期
        this.printForm.printdate = this.enddate
      } else if (val === 'bdyrq') { // 不打印日期
        this.printForm.printdate = ''
      }
    }
  }
}
</script>

<style scoped>
  .columnset-table {
    border-spacing: 0;
    width:320px;
  }
  .columnset-table tbody>tr>td {
    text-align: left;
    border: 1px solid #ddd;
    margin: 0;
    padding: 3px;
  }
</style>
