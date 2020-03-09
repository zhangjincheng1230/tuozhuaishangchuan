<template>
  <div>
    <el-dialog title="试算平衡信息"  :visible.sync="visible" :modal="false"  width="570px">
      <div style="padding: 0px 0 20px 20px;; font-size: 12px; color: #333333" >
        <span>校验项：资产=负债+所有者权益</span>
      </div>
      <div style="background: white;margin: 0px 20px 0 20px; padding: 10px 0 10px 20px">

        <div v-if="zc === fzaddqy" style="border-bottom: 1px solid #939393; padding-bottom: 10px">
          <img src="../../../../../assets/img/poise.png" style="height:18px;vertical-align: middle;">&emsp;平衡&emsp;
        </div>

        <div v-else style="border-bottom: 1px solid #939393; padding-bottom: 10px"  >
          <img style="height:18px;vertical-align: middle;" src="../../../../../assets/img/uneven.png">&emsp;差额：
          <span style="color: #f79311"> {{ce | forThousands}}</span>
        </div>

        <div style="padding: 10px 0 0 0">
          <span style="display: inline-block; width: 39%">资产</span>
          <span style="display: inline-block; width: 49%">
            <span id="jyx1_equal">{{zc === fzaddqy ? '=' : '≠'}}</span>
          <span style="margin-left: 100px">负债+所有者权益</span></span>
        </div>
        <div style="padding: 10px 0 0 0; color: #999999; font-size: 12px">
          <span style="display: inline-block; width: 39%" id="jyx1_zc">{{zc | forThousands}}</span>
          <span style="display: inline-block; width: 49%"><span></span><span style="margin-left: 110px" id="jyx1_fzaddqy">{{fzaddqy | forThousands}}</span></span>
        </div>

      </div>

      <div style= "display:none; padding: 20px 0 0 20px; font-size: 12px; color: #333333" >
        <span>校验项：未分配利润本年累计=净利润本年累计</span>
        <img title="未分配利润本年累计=资产负债表中“未分配利润（期末余额-年初余额）”<br> 净利润本年累计=利润表中“净利润（本年累计金额）”"
             class="easyui-tooltip tooltip-f" src="../../../../../assets/img/helptool.png" style="vertical-align: bottom;">
      </div>

      <div style="padding:10px 20px 20px 20px;clear: both;color:#666;">
        <div style="clear: both;color:#333;">
          &emsp;&nbsp;可能导致不平衡的原因：
        </div>
        <div id="div_nobalance">
          <div v-for="item in msglist" style = "font-size:12px">
            &emsp;&nbsp; {{item[0]}} <a href="javascript:void(0)" v-show="item[1]" @click="linkUrl(item[1], item[2], item[3])">查看</a>
          </div>
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
import {accAdd, accSubtr, nvlNum} from '@/utils'

export default {
  name: 'SsphDialog',
  data () {
    return {
      visible: false
    }
  },
  props: {
    zcfzjyx: {},
    msglist: {}
  },
  computed: {
    zc () {
      return nvlNum(this.zcfzjyx.zcvalue)
    },
    fz () {
      return nvlNum(this.zcfzjyx.fzvalue)
    },
    qyvalue () {
      return nvlNum(this.zcfzjyx.qyvalue)
    },
    fzaddqy () {
      return accAdd(this.zcfzjyx.fzvalue, this.zcfzjyx.qyvalue)
    },
    wfpvlaue () {
      return nvlNum(this.zcfzjyx.wfpvlaue)
    },
    jlrvalue () {
      return nvlNum(this.zcfzjyx.jlrvalue)
    },
    jyx2show () {
      return this.zcfzjyx.bshowjyx2
    },
    ce () {
      return accSubtr(this.zc, this.fzaddqy)
    }
  },
  methods: {
    linkUrl (name, url, paramstr) {
      this.$router.push({
        name: url,
        params: {
          routerParam: Object.assign({id: 'zcfz'}, JSON.parse(paramstr))
        }
      })
    },
    show () {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
