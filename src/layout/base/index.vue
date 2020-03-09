<template>
  <div :class="'base-loyout ' + skin">
    <Headerbar class="header"></Headerbar>
      <el-container class="main-panel">
        <el-aside :width="'auto'" style="overflow-x:hidden">
          <Sidebar class="sidebar"></Sidebar>
        </el-aside>
        <el-main class="main-content">
          <TagsView></TagsView>
          <Main></Main>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headerbar from '../components/Headerbar'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import TagsView from '../components/TagsView'
import { asyncRoutes} from '@/router'

export default {
  name: 'Base',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['tagslist', 'activeItem', 'skin'])
  },
  components: {
    Headerbar,
    Main,
    Sidebar,
    TagsView
  },
  created () {
    this.$store.dispatch('permission/loadMenus')
    this.$api.System.getCorpinfoByHomePage().then(res => {
      this.$store.commit('SET_SYSTEM_INFO', res.data)
    })
    this.$store.dispatch('fetchSubjectRefData')
    this.$store.dispatch('fetchAuxiliaryType')
    this.$store.dispatch('fetchSubjectCurrency')
    this.$store.dispatch('fetchParamSet')
    this.$store.dispatch('fetchCorpServiceInfo')
    // console.log(this.$router.options.routes)
  },
  mounted () {
    this.setSkin()
  },
  methods: {
    setSkin () {
      window.skincode = 'lan'
      if (window.localStorage.getItem('DZF_SKIN')) {
        this.$store.commit('SET_SKIN', window.localStorage.getItem('DZF_SKIN'))
      } else {
        window.localStorage.setItem('DZF_SKIN', 'blue')
        this.$store.commit('SET_SKIN', 'blue')
        // window.localStorage.getItem('DZF_SKIN') === 'black' && (window.skincode = 'lan')
      }
      // window.localStorage.getItem('DZF_SKIN') === 'black' && (window.skincode = 'hei')
    }
  }
}
</script>
<style lang="less">
@import "../styles/base/index.less";
</style>
<style scoped>
  .base-loyout {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .main-panel {
    height: calc(100vh - 59px);
    position: relative;
    width: 100%;
  }
  .sidebar {
    height: 100%;
  }
  .main-content {
    padding: 0px;
    height: 100%;
    position: relative;
    background-color: #F6F6F6;
  }
  /deep/ .el-submenu .el-menu-item{
    min-width: 150px;
  }
  /deep/ .introjs-helperNumberLayer{
    display: none;
  }
  /deep/ .introjs-helperLayer{
    box-sizing: content-box !important;
    position: absolute;
    z-index: 9999998;
    /*background-color: #FFF;*/
    background-color: rgba(255,255,255,.1) !important;
    border: 1px solid #777;
    border: 1px solid rgba(0,0,0,.5);
    border-radius: 4px;
    box-shadow: 0 2px 15px rgba(0,0,0,.4);
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
  }
</style>
