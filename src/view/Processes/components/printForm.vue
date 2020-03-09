<!--打印设置公用组件 date:2019-11-05 admin:panguangxing-->
1<template>
  <div style="position: relative" class="printFor">
    <el-dialog
      id="printDialog"
      title="打印"
      :visible.sync="showPrintForm"
      width="25%"
      :close-on-click-modal="false"
      :modal="false"
      @close="closeDialog"
    >
      <el-form ref="ruleForm" @submit.native.prevent label-width="100px" :inline="true">
        <el-form-item label="模板选择:">
          <el-select v-model="modelSelect" @change="selectRowDate">
            <el-option
              v-for="item in modelSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印预览方向:" v-if="isShow">
          <el-radio-group v-model="radio" @change="radioChange">
            <el-radio label="Y">横向</el-radio>
            <el-radio label="N">纵向</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-form-item label="页面边距:" class="gauge">
            左
            <el-input v-model="leftSum" style="width: 50px"></el-input>毫米
            <i style="margin-left: 10px">
              上
              <el-input v-model="topSum" style="width: 50px"></el-input>毫米
            </i>
          </el-form-item>
        </el-row>
        <el-form-item label="字体大小:">
          <el-select v-model="printFontSize">
            <el-option
              v-for="item in printFontSizeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印日期:">
          <el-date-picker type="date" v-model="printDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="打印方式:" v-if="isShowPrintType">
          <el-select v-model="printType" @change="selectPrintType">
            <el-option
              v-for="item in printTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置打印项" v-if="isShowSetting">
          <el-row>
            <table
              style="width: 230px"
              border="1"
              bordercolor="#ddd"
              cellspacing="0"
              cellpadding="0"
            >
              <tr>
                <th colspan="2">行选项</th>
                <th colspan="2">列选项</th>
              </tr>
              <tr>
                <td>小计</td>
                <td style="text-align: center">
                  <el-checkbox v-model="subtotal"></el-checkbox>
                </td>
                <td>类别</td>
                <td style="text-align: center">
                  <el-checkbox v-model="types"></el-checkbox>
                </td>
              </tr>
              <tr>
                <td>合计</td>
                <td style="text-align: center">
                  <el-checkbox v-model="total"></el-checkbox>
                </td>
                <td>资产编码</td>
                <td style="text-align: center">
                  <el-checkbox v-model="asseCode"></el-checkbox>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>折旧日期</td>
                <td style="text-align: center">
                  <el-checkbox v-model="zjDate"></el-checkbox>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>预计使用年限</td>
                <td style="text-align: center">
                  <el-checkbox v-model="userTime"></el-checkbox>
                </td>
              </tr>
            </table>
          </el-row>
        </el-form-item>
      </el-form>
      <el-form-item size="mini" v-if="isShowHzPrint">
        <el-checkbox v-model="ishzPrint">是否按出库单汇总打印</el-checkbox>
      </el-form-item>
      <el-form-item size="mini" v-if="isShowPrintNo">
        <el-checkbox v-model="isprintNo">不打印凭证号</el-checkbox>
      </el-form-item>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="querySelect">打 印</el-button>
        <el-button @click="colseCreate">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['isShowType'],
  name: 'printForm',
  components: { },
  data () {
    return {
      showPrintForm: true,
      isShow: true,
      isShowSetting: false,
      isShowHzPrint: false,
      isShowPrintNo: false,
      isShowPrintType: false,
      subtotal: false,
      types: false,
      total: false,
      asseCode: false,
      zjDate: false,
      userTime: false,
      ishzPrint: false,
      isprintNo: false,
      radio: 'Y',
      leftSum: 20,
      topSum: 5,
      modelSelect: '1',
      printDate: new Date(),
      modelSelectOptions: [{
        value: '1',
        label: 'A4纸模板'
      },
      {
        value: '2',
        label: 'B5纸模板'
      }],
      printFontSize: '9',
      printFontSizeOptions: [{
        value: '9',
        label: '9'
      },
      {
        value: '8',
        label: '8'
      },
      {
        value: '7',
        label: '7'
      },
      {
        value: '6',
        label: '6'
      },
      {
        value: '5',
        label: '5'
      }],
      printType: '2',
      printTypeOptions: [{
        value: '1',
        label: '资产汇总打印'
      },
      {
        value: '2',
        label: '资产分页打印'
      }]
    }
  },
  methods: {
    querySelect: function () {
      this.showPrintForm = false
      let param = {
        printForm: false,
        printInfo: {
          type: this.modelSelect.toString(),
          pageOrt: this.radio.toString(),
          left: this.leftSum.toString(),
          top: this.topSum.toString(),
          font: this.printFontSize.toString(),
          printdate: this.printDate,
          xjtotal: this.isShowSetting ? this.subtotal ? 1 : 0 : '',
          lb: this.isShowSetting ? this.types ? 1 : 0 : '',
          hjtotal: this.isShowSetting ? this.total ? 1 : 0 : '',
          zcbm: this.isShowSetting ? this.asseCode ? 1 : 0 : '',
          zjrq: this.isShowSetting ? this.zjDate ? 1 : 0 : '',
          zjnx: this.isShowSetting ? this.userTime ? 1 : 0 : '',
          isPaging: this.isShowPrintType ? this.printType.toString() : ''
        }
      }
      this.$bus.$emit('printinfo', param)
    },
    colseCreate: function () {
      this.revert()
    },
    closeDialog: function () {
      this.revert()
    },
    revert: function () {
      this.modelSelect = '1'
      this.radio = 'Y'
      this.leftSum = 20
      this.topSum = 5
      this.printFontSize = '9'
      this.printDate = new Date()
      this.showPrintForm = false
      let param = {
        printForm: false
      }
      this.$bus.$emit('printinfo', param)
    },
    radioChange: function () {
      if (this.radio === '1') {
        this.leftSum = 20
      } else {
        this.leftSum = 5
      }
    },
    selectRowDate: function () {
      if (this.modelSelect === '1') {
        this.leftSum = 20
        this.printFontSize = '9'
        this.isShow = true
      } else {
        this.leftSum = 10
        this.printFontSize = '7'
        this.isShow = false
      }
    },
    selectPrintType: function () {
      if (this.printType === '1') {
        this.isShowSetting = true
      } else {
        this.isShowSetting = false
      }
    }
  },
  created () {
    if (this.isShowType !== undefined && this.isShowType.isShowPrintType !== undefined) {
      this.isShowPrintType = this.isShowType.isShowPrintType
    }
    if (this.isShowType !== undefined && this.isShowType.isShowCheck !== undefined) {
      this.isShowHzPrint = this.isShowType.isShowCheck
      this.isShowPrintNo = this.isShowType.isShowCheck
    }
  }
}
</script>

<style lang="less">
.printFor {
  .gauge .el-input__inner {
    padding: 0 3px;
    text-align: right;
  }
  #printDialog .el-dialog__body {
    padding: 10px 20px;
    /*height: 300px;*/
    border-bottom: 1px solid #dddddd;
  }
}
</style>
