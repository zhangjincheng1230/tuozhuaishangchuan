<template>
  <div>
    <el-dialog title="温馨提示"  :visible.sync="visible"  width="600px">
      <div style= "font-size: 12px; color: #333333" >
        <span>校验项：未分配利润本年累计=净利润本年累计</span>
        <img title="未分配利润本年累计=资产负债表中“未分配利润（期末余额-年初余额）+以前年度损益调整”<br> 净利润本年累计=利润表中“净利润（本年累计金额）”"
             class="easyui-tooltip tooltip-f" src="../../../../../assets/img/helptool.png" style="    vertical-align: bottom;">
      </div>
      <div style=" background: white;margin: 20px 20px; padding: 10px 0 10px 20px">
        <div v-if="wfp === jlr" style="border-bottom: 1px solid #939393; padding-bottom: 10px">
          <img src="../../../../../assets/img/poise.png" style="height:18px;vertical-align: middle;">&emsp;平衡&emsp;
        </div>
        <div v-else style="border-bottom: 1px solid #939393; padding-bottom: 10px" >
          <img style="height:18px;vertical-align: middle;" src="../../../../../assets/img/uneven.png">&emsp;差额：<span style="color: #f79311"> {{ce | forThousands}}</span>
        </div>

        <div style="padding: 10px 0 0 0">
          <span style="display: inline-block; width: 39%">未分配利润本年累计</span>
          <span style="display: inline-block; width: 49%"><span id="jyx2_equal">{{wfp === jlr ? '=': '≠'}}</span><span  style="margin-left: 100px">净利润本年累计</span></span>
        </div>
        <div style="padding: 10px 0 0 0; color: #999999; font-size: 12px">
          <span style="display: inline-block; width: 39%" id="jyx2_wfp">{{wfp}}</span>
          <span style="display: inline-block; width: 49%"><span></span><span id = "jyx2_jlr" style="margin-left: 110px">{{jlr}}</span></span>
        </div>
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
  name: 'noblancedialog',
  data () {
    return {
      ce: 0,
      wfp: 0,
      jlr: 0,
      visible: false
    }
  },
  props: {
    // ce: {},
    // wfp: {},
    // jlr: {}
  },
  methods: {
    show (ce, wfp, jlr) {
      this.ce = ce
      this.wfp = wfp
      this.jlr = jlr
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
