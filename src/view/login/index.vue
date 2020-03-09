<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-text="登录中..."
    element-loading-spinner="el-icon-loading"
    class="login-main"
  >
    <div class="header">
      <div class="top">
        <div class="top_logo">
          <img src="@/assets/img/login/login-logo.png" />
        </div>
        <div class="headerA">
          <div>智能财税</div>
          <div>引领未来</div>
        </div>
        <div class="headerB">|&nbsp;在线会计</div>
      </div>
    </div>
    <div class="login-form">
      <div class="login-title">在线会计登录</div>
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item prop="user">
          <el-input
            v-model="formData.user"
            placeholder="请输入您的用户名"
            prefix-icon="el-icon-user"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入您的密码"
            prefix-icon="el-icon-lock"
            show-password
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verify">
          <el-input
            ref="verifyInput"
            v-model="formData.verify"
            placeholder="请输入验证码"
            @keydown.enter.native="login()"
            style="width: 120px"
          ></el-input>
          <div class="verify-img" title="点击更换验证码">
            <img @click="changeVerifyCode" id="codeImg" :src="verifyImgSrc" />
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 25px">
          <el-button type="primary" style="width: 250px;" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="backg"></div>
    <CorpDialog
      ref="corpRef"
      :visible.sync="dialogVisible"
      single-select
      select-first
      @selected="handleCorpSelect"
    ></CorpDialog>
    <bind-system v-if="ssoVisible" :sso-visible.sync="ssoVisible" @close="closeSSO" />
    <div class="bottom">
      <a href="http://www.beian.miit.gov.cn/publish/query/indexFirst.action" target="_blank"><p>©2019 大账房—财务在线网站 | 京ICP备15001859号-1</p></a>
    </div>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import bindSystem from '@/components/BindSystem'
import { getMonthEnd } from '@/utils'
import RSA from 'js-rsa-dave'

const modulus = '00c743e227b9e90d7449e05b1119f5a4a2c8b0a68018060893073cbed32f2055cb5e25d8d0cd67f2134f520c8fe0d699' +
  'd5a565582153cf62779210d37719b89a8b5e13ae361489dd1024345ea91d60e8e1b6e' +
  'dbfe20a813114fc2e59a1b35b18db8a3cec467cf46fcd4d3388bab84e9947d9d6a8855dcecb8dc8ee07bda1771dd9'
const exponent = '010001'
const publicKey = RSA.getKeyPair(exponent, '', modulus)
export default {
  name: 'login',
  components: {
    CorpDialog,
    bindSystem
  },
  data () {
    return {
      ssoVisible: false,
      loading: false,
      formData: {},
      key: '',
      dialogVisible: false,
      verifyImgSrc: '',
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.changeVerifyCode()
  },
  methods: {
    login (force) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$refs.verifyInput.blur()
          this.loading = true
          this.$api.System.login({
            date: getMonthEnd(new Date()),
            'user_code': RSA.encryptedString(publicKey, this.formData.user),
            'user_password': RSA.encryptedString(publicKey, this.formData.password),
            verify: this.formData.verify,
            key: this.key,
            force: force ? '1' : '0'
          }).then(res => {
            this.loading = false
            console.log('login------------------>', res)
            if (res.rows) {
              this.dialogVisible = true
              this.$store.commit('setUserInfo', res.rows)
            } else if (res.status === -100) {
              this.$confirm('该用户已经登录，是否强制退出？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                iconClass: 'el-icon-warning-outline',
                center: true,
                closeOnClickModal: false,
                closeOnPressEscape: false
              }).then(() => {
                this.login(true)
              })
            } else {
              this.$message.error(res.msg)
              this.changeVerifyCode()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleCorpSelect (corp) {
      const loginDate = getMonthEnd(corp.accountProgressDate)
      this.$api.System.selectCorp({
        pk_corp: corp.pk_gs,
        login_date: loginDate
      }).then(res => {
        if (res.success) {
          this.$store.commit('setCorpInfo', corp)
          this.$store.commit('setLoginDate', loginDate)
          if (!window.localStorage.getItem('sso-show')) {
            this.ssoVisible = true
          } else {
            this.toHome()
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeVerifyCode () {
      this.$api.System.getCheckCode().then(res => {
        this.verifyImgSrc = res.rows.image
        this.key = res.rows.key
      })
    },
    toHome () {
      this.$router.push('/home')
    },
    closeSSO () {
      this.ssoVisible = false
    },
    documentClick (e) {
      if (e.keyCode === 13 && this.dialogVisible === true) {
        let corp = this.$refs.corpRef.selected
        if (corp) {
          this.dialogVisible = false
          this.handleCorpSelect(corp)
        }
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.documentClick)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.documentClick)
  }
}
</script>

<style scoped>
.bottom{
  margin: 40px auto 0;
  width: 100%;
  text-align: center;
  overflow: hidden;
  position: fixed;
  bottom: 10px;
}
.bottom p {
  font-family: Microsoft YaHei;
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.login-main {
  font-size: 12px;
}
.header {
  background: rgba(0, 0, 0, 0.5);
  height: 90px;
  width: 100%;
}
.top {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.top_logo {
  margin: 22px 0px 0px 0px;
  float: left;
}
.headerA {
  float: left;
  color: #fff;
  margin: 32px 10px 0px 10px;
  letter-spacing: 2px;
  line-height: 14px;
}
.headerB {
  float: left;
  font-size: 26px;
  color: #fff;
  margin-top: 24px;
}
.backg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -99;
  background-image: url(../../assets/img/login/sy2019.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.login-title {
  text-align: center;
  height: 52px;
  line-height: 52px;
  color: #fff;
  font-size: 16px;
}
.login-form {
  margin-right: 15%;
  z-index: 10;
  float: right;
  margin-top: 90px;
  padding: 10px 30px 50px;
  background: rgba(0, 0, 0, 0.5);
}
.login-form >>> .el-input__inner {
  color: #f5f2f2;
  background-color: rgba(0, 0, 0, 0.2);
}
.verify-img {
  float: right;
  margin-top: -5px;
  cursor: pointer;
  height: 35px;
}
</style>
