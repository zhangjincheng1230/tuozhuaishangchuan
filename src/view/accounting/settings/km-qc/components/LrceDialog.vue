<!--利润存在差额-->
<template>
  <div>
    <el-dialog title="试算平衡信息"  :close-on-click-modal="false"
               :close-on-press-escape="false" :visible.sync="visible"  width="540px">
      <div style="padding: 0px 0 0 20px; font-size: 12px; color: #333333" >
        <span>校验项："本年利润+利润分配"本年累计=净利润本年累计</span>
<!--        <img title=""  src="../../../../../assets/img/helptool.png" style="vertical-align: bottom;">-->
        <el-tooltip effect="light">
          <div slot="content">
            “本年利润+利润分配”本年累计=本年利润（本年贷方发生额-本年借方发生额）+利润分配（本年贷方发生额-本年借方发生额）<br>&nbsp;&nbsp;净利润本年累计=“收入利得科目（本年贷方发生额）-费用损失科目（本年借方发生额）”
          </div>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </div>
      <div style="background: white;margin: 20px 20px; padding: 10px 0 10px 20px">

        <div v-if="result.yearlrce ===0 " style="border-bottom: 1px solid #939393; padding-bottom: 10px">
          <img src="../../../../../assets/img/poise.png">&emsp;平衡&emsp;
        </div>
        <div v-else style="border-bottom: 1px solid #939393; padding-bottom: 10px" >
          <img style="height:18px " src="../../../../../assets/img/uneven.png">&emsp;差额：<span style="color: #f79311"> {{result.yearlrce | forThousands}}</span>
        </div>

        <div style="padding: 10px 0 0 0">
          <span style="display: inline-block; width: 43%">"本年利润+利润分配"本年累计</span>
          <span style="display: inline-block; width: 49%">
            <span v-if="result.yearlrce ===0 " id="s3">≠</span>
            <span v-else >=</span>
            <span  style="margin-left: 5px">净利润本年累计</span></span>
        </div>
        <div style="padding: 10px 0 0 0; color: #999999; font-size: 12px">
          <span style="display: inline-block; width: 39%" id="v9">{{result.yearlr | forThousands}}</span>
          <span style="display: inline-block; width: 49%"><span></span><span id = "v10" style="margin-left: 110px">{{result.yearlrlj | forThousands }}</span></span>
        </div>
      </div>
      <div style="padding:10px 20px 20px 20px;clear: both;color:#666;">
        <div style="clear: both;color:#333;">
          可能导致不平衡的原因：
        </div>
        <div id="div_nobalance"></div>
        <div style="font-size: 12px;">&emsp;&nbsp;1、进行了以前年度损益调整、提取盈余公积金或利润分配</div>
        <div style="font-size: 12px;">&emsp;&nbsp;2、损益科目金额录入有误</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="visible = false">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'lrcedialog',
  data () {
    return {
      visible: false
    }
  },
  props: {
    result: {}
  },
  methods: {
    show () {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
