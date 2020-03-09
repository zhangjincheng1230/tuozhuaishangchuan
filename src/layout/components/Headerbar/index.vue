<template>
  <div class="header-panel">
    <el-row wrap-class="scrollbar-wrapper scrollbar-header">
      <div class="header-left">
        <img class="logo-dzf" src="../../../assets/img/dzf_logo.png" alt="">
        <label class="logo-text">在线会计</label>
        <el-tooltip content="切换系统" placement="right" popper-class="menu-admin" effect="light">
          <i class="el-icon-menu" @click="selectSys"></i>
        </el-tooltip>
      </div>
      <div class="header-right">
        <label
          v-if="corpVersionName"
          class="cp-info version-class"
          :style="`width: auto; background: ${ corpVersionName.indexOf('加盟商') !== -1 ? '#f4b3c' : (corpVersionName.indexOf('旗舰版') !== -1 ? '#16e014' : '#00cf98')}; font-size: 12px;`">
          {{corpVersionName}}
        </label>
        <el-select
          style="width: 280px"
          popper-class="select-company"
          ref="cpNameRef"
          size="mini"
          filterable
          :filter-method="filterCorp"
          show-overflow-tooltip
          @visible-change="onCorpSelectDropDown"
          class="cp-info" v-model="loginCorpId" placeholder="请选择">
          <el-option
            v-for="company in filteredCorp"
            :label="company.uname"
            :value="company.pk_gs"
            :key="company.pk_gs">
          </el-option>
          <template slot="prefix">
            <i @click.stop="selectCP" class="el-icon-search"></i>
          </template>
        </el-select>
        <!--<i class="el-icon-arrow-down"></i>-->
        <el-date-picker
          style="width: 115px;"
          class="cp-date"
          :editable="false"
          :clearable="false"
          prefix-icon="el-icon-arrow-down"
          size="mini"
          value-format="yyyy-MM"
          format="yyyy-MM"
          v-model="loginPeriod"
          @change="changeCompany"
          type="month"
          :picker-options="pickerOptions"
          placeholder="">
        </el-date-picker>
        <div class="user-info">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <label>{{ userName }}</label> <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center">
              <el-dropdown-item><div @click="editPassword">修改密码</div></el-dropdown-item>
              <el-dropdown-item>
                <router-link :to="{name: 'enterpriseInfo'}" style="text-decoration: none;color: #606266">企业信息</router-link>
<!--                <div @click="addTag('企业信息')">企业信息</div>-->
              </el-dropdown-item>
              <el-dropdown-item><div @click="addTag('changelog')">更新日志</div></el-dropdown-item>
<!--              <el-dropdown-item>-->
<!--                <router-link :to="{name: 'infoQuery'}" style="text-decoration: none;color: #606266">信息查询</router-link>-->
<!--&lt;!&ndash;                <div @click="addTag('信息查询')">信息查询</div>&ndash;&gt;-->
<!--              </el-dropdown-item>-->
              <el-dropdown-item><div><a style="text-decoration: none;color: #606266" target="_blank" href="/static/helpdoc/help.html?t=111">帮助手册</a></div></el-dropdown-item>
              <el-dropdown-item><div @click="guide">新手指引</div></el-dropdown-item>
<!--              <el-dropdown-item>-->
<!--                <el-popover-->
<!--                  placement="left"-->
<!--                  width="120"-->
<!--                  trigger="hover">-->
<!--                  <div style="text-align: center; font-size: 13px">-->
<!--                    <div class="select-skin" @click="changeStyle('black')">黑色主题</div>-->
<!--                    <div class="select-skin" @click="changeStyle('blue')">蓝色主题</div>-->
<!--                  </div>-->
<!--                   <label slot="reference" style="line-height: 30px; padding: 2px 0; font-size: 12px;">切换皮肤</label>-->
<!--                </el-popover>-->
<!--              </el-dropdown-item>-->
              <el-dropdown-item><div @click="logout" style="color: rgb(185, 28, 28);">安全退出</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--<label></label>-->
          <!--<i class="el-icon-arrow-down"></i>-->
        </div>
        <RootMeun style="margin-right: 15px;"></RootMeun>
      </div>
    </el-row>
    <el-dialog title="切换系统" :visible.sync="sysListShow" width="350px" :close-on-click-modal="false" :custom-class="'ssoDialog'" :append-to-body="true">
      <ul class="sso-list">
        <li
          v-for="(item, idx) in sysList"
          :key="idx">
          <i class="icon-platform" />
          <a target="_blank" :href="'/api/auth/to/' + item.platformTag+ '/' + userInfo.userid + '?X-ACCESS-TOKEN=' + token">
            {{ item.platformName }}
          </a>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sysListShow = false">关 闭</el-button>
        <el-button type="primary" @click="sysListShow = false, ssoVisible = true">现在验证</el-button>
      </span>
    </el-dialog>
    <el-dialog class="editPassword" style="border-radius: 13px;" size="mini" :close-on-click-modal="false"
                :visible.sync="editPasswordDialog" @close="closeEditPassword('passwordFormData')" title="修改密码" width="380px">
      <div>
        <el-form ref="passwordFormData" :model="passwordFormData" :rules="passwordFormRules" label-width="120px">
          <el-form-item label="输入原始密码:" prop="user_password">
            <el-input type="password" v-model="passwordFormData.user_password" auto-complete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="请输入新密码:" prop="psw2">
            <el-input type="password" v-model="passwordFormData.psw2" auto-complete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码:" prop="psw3">
            <el-input type="password" v-model="passwordFormData.psw3" auto-complete="new-password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEdit('passwordFormData')">提交修改</el-button>
      </div>
    </el-dialog>
    <CorpDialog
      :visible.sync="companySelectVisible"
      single-select
      select-first
      select-on-dblclick
      @selected="changeCompany">
    </CorpDialog>
    <bindSystem v-if="ssoVisible" :ssoVisible.sync="ssoVisible"></bindSystem>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import bindSystem from '@/components/BindSystem'
import {mapGetters} from 'vuex'
import RootMeun from './RootItem'
import { addTag } from '@/libs/tools'
import { getMonthEnd } from '@/utils'
import dataPickerMixin from '@/mixins/date-picker'
import * as MsgUtil from '@/view/Processes/msg-util'
import RSA from 'js-rsa-dave'

const modulus = '00c743e227b9e90d7449e05b1119f5a4a2c8b0a68018060893073cbed32f2055cb5e25d8d0cd67f2134f520c8fe0d699' +
  'd5a565582153cf62779210d37719b89a8b5e13ae361489dd1024345ea91d60e8e1b6e' +
  'dbfe20a813114fc2e59a1b35b18db8a3cec467cf46fcd4d3388bab84e9947d9d6a8855dcecb8dc8ee07bda1771dd9'
const exponent = '010001'
const publicKey = RSA.getKeyPair(exponent, '', modulus)
const introJS = require('intro.js')
export default {
  name: 'HeaderBar',
  mixins: [dataPickerMixin],
  components: {
    RootMeun,
    CorpDialog,
    bindSystem,
    MsgUtil
  },
  data () {
    return {
      ssoVisible: false,
      sysListShow: false,
      editPasswordDialog: false,
      win: window,
      date: '2019-06',
      companyName: '0',
      companySelectVisible: false,
      searchCPName: '',
      currentTableRow: {},
      sysList: [],
      token: '',
      passwordFormData: {
        user_password: '',
        psw2: '',
        psw3: ''
      },
      passwordFormRules: {
        user_password: [
          {required: true, message: '请输入原始密码', trigger: 'blur'},
          { min: 8, message: '密码必须大于8位', trigger: 'blur' }
        ],
        psw2: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          { min: 8, message: '密码必须大于8位', trigger: 'blur' }
        ],
        psw3: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          { min: 8, message: '密码必须大于8位', trigger: 'blur' }
        ]
      },
      filteredCorp: []
    }
  },
  created () {
  },
  computed: {
    ...mapGetters(['system', 'corpVersionName', 'getUserId']),
    corps () {
      return this.$store.getters.corps
    },
    userInfo () {
      return this.$store.getters.getUserInfo
    },
    corpInfo () {
      return this.$store.getters.getLoginCorp
    },
    userName () {
      return this.$store.getters.getLoginUserName
    },
    loginPeriod: {
      get () {
        return this.$store.getters.getLoginDate.substring(0, 7)
      },
      set (period) {
        this.changeLoginDate(period)
      }
    },
    loginCorpId: {
      get () {
        return this.$store.getters.getLoginCorp.pk_gs
      },
      set (corpId) {
        const corp = this.corps.find(row => row.pk_gs === corpId)
        this.changeCompany(corp)
      }
    }
  },
  watch: {
    corps: {
      handler (val) {
        this.filteredCorp = val
      },
      immediate: true
    }
  },
  methods: {
    addTag: addTag,
    changeCompany (corp) {
      this.$store.dispatch('changeLoginCorp', corp).then(res => {
        window.location.href = this.getBaseUrl()
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    changeLoginDate (period) {
      let beginPeriod = this.corpInfo.bdate.substring(0, 7)
      if (period < beginPeriod) {
        this.$message.error('做账日期不能早于建账日期')
        return
      }
      this.$store.dispatch('changeLoginDate', getMonthEnd(period + '-01')).then(res => {
        window.location.href = this.getBaseUrl()
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    getBaseUrl () {
      return window.location.protocol + '//' + window.location.host
    },
    selectCP () {
      let cpNameRef = this.$refs.cpNameRef
      if (cpNameRef.visible) {
        cpNameRef.visible = false
      }
      this.companySelectVisible = true
    },
    changeStyle (e) {
      this.$store.commit('SET_SKIN', e)
      window.localStorage.setItem('DZF_SKIN', e)
      // e === 'black' ? (window.skincode = 'hei') : (window.skincode = 'lan')
      // const firames = [...document.getElementsByTagName('iframe')]
      // firames.map(m => {
      //   const skin = m.contents().getElementById('child-skin')
      //   // skin.href
      // })
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    selectSys () {
      this.ssoVisible = false
      this.$api.System.selectSys().then(res => {
        if (res) {
          this.sysList = res.platformVOSet === null ? [] : res.platformVOSet
          this.token = res.token
        }
        this.sysListShow = true
      })
    },
    editPassword () {
      this.editPasswordDialog = true
    },
    filterCorp (queryText) {
      if (!queryText) {
        this.filteredCorp = this.corps
      } else {
        queryText = queryText.toUpperCase()
        this.filteredCorp = this.corps.filter(row => row.accountProgress.indexOf(queryText) > -1 ||
          row.incode.toUpperCase().indexOf(queryText) > -1 ||
          row.uname.toUpperCase().indexOf(queryText) > -1 ||
          (row.pyfc && row.pyfc.toUpperCase().indexOf(queryText) > -1))
      }
    },
    onCorpSelectDropDown (val) {
      if (val) {
        this.filterCorp()
      }
    },
    submitEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            user_password: RSA.encryptedString(publicKey, this.passwordFormData.user_password),
            psw2: RSA.encryptedString(publicKey, this.passwordFormData.psw2),
            psw3: RSA.encryptedString(publicKey, this.passwordFormData.psw3)
          }
          this.$api.Home.updatePassword(param).then(result => {
            if (result.success) {
              MsgUtil.successMsg(this, result.msg)
              this.editPasswordDialog = false
              this.$store.dispatch('logout').then(() => {
                setTimeout(this.$router.push({name: 'login'}), 2000)
              })
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
          })
        }
      })
    },
    closeEditPassword (formName) {
      this.$refs[formName].resetFields()
    },
    guide () {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        skipLabel: '跳过',
        doneLabel: '我知道了',
        showStepNumbers: false,
        exitOnOverlayClick: false,
        hidePrev: true, // 没有上一个步骤是否隐藏上一步按钮
        hideNext: true // 没有下一个步骤是否隐藏下一步按钮
      }).start()
    }
  },
  mounted () {
    this.changeStyle('black')
    let res = window.localStorage.getItem('introDZF')
    if (!res) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.guide()
          let oDate = new Date()
          oDate.setDate(oDate + 30)
          window.localStorage.setItem('introDZF', 'introDZF=www.dazhangfang.com; expires=' + oDate)
        }, 1000)
      })
    }
  }
}
</script>
<style scoped lang="less">
  /deep/ .el-popover{
    width: 120px !important;
    padding: 12px;
  }
  .select-skin {
    padding: 5px 0;
    cursor: pointer;
  }
  .select-skin:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
  .header-panel .header-right .version-class {
    line-height: 18px;
    vertical-align: middle;
    font-size: 12px;
    margin-left: -30px;
    display: inline-block;
    width: auto;
    background: #ffff3f;
    height: 20px;
    border-radius: 10px;
    padding: 0px 10px;
    color: #000;
  }
  .chi-dropdown .style-meun {
    left: -110px!important;
  }
  .company-select-content {
    margin: -20px 0;
  }
  .user-info {
    display: inline-block;
    color: white;
    float: right;
    font-size:13px;
    font-family:MyriadPro-Regular;
    font-weight:400;
    opacity:0.95;
    width: 130px;
  }
  .header-right .user-info .el-icon-arrow-down {
    margin-left: 10px;
    cursor: pointer;
    font-size: 16px;
    top: 2px;
  }
  .user-info label{
    cursor: pointer;
    color: white;
    font-size: 13px;
    border-left: 1px solid;
    padding-left: 19px;
    display: inline-block;
    height: 21px;
    vertical-align: middle;
    line-height: 21px;
  }
  .header-right .user-info .el-icon-arrow-down:before{
    /*font-weight: 600;*/
    /*font-size: 12px;*/
    color: white;
  }
  .header-left{
    width: 230px;
    height: 100%;
    line-height: 57px;
    display: inline-block;
    float: left;
    padding-left: 15px;
  }
  .logo-dzf {
    width: 47px;
    vertical-align: middle;
    margin-top: -5px;
  }
  .logo-text {
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    vertical-align: middle;
    margin-left: 5px;
  }
  .header-right {
    height: 59px;
    position: relative;
    margin-left: 230px;
    line-height: 57px;
    min-width: 1000px;

  }
  .header-panel .cp-info {
    margin-left: 10px;
    width: 286px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(255,255,255,1);
  }
  .header-right .el-icon-arrow-down {
    color: white;
    margin-left: -21px;
    z-index: 10001;
    position: relative;
  }
  .cp-date {
    margin-right: 30px;
    margin-left: 10px;
  }
 /deep/ .cp-date .el-input__inner{
    background: #202334;
    height: 27px;
    border-radius: 20px;
    color: white;
  }
  .header-panel .cp-info .el-icon-search {
    font-size: 18px;
    cursor: pointer;
    line-height: 57px;
  }
  /*.sso-list{*/
  /*  list-style: none;*/
  /*  width: 100%;*/
  /*  height: 160px;*/
  /*  overflow: auto;*/
  /*}*/
  /*.sso-list li{*/
  /*  width: 48%;*/
  /*  display: inline-block;*/
  /*  float: left;*/
  /*  margin: 5px 0;*/
  /*}*/
  /*.sso-list li:hover {*/
  /*  color: #1b8cf2;*/
  /*}*/
  /*.sso-list li a {*/
  /*  text-decoration-line: none;*/
  /*  color: #0C0C0C;*/
  /*}*/
  /deep/ .editPassword .el-dialog__body{
    padding: 10px 20px 0;
  }
/deep/ .header-right .cp-date .el-input__prefix{
  right: 5px;
}
</style>
<style>
  .introjs-helperLayer{
    box-sizing: content-box;
    position: absolute;
    z-index: 9999998;
    color: white;
    background-color: rgba(0,0,0,.0) !important;
    /*background-color: rgba(255,255,255,.9);*/
    border: 1px solid #777!important;
    border: 1px dashed #fff!important;
    border-radius: 4px;
    box-shadow: 0 2px 15px rgba(0,0,0,.4);
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
  }
  .introjs-helperNumberLayer {
    display: none;
  }
  .introjs-tooltip{
  min-width: 530px !important;
  padding: 30px;
}
.introjs-bullets {
  display: none;
}
.introjs-prevbutton{
  display: none;
}
.introjs-donebutton, .introjs-nextbutton, .introjs-prevbutton{
  background:rgba(2,127,255,1) !important;
  border-radius:4px;
  text-align: center;
  line-height: 25px;
  text-shadow: 0px 0px 0 #fff!important;
  color: white!important;
}
.introjs-tooltipbuttons{
  margin-top: 10px;
}
.introjs-skipbutton {
  margin-right: 13px;
  color: #7a7a7a;
  border: none;
  background: #fff;
}

.introjs-arrow.left{
  width: 0 !important;
}
.introjs-arrow.top {
  width: 0 !important;
  background: none;
}
.introjs-arrow.bottom {
  width: 0 !important;
}
.introjs-disabled, .introjs-disabled:hover, .introjs-disabled:focus{
  border-color: rgba(2,127,255,1);
  background-color: rgba(2,127,255,1);
}
.introjs-button:focus, .introjs-button:active{
  background-image: none !important;
}
.icon-platform {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0E8CF5;
  display: inline-block;
  vertical-align: middle;
  margin: 0 10px;
}
.sso-list{
  list-style: none;
  width: 100%;
  height: 160px;
  overflow: auto;
  border: 1px solid #E6E6E6;
  padding: 5px;
}
.sso-list li{
  width: 48%;
  display: inline-block;
  float: left;
  margin: 5px 0;
}
.sso-list li:hover {
  color: #1b8cf2;
}
.sso-list a {
  text-decoration: none;
}
</style>
