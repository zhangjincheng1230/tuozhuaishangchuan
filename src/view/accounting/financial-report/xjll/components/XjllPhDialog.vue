<template>
  <div>
    <el-dialog title="温馨提示"  :visible.sync="visible"  width="600px">
      <div style="padding: 20px 0 20px 20px;; font-size: 12px; color: #333333" id="">
        <span>校验项：现金净增加额=期末现金余额-期初现金余额</span>
      </div>
      <div style="background: white;margin: 0px 20px 0 20px; padding: 10px 0 10px 20px">

        <div v-if = "xjllJyx.ce === 0 " style="border-bottom: 1px solid #939393; padding-bottom: 10px"  >
          <img  src="../../../../../assets/img/poise.png" style="height:18px;vertical-align: middle;">平衡
        </div>
        <div  v-else style="border-bottom: 1px solid #939393; padding-bottom: 10px" >
          <img  style="height:18px;vertical-align: middle;" src="../../../../../assets/img/uneven.png">&emsp;差额：<span style="color: #f79311"> {{ce | forThousands}}</span>
        </div>

        <div style="padding: 10px 0 0 0">
          <span style="display: inline-block; width: 34%">现金净增加额</span>
          <span style="display: inline-block; width: 60%">
            <span id="jyx1_equal">{{xjllJyx.ce === 0 ? '=' : '≠'}}</span>
            <span style="margin-left: 100px">期末现金余额-期初现金余额</span></span>
        </div>
        <div style="padding: 10px 0 0 0; color: #999999; font-size: 12px">
          <span style="display: inline-block; width: 39%" id="jyx1_xjtotal">{{xjllJyx.xjlltotal | forThousands}}</span>
          <span style="display: inline-block; width: 49%"><span></span><span style="margin-left: 88px" id="jyx1_kmce">{{accSubtr(xjllJyx.kmqmvalue, xjllJyx.kmqcvalue) | forThousands}}</span></span>
        </div>
      </div>
      <p style= "margin: 10px 20px 0px 20px; font-size: 12px;">说明：不平的原因可能是有些现金类凭证未分析完成，请到凭证管理中查出现金流量分析有误的凭证并修正
      </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="visible = false">现金流量有误凭证</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Big from 'big.js'
export default {
  name: 'XjllPhDialog',
  data () {
    return {
      visible: false
    }
  },
  props: {
    xjllJyx: {}
  },
  methods: {
    show () {
      this.visible = true
    },
    nvlNum (value) {
      if (value === undefined || value === '') {
        return 0
      }
      return value
    },
    // 加法函数
    accAdd (arg1, arg2) {
      return Number(new Big(this.nvlNum(arg1)).add(this.nvlNum(arg2)))
    },
    // 减法函数
    accSubtr (arg1, arg2) {
      return Number(new Big(this.nvlNum(arg1)).sub(this.nvlNum(arg2)))
    }
  }
}
</script>

<style scoped>

</style>
