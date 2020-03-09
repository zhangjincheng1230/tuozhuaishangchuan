<template>
  <div class="app-main">
    <div class="kj-container"  v-loading="loading" :element-loading-text="loadingtext"
         element-loading-spinner="el-icon-loading">
      <div class="kj-head">
        <div class="query-info">
          <div >
            <span style="line-height:28px;font-size:14px; ">{{corpname}}</span>
            <span style="">{{qj}}</span>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="ongz">关账</el-button>
          <el-button @click="onfangz">反关账</el-button>
          <el-button @click="reflesh">刷新</el-button>
          <el-button @click="onreturn">返回</el-button>
        </div>
      </div>
      <div class="kj-main" style="overflow-y: auto">
          <el-collapse v-model="activeNames">
            <el-collapse-item style="padding-left: 64px;padding-right: 50px;" name="cwcl">
              <template slot="title">
                <div style="width: 100%;border-bottom: 1px solid #657071;">
                  <div style="float: left;font-size: 14px;  margin-left: 20px">财务处理完整性</div>
                  <div style="float: right; margin-right: 20px">共有{{resdata.cwcllen}}类项目，其中<span style="color:orange">{{resdata.uncwcllen}}</span>项未通过</div>
                </div>
              </template>
              <div class="typelist_body">
                <ul v-for="cwcl of resdata.cwcl" class="clearfix" >
                  <li >
                    <div class="lists_left">
                      <div :class="[(cwcl.vmemo ==='通过'?'toasticon':'toasticon2')]"></div>
                      <span  class="lists_tips">{{cwcl.xm}}</span>
                      <strong style="color:red">{{cwcl.bz}}</strong>
                    </div>
                    <div class="lists_right">
                      <span  class="lists_tips">{{cwcl.vmemo}}</span>
                      <span class="viewdata">
                     <a href="javascript:" style="margin-right: 26px" @click="lcJd(cwcl.name,cwcl.url, cwcl.paramstr)">查看</a>
                    </span>
                      <span style="margin-right: 26px" v-show="cwcl.xm ==='凭证是否断号' && cwcl.issuccess ==='否'">
                      <a href="javascript:" @click="autosort(cwcl.name)">自动整理</a>
                    </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item style="padding-left: 64px;padding-right: 50px" name="yeyc">
              <template slot="title">
                <div style="width: 100%;border-bottom: 1px solid  #657071;">
                  <div style="float: left;font-size: 14px;  margin-left: 20px">余额异常</div>
                  <div style="float: right; margin-right: 20px">共有{{resdata.yeyclen}}类项目，其中<span style="color:orange">{{resdata.unyeyclen}}</span>项未通过</div>
                </div>
              </template>
              <div class="typelist_body">
                <ul  v-for="yeyc of resdata.yeyc" class="clearfix" v-show="showobj.showyeyc" >
                  <li >
                    <div  class="lists_left">
                      <div :class="[(yeyc.vmemo ==='通过'?'toasticon':'toasticon2')]"></div>
                      <span>{{yeyc.xm}}</span>
                    </div>
                    <div class="lists_right">
                      <span  class="lists_tips">{{yeyc.vmemo}}</span>
                      <span class="viewdata">
                  <a href="javascript:" style="margin-right: 26px" @click="lcJd(yeyc.name,yeyc.url, yeyc.paramstr)">查看</a>
                 </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item style="padding-left: 64px;padding-right: 50px" name="wlyc">
              <template slot="title">
                <div style="width: 100%;border-bottom: 1px solid  #657071;">
                  <div style="float: left;font-size: 14px;  margin-left: 20px">往来异常</div>
                  <div style="float: right; margin-right: 20px">共有{{resdata.wlyclen}}类项目，其中<span style="color:orange">{{resdata.unwlyclen}}</span>项未通过</div>
                </div>
              </template>
              <div class="typelist_body">
                <ul v-for="wlyc of resdata.wlyc" class="clearfix">
                  <li >
                    <div class="lists_left">
                      <div :class="[(wlyc.vmemo ==='通过'?'toasticon':'toasticon2')]"></div>
                      <span>{{wlyc.xm}}</span>
                    </div>
                    <div class="lists_right">
                      <span  class="lists_tips">{{wlyc.vmemo}}</span>
                      <span class="viewdata">
                  <a href="javascript:" style="margin-right: 26px" @click="lcJd(wlyc.name,wlyc.url,wlyc.paramstr)">查看</a>
                 </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item style="padding-left: 64px;padding-right: 50px" name="gjzb">
              <template slot="title">
                <div style="width: 100%;border-bottom: 1px solid  #657071;">
                  <div style="float: left;font-size: 14px;  margin-left: 20px">关键指标</div>
                  <div style="float: right; margin-right: 20px">共有{{resdata.gjzblen}}类项目，其中<span style="color:orange">{{resdata.ungjzblen}}</span>项未通过</div>
                </div>
              </template>
              <div class="typelist_body">
                <ul v-for="gjzb in resdata.gjzb" class="clearfix" >
                  <li >
                    <div class="lists_left">
                      <div :class="[(gjzb.vmemo ==='通过'?'toasticon':'toasticon2')]"></div>
                      <span>{{gjzb.xm}}</span>
                    </div>
                    <div class="lists_right">
                      <span  class="lists_tips">{{gjzb.vmemo}}</span>
                      <span :class="[((gjzb.xm !=='资产负债表与利润表勾稽关系是否平衡' && gjzb.vmemo !=='无法检查') ?'viewdata':'viewdata_display')]"><a href="#"   style="margin-right: 26px" @click="lcJd(gjzb.name,gjzb.url,gjzb.paramstr)">查看</a></span>
                      <span :class="[((gjzb.xm ==='资产负债表与利润表勾稽关系是否平衡' && gjzb.vmemo !=='无法检查') ?'viewdata':'viewdata_display')]">
                      <a href="javascript:;" style="margin-right: 26px" @click="showGjgx(gjzb.gjgx)">查看</a>
                  </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>

            <el-collapse-item style="padding-left: 64px;padding-right: 50px" name="jysjfx">
              <template slot="title">
                <div style="width: 100%;border-bottom: 1px solid  #657071;">
                  <div style="float: left;font-size: 14px; margin-left: 20px">经营数据分析</div>
                  <div style="float: right; margin-right: 20px">共有{{resdata.jysjfxlen}}类项目，其中<span style="color:orange">{{resdata.unjysjfxlen}}</span>项未通过</div>
                </div>
              </template>
              <div class="typelist_body">
                <ul  v-for="jysjfx in resdata.jysjfx" class="clearfix" >
                  <li >
                    <div class="lists_left">
                      <div :class="[(jysjfx.vmemo ==='通过'?'toasticon':'toasticon2')]"></div>
                      <span>{{jysjfx.xm}}</span>
                    </div>
                    <div class="lists_right">
                      <span  class="lists_tips">{{jysjfx.vmemo}}</span>
                      <span class="viewdata" style="float:right">
                        <a href="javascript:;"   @click="setjysjfx(jysjfx.min,jysjfx.max,jysjfx.xm)">
                         <div class="setting"></div>
                        </a>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>

            <el-collapse-item style="padding-left: 64px;padding-right: 50px" v-show="resdata.xgmzbshow" name="xgmzb">
              <template slot="title">
                <div style="width: 100%;border-bottom: 1px solid  #657071;">
                  <div style="float: left;font-size: 14px; font-weight: 600; margin-left: 20px">小规模指标检查</div>
                  <div style="float: right; margin-right: 20px">共有{{resdata.xgmzblen}}类项目，其中<span style="color:orange">{{resdata.unxgmzblen}}</span>项未通过</div>
                </div>
              </template>
              <div class="typelist_body">
                <ul v-for="xgmzb in resdata.xgmzb" class="clearfix" >
                  <li >
                    <div class="lists_left">
                      <div :class="[(xgmzb.vmemo ==='通过'?'toasticon':'toasticon2')]"></div>
                      <span>{{xgmzb.xm}}</span>
                    </div>
                    <div class="lists_right">
                      <span  class="lists_tips">{{xgmzb.vmemo}}</span>
                      <span class="viewdata" style="float:right">
                        <a href="javascript:;"  @click="setxgmzb(xgmzb.yjz,xgmzb.xm)">
                          <div class="setting"></div>
                        </a>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
          </el-collapse>
      </div>
      <noblance-dialog ref="noblancedialog" ></noblance-dialog>
      <set-dialog ref="setdialog" @reflesh="reflesh"></set-dialog>
      <wlgz-hl-dialog ref="wlgzhldialog" @reflesh="reflesh"></wlgz-hl-dialog>
    </div>
  </div>
</template>

<script>
import NoblanceDialog from '@/view/accounting/jzcl/qmgzbg/components/NoblanceDialog'
import SetDialog from '@/view/accounting/jzcl/qmgzbg/components/SetDialog'
import WlgzHlDialog from '@/view/accounting/jzcl/qmgzbg/components/WlgzHlDialog'
export default {
  name: 'qmgzbg',
  components: {
    NoblanceDialog,
    SetDialog,
    WlgzHlDialog
  },
  data () {
    return {
      name: 'qmgzbg',
      activeNames: [],
      loading: false,
      qj: '',
      cname: '',
      corpIds: '',
      row: {},
      resdata: {},
      loadingtext: '数据加载中，请稍候...',
      showobj: {
        showcwcl: true,
        showyeyc: true,
        showwlyc: true,
        showgjzb: true,
        showjysjfx: true,
        showxgmzb: true
      }
    }
  },
  watch: {
    routerParam: {
      handler (val) {
        if (val) {
          this.qj = val.qj
          this.corpname = val.corpname
          this.corpIds = val.pk_gs
          this.row = val
          this.reflesh()
        }
      },
      immediate: true
    }
  },
  props: {
    routerParam: {
      type: Object
    }
  },
  computed: {
  },
  created () {
    // this.reflesh()
  },
  methods: {
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue, 2, this.bshowzero === 'Y')
    },
    // 联查
    lcJd (name, url, paramstr) {
      if (url) {
        if (url === 'voucher-manage') {
          if (!this.$hasPermission('voucher-manage')) {
            return
          }
          this.$router.push({
            name: url,
            params: {
              routeParam: Object.assign({id: this.name}, JSON.parse(paramstr))
            }
          })
        } else {
          if (name !== null && name.length > 0 &&
            name.startsWith('往来挂账混乱') && typeof url !== 'undefined') {
            let dataArr = url.length !== 0 ? url.split('#') : ''
            console.log(dataArr)
            let list_ = name.replace('往来挂账混乱', '').split(',')
            console.log(list_)
            let objarray = new Array()
            for (let i = 0; i < dataArr.length; i++) {
              let obj = new Object()
              let dataDetail = dataArr[i].split(',')
              let pk = dataDetail[0]
              let fzlb = dataDetail[1]
              let fzhsCode = dataDetail[2]

              let name = dataDetail[3]
              let period = dataDetail[4]

              let yssum = this.$options.filters.forThousands(dataDetail[5], 2)
              let yssum1 = this.$options.filters.forThousands(dataDetail[6], 2)
              let yfsum = this.$options.filters.forThousands(dataDetail[7], 2)
              let yfsum1 = this.$options.filters.forThousands(dataDetail[8], 2)
              let qtys = this.$options.filters.forThousands(dataDetail[9], 2)
              let qtyf1 = this.$options.filters.forThousands(dataDetail[10], 2)

              obj.gzdx = name
              obj.fzlb = fzlb
              obj.fzhsCode = fzhsCode
              obj.period = period

              obj.yskmbm = list_[0]
              obj.yskmmc = '应收账款'
              obj.yssum = yssum

              obj.yuskmbm = list_[1]
              obj.yuskmmc = '预收账款'
              obj.yussum = yssum1

              obj.yfkmbm = list_[2]
              obj.yfkmmc = '应付账款'
              obj.yfsum = yfsum

              obj.yufkmbm = list_[3]
              obj.yufkmmc = '预付账款'
              obj.yufsum = yfsum1

              obj.qtyskmbm = list_[4]
              obj.qtyskmmc = '其他应收款'
              obj.qtyssum = qtys

              obj.qtyfkmbm = list_[5]
              obj.qtyfkmmc = '其他应付款'
              obj.qtyfsum = qtyf1

              objarray[objarray.length] = obj
            }
            this.$refs.wlgzhldialog.show(objarray, paramstr)
            return
          }
          if (!this.$hasPermission(url)) {
            return
          }
          this.$router.push({
            name: url,
            params: {
              routerParam: Object.assign({id: this.name}, JSON.parse(paramstr))
            }
          })
        }
      }
    },
    query () {
      this.loading = true
      this.loadingtext = '数据加载中，请稍候...'
      this.$api.qmgzbg.query(this.getQueryPram()).then(result => {
        this.loading = false
        if (result.success === true) {
          this.resdata = result.data
          this.resdata.cwcllen = result.data.cwcl.length
          this.resdata.yeyclen = result.data.yeyc.length
          this.resdata.wlyclen = result.data.wlyc.length
          this.resdata.gjzblen = result.data.gjzb.length
          this.resdata.jysjfxlen = result.data.jysjfx.length
          this.resdata.xgmzblen = this.getDataLength(result.data.xgmzb)
          this.resdata.xgmzbshow = this.getXgmZbShow(result.data.xgmzb)
          this.resdata.uncwcllen = this.getUnSuccess(result.data.cwcl)
          this.resdata.unyeyclen = this.getUnSuccess(result.data.yeyc)
          this.resdata.unwlyclen = this.getUnSuccess(result.data.wlyc)
          this.resdata.ungjzblen = this.getUnSuccess(result.data.gjzb)
          this.resdata.unjysjfxlen = this.getUnSuccess(result.data.jysjfx)
          this.resdata.unxgmzblen = this.getUnSuccess(result.data.xgmzb)
          this.activeNames = ['cwcl', 'yeyc', 'wlyc', 'gjzb', 'jysjfx', 'xgmzb']
        } else {
          this.showError(result.msg)
        }
      })
    },
    getUnSuccess (data) {
      let unsuccess = 0
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].issuccess === '否') {
            unsuccess++
          }
        }
      }
      return unsuccess
    },
    getDataLength (data) {
      if (data != null) {
        return data.length
      }
      return 0
    },
    getXgmZbShow (data) {
      const length = this.getDataLength(data)
      if (length != null && length > 0) {
        return true
      }
      return false
    },
    getQueryPram () {
      return {
        qjq: this.qj,
        corpIds: this.corpIds
      }
    },
    // 自动整理
    autosort () {
      this.loading = true
      this.loadingtext = '处理中，请耐心等待....'
      const param = {
        begindate: this.qj + '-01',
        enddate: this.qj + '-01',
        corpIds: this.corpIds,
        qjq: this.qj
      }
      this.$api.qmgzbg.autoSort(param).then(result => {
        this.loading = false
        if (result.success === true) {
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
        this.reflesh()
      }).catch(e => {
        this.loading = false
      })
    },
    // 关账
    ongz () {
      const param = {list: JSON.stringify([this.row])}
      this.loading = true
      this.$api.qmgzbg.ongz(param).then(result => {
        this.loading = false
        if (result.success === true) {
          this.successMsg(result.msg)
          this.row.isgz = '是'
        } else {
          this.showError(result.msg)
        }
        this.reflesh()
      }).catch(e => {
        this.loading = false
      })
    },
    // 反关账
    onfangz () {
      if (this.row.isgz === undefined || this.row.isgz === '否') {
        this.showError('所选期间未关账，不能反关账')
        return
      }
      this.loading = true
      this.$api.qmgzbg.checkLaterMonthGz({data: JSON.stringify(this.row)}).then(result => {
        this.loading = false
        if (result === true) {
          this.$confirm('是否同时取消以后月份的关账状态', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            this.postfangz(true)
          }).catch(() => { // 取消操作
            this.postfangz(false)
          })
        } else {
          this.postfangz(false)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    postfangz (laterMonth) {
      this.loading = true
      this.$api.qmgzbg.onfangz({list: JSON.stringify([this.row]), laterMonth: laterMonth}).then(result => {
        this.loading = false
        if (result.success === true) {
          this.row.isgz = '否'
          this.successMsg(result.msg)
        } else {
          this.showError(result.msg)
        }
        this.reflesh()
      }).catch(e => {
        this.loading = false
      })
    },
    reflesh () {
      this.query()
    },
    // 返回
    onreturn () {
      this.$router.push({name: 'qmgz'})
    },
    // 勾稽关系
    showGjgx (gjgx) {
      this.$refs.noblancedialog.show(gjgx.ce, gjgx.wfp, gjgx.jlr)
    },
    setjysjfx (min, max, xm) {
      this.$refs.setdialog.show(xm, min, max, null, 'jysjfx', this.corpIds)
    },
    setxgmzb (yjz, xm) {
      this.$refs.setdialog.show(xm, null, null, yjz, 'xgmzb', this.corpIds)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
    },
    successMsg (msg) {
      this.$message({ dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'success' })
    }
  }
}
</script>

<style scoped>
  /*总账关账报告  */
  .typelist .typelist_top {height:48px;line-height:48px;padding-left:64px;padding-right:50px;border-bottom:1px solid #3EA8DF;box-sizing:border-box;}
  .typelist .typelist_top .title_left{
    font-weight:600;font-size:16px;float:left;
  }
  .typelist .typelist_top .title_right{float:right;}

  .typelist .typelist_top .toggleicon{margin-top:16px;margin-right:30px;width:16px;height:16px;float:right;}
  .typelist .typelist_top .toggleicon2{margin-top:16px;margin-right:30px;width:16px;height:16px;float:right;}
  .typelist .typelist_top .typelist_tip{margin-right:26px;float:right;}
  .typelist .typelist_body{width:100%;}
  .typelist_body li{height:32px;margin:0 0px;box-sizing:border-box;}
  .typelist_body li:hover{background:#E7EAF4;}
  .typelist_body li .lists_left{float:left;margin-left:20px;}
  .toasticon{margin-top:8px;background:url(../../../../assets/img/yes.png);margin-right:10px;width:16px;height:16px;float:left;}
  .toasticon2{margin-top:8px;background:url(../../../../assets/img/err.png);margin-right:10px;width:16px;height:16px;float:left;}
  .typelist_body li .lists_left span{line-height:32px;color: rgb(85, 85, 85);}
  .typelist_body li .lists_right{float:right; color: rgb(85, 85, 85);}
  .typelist_body li .lists_right span{line-height:32px;}
  .typelist_body li .lists_right .setting{margin-top:8px;margin-right:30px;width:16px;height:16px;float:right;}
  .typelist_body li .lists_right .lists_tips{margin-right:20px;}
  .typelist_body li .lists_right .viewdata{margin-right:26px;}
  .setting{background:url(../../../../assets/img/sl.png);}
  .typelist .typelist_top .toggleicon{background:url(../../../../assets/img/down-l.png) 3px 5px no-repeat;}
  .typelist .typelist_top .toggleicon2{background:url(../../../../assets/img/up-l.png) 3px 5px no-repeat;}
  .typelist .typelist_top {border-bottom: 1px solid #3EA8DF;}
  .viewdata_display{ display:none }
    li {  list-style: none;}
   a { text-decoration: none;color: rgb(85, 85, 85);}
</style>
