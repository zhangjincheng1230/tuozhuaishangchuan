<template>
  <div class="app-main">
    <div class="mod-inner" align = "center" >
      <div style = "background-color:rgb(230,230,230); border:1px solid rgb(220,220,220);">
        <div class="steps" style="margin-left:10%;">
          <ul class="xt1">
            <li :class="[isjzcailiaosuccess ? xtli : xtlinot]" style="width:20%;" id="jzstep1"><span></span></li>
            <li :class="[isfzjzsuccess ? xtli : xtlinot]" style="width:20%;" id="jzstep3"><span></span></li>
            <li :class="[isjzzhizaosuccess ? xtli : xtlinot]" style="width:20%;" id="jzstep4"><span></span></li>
            <li :class="[isjzwangongsuccess ? xtli : xtlinot]" style="width:20%;" id="jzstep5"><span></span></li>
            <li :class="[isjzxiaoshousuccess ? xtli : xtlinot]" style="width:20%;" id="jzstep6"><span></span></li>
          </ul>
          <ul>
            <li class="steps4" style="width:19%;font-weight:bold;">结转材料成本</li>
            <li class="steps4" style="width:21%;font-weight:bold;">结转辅助生产成本</li>
            <li class="steps4" style="width:19%;font-weight:bold;">结转制造费用</li>
            <li class="steps4" style="width:21%;font-weight:bold;">结转完工产品成本</li>
            <li class="steps4" style="width:20%;font-weight:bold;">结转销售成本</li>
          </ul>
        </div>
      </div>
      <div :class="[stepsdiv, isjzcailiaosuccess? xtlibgnot : xtlibg]" id = "jzstepdiv1">
        <div class ="stepstitle" align="left" ><p :class="[isjzcailiaosuccess ? ptitlesucess : ptitlefail]" id="ptitle1">结转材料成本</p></div>
        <div :class="[isjzcailiaosuccess ? stepsbodyhidden : stepsbodyshow]" align="center"> <div class="pbody" ><a href='#' @click="jzcailiaocb">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div></div>
        <div :class="[isjzcailiaosuccess ? stepsbodyshow : stepsbodyhidden]" align="center"> <p class="pbody" ><a href='#' @click="canceljiezhuan('1')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
      </div>
      <div :class="[stepsdiv, isfzjzsuccess? xtlibgnot : xtlibg]" id = "jzstepdiv3">
        <div class ="stepstitle" align="left" ><p :class="[isfzjzsuccess ? ptitlesucess : ptitlefail]" id="ptitle3">结转辅助生产成本</p></div>
        <div :class="[isfzjzsuccess ? stepsbodyhidden : stepsbodyshow]" align="center"> <p class="pbody" ><a href='#' @click="jzfuzhusccb">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
        <div :class="[isfzjzsuccess ? stepsbodyshow : stepsbodyhidden]" align="center"> <p class="pbody" ><a href='#' @click="canceljiezhuan('3')" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
      </div>
      <div :class="[stepsdiv, isjzzhizaosuccess? xtlibgnot : xtlibg]" id = "jzstepdiv4">
        <div class ="stepstitle" align="left" ><p :class="[isjzzhizaosuccess ? ptitlesucess : ptitlefail]" id="ptitle4">结转制造费用</p></div>
        <div :class="[isjzzhizaosuccess ? stepsbodyhidden : stepsbodyshow]"  align="center"> <p class="pbody" ><a href='#' @click="jzzhizaofy">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
        <div :class="[isjzzhizaosuccess ? stepsbodyshow : stepsbodyhidden]" align="center"> <p class="pbody" ><a href='#' @click="canceljiezhuan('4')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
      </div>
      <div :class="[stepsdiv, isjzwangongsuccess? xtlibgnot : xtlibg]" id = "jzstepdiv5">
        <div class ="stepstitle" align="left" ><p :class="[isjzwangongsuccess ? ptitlesucess : ptitlefail]" id="ptitle5">结转完工产品成本</p></div>
        <div :class="[isjzwangongsuccess ? stepsbodyhidden : stepsbodyshow]" align="center"> <p class="pbody" ><a href='#' @click="jzwgcpcb">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
        <div :class="[isjzwangongsuccess ? stepsbodyshow : stepsbodyhidden]" align="center"> <p class="pbody" ><a href='#' @click="canceljiezhuan('5')" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
      </div>
      <div :class="[stepsdiv, isjzxiaoshousuccess? xtlibgnot : xtlibg]" id = "jzstepdiv6">
        <div class ="stepstitle" align="left" ><p :class="[isjzxiaoshousuccess ? ptitlesucess : ptitlefail]" id="ptitle6">结转销售成本</p></div>
        <div :class="[isjzxiaoshousuccess ? stepsbodyhidden : stepsbodyshow]" align="center"> <p class="pbody" ><a href='#' @click="jzxiaoshoucb">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
        <div :class="[isjzxiaoshousuccess ? stepsbodyshow : stepsbodyhidden]" align="center"> <p class="pbody" ><a href='#' @click="canceljiezhuan('6')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></p></div>
      </div>
     <div :class="[stepsdiv]" align="center" >
         <div v-if = "isyjjz!==undefined && isyjjz === true" class = 'goonyjjzbtn'><a href='#' @click="goonyjjz" style="color:white;font-size:14px;font-family:'楷体';">继续一键结转</a></div>
         <div :class="[isyjjz!==undefined && isyjjz === true ? quxiaoallbtnyjjz : quxiaoallbtn]"><a href='#' @click="canceljiezhuan('0')" style="color:white;font-size:14px;font-family:'楷体';">取消全部结转</a></div>
      </div>
    </div>
    <NoICIndustryDialog :visible.sync="noicindustryvisible" :jztype = "jztype" :qmclvo="qmclvo" @updateqmclinfo="updateqmclinfo"></NoICIndustryDialog>
    <ZanGuDialog :visible.sync="zgdlgvisible"  :zgdata="zgdata" :qmclvo="qmclvo" :noicjzvos="noicjzvos" :zgurl="zgurl" :cbjzCount="cbjzCount" :jztype="jztype"  @updateqmclinfo="updateqmclinfo"></ZanGuDialog>
    <CostAllocateDialog :visible.sync="noicwangongvisible" :jztype = "jztype" :qmclvo="qmclvo" @updateqmclinfo="updateqmclinfo"></CostAllocateDialog>
  </div>
</template>

<script>
import NoICIndustryDialog from './components/NoICIndustryDialog'
import ZanGuDialog from './components/ZanGuDialog'
import CostAllocateDialog from './components/CostAllocateDialog'
export default {
  name: 'industrycbjz',
  components: { NoICIndustryDialog, ZanGuDialog, CostAllocateDialog },
  data () {
    return {
      qmclvo: this.$route.params.qmclvo,
      isyjjz: this.$route.params.isyjjz,
      stepsdiv: 'stepsdiv',
      xtlibg: 'xtlibg',
      xtlibgnot: 'xtlibgnot',
      stepsbodyshow: 'stepsbodyshow',
      stepsbodyhidden: 'stepsbodyhidden',
      ptitlesucess: 'ptitlesucess',
      ptitlefail: 'ptitlefail',
      xtlinot: 'xtlinot',
      xtli: 'xtli',
      noicindustryvisible: false,
      jztype: '',
      zgdlgvisible: false,
      zgdata: [],
      noicjzvos: [],
      zgurl: '',
      cbjzCount: '',
      noicwangongvisible: false,
      quxiaoallbtnyjjz: 'quxiaoallbtnyjjz',
      quxiaoallbtn: 'quxiaoallbtn'
    }
  },
  computed: {
    isjzcailiaosuccess () {
      return this.qmclvo.cbjz1 === '是' || this.qmclvo.cbjz1 === 'Y'
    },
    isfzjzsuccess () {
      return this.qmclvo.cbjz3 === '是' || this.qmclvo.cbjz3 === 'Y'
    },
    isjzzhizaosuccess () {
      return this.qmclvo.cbjz4 === '是' || this.qmclvo.cbjz4 === 'Y'
    },
    isjzwangongsuccess () {
      return this.qmclvo.cbjz5 === '是' || this.qmclvo.cbjz5 === 'Y'
    },
    isjzxiaoshousuccess () {
      return this.qmclvo.cbjz6 === '是' || this.qmclvo.cbjz6 === 'Y'
    }
  },
  watch: {
    '$route' (to, from) {
      // if (from.name === 'qmcl' && to.name === 'industrycbjz') {
      //   this.qmclvo = this.$route.params.qmclvo
      // }
    }
  },
  methods: {
    // 结转材料成本
    async jzcailiaocb () {
      // 校验材料成本结转模板
      let isgoon = false
      const paramters = {pk_gs: this.qmclvo.pk_gs, jztype: '1'}
      await this.$api.qmcl.checkCbjzmb(paramters).then(result => {
        if (result.success === true) {
          isgoon = true
        } else {
          isgoon = false
          this.showError(result.msg)
        }
      }).catch(e => {
      })
      if (!isgoon) {
        return
      }
      this.jztype = 1
      this.noicindustryvisible = true
    },
    // 结转辅助成本
    jzfuzhusccb () {
      const paramers = {qmvo: this.qmclvo, cbjzcount: '3', isgy: 'Y'}
      this.$api.qmcl.jzfuzhusccb(paramers).then(result => {
        if (result.success === true) {
          this.successMsg(result.msg)
          this.qmclvo = result.rows[0]
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
      })
    },
    // 结转制造费用
    jzzhizaofy () {
      const paramers = {qmvo: this.qmclvo, cbjzcount: '4', isgy: 'Y'}
      this.$api.qmcl.jzzhizaofy(paramers).then(result => {
        if (result.success === true) {
          this.successMsg(result.msg)
          this.qmclvo = result.rows[0]
        } else {
          this.showError(result.msg)
        }
      }).catch(e => {
      })
    },
    // 结转完工产品
    async jzwgcpcb () {
      let isgoon = false
      const paramters = {pk_gs: this.qmclvo.pk_gs, jztype: '2'}
      await this.$api.qmcl.checkCbjzmb(paramters).then(result => {
        if (result.success === true) {
          isgoon = true
        } else {
          isgoon = false
          this.showError(result.msg)
        }
      }).catch(e => {
      })
      if (!isgoon) {
        return
      }
      this.jztype = 2
      this.noicwangongvisible = true
    },
    async jzxiaoshoucb () {
      let isgoon = false
      const paramters = {pk_gs: this.qmclvo.pk_gs, jztype: '3'}
      await this.$api.qmcl.checkCbjzmb(paramters).then(result => {
        if (result.success === true) {
          isgoon = true
        } else {
          isgoon = false
          this.showError(result.msg)
        }
      }).catch(e => {
      })
      if (!isgoon) {
        return
      }
      this.jztype = 3
      this.noicindustryvisible = true
    },
    // 更新期末处理
    updateqmclinfo (result) {
      if (result && result.success === true) {
        if (result.msg !== null && result.msg.indexOf('暂估') === 0) { //  不启用库存，加载暂估框
          this.zgdata = result.rows
          this.noicjzvos = result.noicjzvos
          if (this.jztype === 1) { //  材料
            this.cbjzCount = 1
          } else if (this.jztype === 3) { //  销售
            this.cbjzCount = 6
          }
          this.zgurl = 2
          this.zgdlgvisible = true
        } else {
          this.qmclvo = result.rows[0]
          this.successMsg(result.msg)
        }
      }
    },
    canceljiezhuan (index) {
      if (index === null || index === undefined) {
        return
      }
      this.$confirm('您确认想要取消结转吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const paramers = {qmvo: this.qmclvo, cbjzcount: index}
        this.$api.qmcl.canceljiezhuan(paramers).then(result => {
          if (result.success === true) {
            this.qmclvo = result.rows[0]
            this.successMsg(result.msg)
          } else {
            this.showError(result.msg)
          }
        }).catch(e => {
        })
      }).catch(() => { // 取消操作
      })
    },
    // 继续一键结转
    goonyjjz () {
      if (this.qmclvo.cbjz1 === '是' && this.qmclvo.cbjz3 === '是' && this.qmclvo.cbjz4 === '是' && this.qmclvo.cbjz5 === '是' && this.qmclvo.cbjz6 === '是') {
        const params = {noicisyjjz: true}
        this.$router.push({name: 'yjjz', params: params})
      } else {
        this.showError('请完成所有的成本结转！')
      }
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
    },
    successMsg (msg) {
      this.$message({
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: msg,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  li {
    list-style: none;
  }
  a {
    cursor: pointer;
    color: #555;
    text-decoration: none;
    outline: none;
  }

  a:hover {
    color: #2383c0;
    outline: none;
  }

  a:focus {
    outline: none;
  }

  a img {
    border: 0;
  }

  em, i {
    font-style: normal;
  }
  .ptitlesucess{
    padding-top: 10%;
    color: rgb(255,255,255);
    font-size: 16px;
    font-family: "楷体";
    padding-left: 15px;
    font-weight: bold;
  }
  .ptitlefail{
    color: rgb(30, 138, 211);
    font-size: 16px;
    font-family: "楷体";
    padding-top: 5%;
    padding-left: 15px;
    font-weight: bold;
  }
  .stepsbodyshow{
    display: block;
  }
  .stepsbodyhidden{
    display: none;
  }
  .mod-inner{
    position:relative;
  }
  .steps {
    margin-right: 18px;
  }
  .steps:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
  }
  .steps ul {
    overflow: hidden;
  }
  .steps ul li {
    float: left;
  }
  .steps4 {
    height: 30px;
    font-size: 14px;
    width: 20%;
    line-height: 30px;
    text-align: left;
    color: #898888;
  }
  .xt1 li {
    height: 70px;
    width: 20%;
    line-height: 70px;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }
  .xtli {
    background: url(../../../../assets/img/jzstatus.png) no-repeat;
    background-position: 0px 18px;
  }
  .xtlinot {
    background: url(../../../../assets/img/notjzstasus.png) no-repeat;
    background-position: 0px 18px;
  }
  .stepsdiv {
    width: 200px;
    height: 153px;
    float: left;
    margin-left: 10%;
    margin-top: 45px;
  }
  .xtlibg {
    background: url(../../../../assets/img/toqijz.png) no-repeat;
  }
  .xtlibgnot {
    background: url(../../../../assets/img/toquxiaojz.png) no-repeat;
  }
  .pbody {
    width: 70px;
    height: 30px;
    margin-top: 70px;
  }
  .pbody a {
    width: 70px;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
  }
  .goonyjjzbtn {
    margin-top: 15%;
    background-color: rgb(42, 135, 213);
    width: 110px;
    height: 30px;
    line-height: 30px;
  }
  .quxiaoallbtnyjjz {
    margin-top: 15%;
    background-color: rgb(42, 135, 213);
    width: 110px;
    height: 30px;
    line-height: 30px;
  }
  .quxiaoallbtn {
    margin-top: 30%;
    background-color: rgb(42, 135, 213);
    width: 110px;
    height: 30px;
    line-height: 30px;
  }
</style>
