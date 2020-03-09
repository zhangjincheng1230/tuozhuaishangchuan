<template>
  <div>
    <el-dialog title="试算平衡信息"  :visible.sync="visible" :close-on-click-modal="false"
               :close-on-press-escape="false" width="500px">
      <div style="padding: 0px 0 20px 20px;; font-size: 12px; color: #333333" id="">
        <span>校验项：本年期初借贷平衡</span>
      </div>
      <div style="background: white;margin: 0px 20px 0 20px; padding: 10px 0 10px 20px">
        <div v-if="result.yearce === 0" style="border-bottom: 1px solid #939393; padding-bottom: 10px" >
<!--          差额 <span style="font-size: 12px; color: #f79311; margin-left: 20px"></span>-->
          <img src="../../../../../assets/img/poise.png">&emsp;平衡&emsp;
        </div>
        <div v-else style="border-bottom: 1px solid #939393; padding-bottom: 10px" >
          <img style="height:18px " src="../../../../../assets/img/uneven.png">&emsp;差额：<span style="color: #f79311"> {{result.yearce | forThousands}} </span>
        </div>
        <div style="padding: 10px 0 0 0">
          <span style="display: inline-block; width: 39%">借方金额</span>
          <span style="display: inline-block; width: 49%">
            <span v-if="result.yearce === 0"  >=</span>
            <span v-else  >≠</span>
            <span style="margin-left: 100px">贷方金额</span></span>
        </div>
        <div style="padding: 10px 0 0 0; color: #999999; font-size: 12px">
          <span style="display: inline-block; width: 39%" id="v1">{{result.yearjf | forThousands}}</span>
          <span style="display: inline-block; width: 49%"><span></span><span style="margin-left: 110px" id="v2">{{result.yeardf | forThousands}}</span></span>
        </div>
      </div>
      <div style="padding: 20px 0 0 20px; font-size: 12px; color: #333333" >
        <span>校验项：本月期初借贷平衡</span>
      </div>
      <div style="background: white;margin: 20px 20px; padding: 10px 0 10px 20px">
        <div v-if="result.monthce === 0" style="border-bottom: 1px solid #939393; padding-bottom: 10px"  >
          <img  src="../../../../../assets/img/poise.png">&emsp;平衡&emsp;
        </div>
        <div v-else style="border-bottom: 1px solid #939393; padding-bottom: 10px" >
          <img  style="height:18px " src="../../../../../assets/img/uneven.png"><span>&emsp;差额：</span>
          <span style="color: #f79311">  {{result.monthce | forThousands}}  </span>
        </div>
        <div style="padding: 10px 0 0 0">
          <span style="display: inline-block; width: 39%">借方金额</span>
          <span style="display: inline-block; width: 49%">
            <span v-if="result.monthce === 0">=</span>
            <span v-else>≠</span>
            <span style="margin-left: 100px">贷方金额</span></span>
        </div>
        <div style="padding: 10px 0 0 0; color: #999999; font-size: 12px">
          <span style="display: inline-block; width: 39%" id="v5">{{result.monthjf | forThousands}}</span>
          <span style="display: inline-block; width: 49%"><span></span><span id = "v6" style="margin-left: 110px">{{result.monthdf | forThousands}}</span></span>
        </div>
      </div>
      <div v-if="result.monthce === 0 && result.yearce === 0" id="dlg_content" style="padding:10px 20px 20px 0px;clear: both;color:#666;">
        <br> <p  style = "font-seze:18px " >恭喜您录入的初始余额平衡! </p>
      </div>
      <div v-else style="padding:10px 20px 20px 0px;clear: both;color:#666;">
        <div style="clear: both;color:#333;">&emsp;&nbsp;可能导致不平衡的原因：</div>
        <div style="font-size: 12px;">&emsp;&nbsp;1、借贷方科目手工录入的数据是否完整   </div>
        <div style="font-size: 12px;">&emsp;&nbsp;2、通过导账包导入的期初数据中，外系统与本系统的科目匹配是否准确  </div>
        <div style="font-size: 12px;">&emsp;&nbsp;3、通过导账包导入的期初数据中，导入前和导入后的金额是否完整准确 </div>
        <div style="font-size: 12px;">&emsp;&nbsp;4、通过导账包导入的期初数据中，年初开账情况下的本期发生数是否清空 </div>
        <div style="font-size: 12px;">&emsp;&nbsp;5、一级科目数据和其下级科目的数据不一致 </div>
        <div style="font-size: 12px;">&emsp;&nbsp;6、调整以前年度损益、提取盈余公积或进行利润分配 </div>
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
  name: 'SsphDialog',
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
