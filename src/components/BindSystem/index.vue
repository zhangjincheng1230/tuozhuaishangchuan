<template>
  <div>
    <el-dialog
      :visible.sync="ssoVisible"
      :show-close="true"
      :close-on-click-modal="false"
      :custom-class="'ssoDialog'"
      :append-to-body="true"
      :close-on-press-escape="false"
      title="欢迎使用大账房系列产品"
      class="sso-dialog"
      width="350px"
      @close="closeModel"
    >
      <div style="height: 270px; position: relative;">
        <div v-if="ssoExplain" style="padding: 16px 21px; border: 1px solid #CCCCCC; line-height: 25px; margin-top: 55px; position: absolute; width: 100%; font-size: 14px">
          大账房体系产品已上线统一认证服务，如您使用的有大账房其他系列产品，可选择验证绑定大账房其他产品的登录账号，方便您一键切换系统。
        </div>
        <iframe v-else :src="ifSrc" sandbox="allow-forms allow-scripts allow-same-origin allow-popups" style="border: none; width: 100%; height: 92%" />
      </div>
      <el-checkbox v-if="$route.path === '/login' && ssoBtnText === '现在验证'" v-model="ssoShowCheck" style="position: absolute; margin-top: -11px;">不再提示</el-checkbox>
      <div v-if="ssoBtnText === '现在验证'" slot="footer" class="dialog-footer">
        <el-button style="width: 130px; background: #dceefc; color: #409EFF " @click="toHome">{{ OKText }}</el-button>
        <el-button type="primary" style="width: 132px" @click="ssoVerification">{{ ssoBtnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BindSystem',
  props: {
    ssoVisible: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      OKText: '进入首页',
      ssoBtnText: '现在验证',
      ssoExplain: true,
      ssoShowCheck: false,
      ifSrc: '//' + window.location.host + '/user-center/pages/bind?token=' + JSON.parse(window.sessionStorage.getItem('dzf-zxkj')).system.userInfo.dzfAuthToken
    }
  },
  created () {
    window.addEventListener('message', (event) => {
      if (event.data.dzf) {
        if (event.data.dzf.action === 'home') {
          this.toHome()
        }
      }
    })
    if (this.$route.path === '/login') {
      this.OKText = '进入首页'
    } else {
      this.OKText = '关闭窗口'
      this.ssoExplain = false
      this.ssoBtnText = ''
    }
  },
  methods: {
    bind () {
      const self = this
      window.document.getElementsByTagName('iframe')[0].contentWindow.postMessage({
        type: self.ssoExplain === '继续绑定' ? 'bindAgain' : 'bind'
      }, '*')
    },
    toHome () {
      if (this.$route.path === '/login') {
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        } else {
          this.$router.push('/home')
        }
      }
      this.ssoVisible = false
      this.ssoExplain = true
      if (this.ssoShowCheck) {
        window.localStorage.setItem('sso-show', '1')
      }
      this.$emit('close')
    },
    ssoVerification () {
      if (this.ssoBtnText === '现在验证') {
        this.ssoBtnText = '验证'
        this.ssoExplain = false
      } else {
        this.bind()
      }
    },
    closeModel () {
      this.toHome()
    }
  }
}
</script>

<style lang="less">
.ssoDialog {
  border-radius: 10px;
  .el-dialog__header {
    text-align: center;
  }
}
</style>
