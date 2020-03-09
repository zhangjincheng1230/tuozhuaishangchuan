<template>
    <div style="border:1px solid #ccc; width:1160px;height:600px;overflow:hidden;overflow-y:auto;">
      <el-row class="detection_header" style="border-bottom:1px solid #ccc;line-height:50px;background:#d9ebf5;">
        <el-col :span="22" style="text-align:left;padding-left:20px;">
          <span>智能做账检测</span>
          <i class="el-icon-warning-outline"></i>
          <span style="color:#bf3a4d">标*号的项是强制处理的</span>
        </el-col>
        <el-col :span="2">
          <el-button :disabled="isTogetvoucher" type="primary" size="mini" @click="togetvoucher" >制单</el-button>
        </el-col>
      </el-row>
      <div style="margin-bottom:20px;">
        <el-row v-for="(value, key, index) in errorRows" :key="'s' + index">
          <el-row v-if="value.count > 0" style="padding-left:20px;">
            <el-row style="border-bottom:1px solid #ccc;line-height:40px;">
              <el-col :span="22" style="text-align:left;">
                <i style="color:#bf3a4d; font-size: 18px" v-if="value.ismust == 'Y'">*</i>
                <span>{{key}}</span>
                <span v-if="key == 1">票据未匹配存货 ({{value.count}}张)</span>
                <span v-if="key == 2">资产分类名称与资产类别名称不一致 ({{value.count}}个)</span>
                <span v-if="key == 3">票据本方银行账号在系统中不存在 ({{value.count}}张)</span>
                <span v-if="key == 4">存在未签收进项发票 ({{value.count}}条)</span>
                <span v-if="key == 5">存在未签收销项发票 ({{value.count}}条)</span>
                <span v-if="key == 6">存在未勾对银行对账单数据 ({{value.count}}条)</span>
                <span v-if="key == 7">检测分类存在问题 ({{value.count}}张)</span>
                <span v-if="key == 8">自定义分类创建规则检测 ({{value.count}}个)</span>
                <span v-if="key == 9">票据已生成资产未做账 ({{value.count}}张) <span style="color: #ff3643">请在资产卡片节点做入账处理</span> </span>
                <span v-if="key == 10">票据已生成出库单未做账 ({{value.count}}张) <span style="color: #ff3643">请在出库单节点做入账处理</span></span>
                <span v-if="key == 11">票据已生成入库单未做账 ({{value.count}}张) <span style="color: #ff3643">请在入库单节点做入账处理</span></span>
              </el-col>
              <el-col :span="2">
                <el-button @click="getInventory(value)" v-if="key == 1" type="primary" size="mini">存货</el-button>
                <el-button @click="jumpkuaiji" v-if="key == 3" type="primary" size="mini">新增</el-button>
                <el-button @click="jumpjinxiang" v-if="key == 4" type="primary" size="mini">进项发票</el-button>
                <el-button @click="jumpxiaoxiang" v-if="key == 5" type="primary" size="mini">销项发票</el-button>
                <el-button @click="jumpyinhang" v-if="key == 6" type="primary" size="mini">勾对</el-button>
                <div v-if="key == 8"></div>
                <!--<el-button @click="initKmListData(value)" v-if="key == 8" type="primary" size="mini">创建规则</el-button>-->
              </el-col>
            </el-row>
            <el-row style="margin-top:10px;margin-bottom:10px; ">
              <el-col :span="22" style="overflow:hidden">
                <div v-if="key == 1 && i < value.showConut" v-for="(value1, i) in value.body" :key="key + i" style="text-align:left;">
                  图片ID：<span style="color:#749ca4; cursor: pointer" @click="$parent.$parent.openbillDetailDialog({id: value1.id})">{{value1.webid}}</span>,付款方名称：{{value1.fkfmc}},收款方名称：{{value1.skfmc}},金额：{{value1.je}},税额：{{value1.se}},价税合计：{{value1.jshj}},开票日期：{{value1.kprq}}
                </div>
                <div v-if="key == 2 && i < value.showConut" v-for="(value2, i) in value.body" :key="key + i" style="text-align:left;">
                  <span>{{value2.zcflmc}}</span>
                </div>
                <div v-if="key == 3 && i < value.showConut" v-for="(value3, i) in value.body" :key="key + i" style="text-align:left;">
                  图片ID：<span style="color:#749ca4" @click="$parent.$parent.openbillDetailDialog({id: value3.id})">{{value3.webid}}</span>,本方银行名称：{{value3.bankname}},本方银行账号：{{value3.bankcode}},付款方名称：{{value3.fkfmc}},收款方名称：{{value3.skfmc}},金额：{{value3.je}},开票日期：{{value3.kprq}}
                </div>
                <div v-if="key == 4 && i < value.showConut" v-for="(value4, i) in value.body" style="text-align:left;" :key="key + i">
                  付款方名称：{{value4.fkf}},收款方名称：{{value4.skf}},金额：{{value4.je}},税额：{{value4.se}},价税合计：{{value4.jshj}},开票日期：{{value4.kprq}}
                </div>
                <div v-if="key == 5 && i < value.showConut" v-for="(value5, i) in value.body" style="text-align:left;" :key="key + i">
                  付款方名称：{{value5.fkf}},收款方名称：{{value5.skf}},金额：{{value5.je}},税额：{{value5.se}},价税合计：{{value5.jshj}},开票日期：{{value5.kprq}}
                </div>
                <div v-if="key == 6 && i < value.showConut" v-for="(value6, i) in value.body" style="text-align:left;" :key="key + i">
                  <div v-if="value6.type == 0">图片ID：<span @click="$parent.$parent.openbillDetailDialog({id: value6.id})" style="color:#749ca4">{{value6.webid}}</span>,本方银行名称：{{value6.bfyhmc}},本方银行账号：{{value6.bfyhzh}},付款方名称：{{value6.fkfmc}},收款方名称：{{value6.skfmc}},金额：{{value6.je}},开票日期：{{value6.kprq}}</div>
                  <div v-if="value6.type == 1">对方账户名称：{{value6.dfzhmc}},对方账户：{{value6.dfzh}},金额：{{value6.je}},交易日期：{{value6.rq}}</div>
                </div>
                <div v-if="key == 7 && i < value.showConut" v-for="(value7, i) in value.body" style="text-align:left;" :key="key + i">
                  {{value7.categoryname}}, 图片ID：<span @click="$parent.$parent.openbillDetailDialog({id: value7.id})" style="color:#749ca4">{{value7.webid}},</span><span>{{value7.errordesc}}</span>
                </div>
                <div v-if="key == 8 && i < value.showConut" v-for="(value8, i) in value.body" style="text-align:left;" :key="key + i">
                  <span>{{value8.categoryname}}</span> <el-button style="position: absolute; right: 2.8%" @click="initKmListData(value8)" v-if="key == 8" type="primary" size="mini">创建规则</el-button>
                </div>
                <div v-if="key == 9 && i < value.showConut" v-for="(value9, i) in value.body" style="text-align:left;" :key="key + i">
                  图片ID：<span @click="$parent.$parent.openbillDetailDialog({id: value9.id})" style="color:#749ca4">{{value9.webid}}</span>,付款方名称：{{value9.fkfmc}},收款方名称：{{value9.skfmc}},金额：{{value9.je}},税额：{{value9.se}},价税合计：{{value9.jshj}},开票日期：{{value9.kprq}}
                </div>
                <div v-if="key == 10 && i < value.showConut" v-for="(value10, i) in value.body" style="text-align:left;" :key="key + i">
                  图片ID：<span @click="$parent.$parent.openbillDetailDialog({id: value10.id})" style="color:#749ca4">{{value10.webid}}</span>,付款方名称：{{value10.fkfmc}},收款方名称：{{value10.skfmc}},金额：{{value10.je}},税额：{{value10.se}},价税合计：{{value10.jshj}},开票日期：{{value10.kprq}}
                </div>
                <div v-if="key == 11 && i < value.showConut" v-for="(value11, i) in value.body" style="text-align:left;" :key="key + i">
                  图片ID：<span @click="$parent.$parent.openbillDetailDialog({id: value11.id})" style="color:#749ca4">{{value11.webid}}</span>,付款方名称：{{value11.fkfmc}},收款方名称：{{value11.skfmc}},金额：{{value11.je}},税额：{{value11.se}},价税合计：{{value11.jshj}},开票日期：{{value11.kprq}}
                </div>
              </el-col>
              <el-col :span="2">
                <el-button style="
                                  position: absolute;
                                  right: 2.6%;
                                  bottom: 5%;"
                           v-if="value.count > value.showConut" @click="value.showConut = value.count" type="text">更多<i class="el-icon-caret-bottom" style="font-weight: 700;"></i></el-button>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    errorRows: {},
    folderInfo: {},
    voucherList: {}
  },
  data () {
    return {
      window: window,
      isTogetvoucher: false
    }
  },
  methods: {
    jumpjinxiang () {
      this.$router.push({
        name: 'incomeBill'
      })
      this.$parent.$parent.detectionVisible = false
    },
    jumpxiaoxiang () {
      this.$router.push({
        name: 'outputBill'
      })
      this.$parent.$parent.detectionVisible = false
    },
    jumpyinhang () {
      this.$router.push({
        name: 'yhdzd'
      })
      this.$parent.$parent.detectionVisible = false
    },
    jumpkuaiji () {
      this.$router.push({
        name: 'subject'
      })
      this.$parent.$parent.detectionVisible = false
    },
    getInventory (item) {
      this.$parent.$parent.curFolder.ids = item.body.map(ev => ev.id).join(',')

      // this.$parent.$parent.getInventory()
      this.$parent.$parent.getCompanyType()
    },
    initKmListData (item) {
      this.$parent.$parent.curFolder = JSON.parse(JSON.stringify(item))
      this.$parent.$parent.ruleDialogVisible = true
      console.log(item)
    },
    togetvoucher () {
      if (this.$parent.$parent.voucherList.length === 0) {
        this.$message.error('所选票据均已生成后续单据，无法智能做账')
        return
      }
      for (var val in this.errorRows) {
        if (this.errorRows[val].count > 0 && this.errorRows[val].ismust === 'Y') {
          this.$message.error('请先解决强制处理问题')
          return false
        }
      }
      this.$parent.$parent.voucherVisible = true
      this.$parent.$parent.detectionVisible = false
    }
  },
  created () {
  },
  mounted () {
    console.log(this.errorRows)
    for (var val in this.errorRows) {
      if (this.errorRows[val].count > 0 && this.errorRows[val].ismust === 'Y') {
        this.isTogetvoucher = true
        return false
      }
    }
  }
}
</script>
<style>
#zncs-main .detection_header .el-icon-warning-outline:before{
  color:#bf3a4d;
}
.el-dialog .settings-dialog{
  width:1160px;
}
</style>
