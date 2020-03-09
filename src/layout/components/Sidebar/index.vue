<template>
  <!--:style="'height: 100%; width: ' + (!collapse ? '230px' : '64px')"-->
  <div class="sidebar-panel">
    <el-row type="flex" justify="center" class="sidebar-menu-head" align="middle">
      <el-col align="middle" :span="24">
        <!--<img src="../../../assets/menu-open.png"/>-->
        <i @click="collapse = !collapse" style="font-size: 20px;
                                                cursor: pointer;"
           :class="!collapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
      </el-col>
    </el-row>
    <happy-scroll :class="!collapse ? 'open-menu' : 'close-menu'" size="7"
                  style="height: calc(100% - 100px); max-width: 185px" color="#313548" resize hide-horizontal>
      <el-menu
        :default-active="activeMenu"
        style="max-width: 190px"
        ref="meunRef" :collapse="collapse" unique-opened class="sidebar-menu" text-color="#ffffff"
        data-step="2" data-intro="<div style='width:340px'><p style='font-size:18px;font-weight:500;margin-bottom: 20px;'>第2步：操作页面</p><span style='font-size:14px;font-weight:400;'>进入功能模块后，进行模块下具体功能的操作。</span></div>" data-position='right'>
        <el-submenu
          popper-class="poperStyle" v-if="item.children" :index="item.name" :key="item.path"
          v-for="item in subMenuList">
          <template slot="title">
            <img v-if="imgMaps[item.meta.title]" :src="imgMaps[item.meta.title]" alt="">
            <span style="font-size: 13px;">{{item.meta.title}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-if="item.children && !itemChi.meta.hidden" :key="itemChi.path"
              v-for="itemChi in item.children" :index="itemChi.name" @click="selectMenu(itemChi)">
              <span
                style="font-weight: 400; font-size: 13px; text-indent: 13px; display: block">{{itemChi.meta.title}} </span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else @click="selectMenu(item)" :index="item.name">
          <i class="el-icon-setting"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </el-menu>
      <div style="height: 20px"></div>
    </happy-scroll>
    <el-row type="flex" justify="center" class="sidebar-menu-footer" align="middle">
      <el-col align="middle" :span="24">
        <transition name="el-fade-in-linear">
          <el-badge :value="versionInfo.verts" :hidden="versionInfo.isread === '是'" v-if="showVersion">
            <label @click="viewChangelog" style="cursor: pointer; padding: 10px;" >
              版本号 {{versionInfo.verno}}
            </label>
          </el-badge>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

const imgMapsBlack = {
  '票据管理': require('@/assets/layout/sidebar/ywcl/pjgl.png'),
  '工资管理': require('@/assets/layout/sidebar/ywcl/gzgl.png'),
  '存货管理': require('@/assets/layout/sidebar/ywcl/chgl.png'),
  '库存管理': require('@/assets/layout/sidebar/ywcl/kcgl.png'),
  '资产管理': require('@/assets/layout/sidebar/ywcl/zc.png'),
  '凭证管理': require('@/assets/layout/sidebar/zwcl/pzgl.png'),
  '账套管理': require('@/assets/layout/sidebar/zwcl/ztgl.png'),
  '结账办理': require('@/assets/layout/sidebar/zwcl/jzbl.png'),
  '数据维护': require('@/assets/layout/sidebar/zwcl/jzbl.png'),
  '财务账簿': require('@/assets/layout/sidebar/zbgl/cwzb.png'),
  '财务报表': require('@/assets/layout/sidebar/zbgl/cwbb.png'),
  '纳税申报': require('@/assets/layout/sidebar/nssb/nssb.png')
}
const imgMapsBlue = {
  '票据管理': require('@/assets/layout/sidebar/ywcl/_pjgl.png'),
  '工资管理': require('@/assets/layout/sidebar/ywcl/_gzgl.png'),
  '存货管理': require('@/assets/layout/sidebar/ywcl/_chgl.png'),
  '库存管理': require('@/assets/layout/sidebar/ywcl/_kcgl.png'),
  '资产管理': require('@/assets/layout/sidebar/ywcl/_zc.png'),
  '凭证管理': require('@/assets/layout/sidebar/zwcl/_pzgl.png'),
  '账套管理': require('@/assets/layout/sidebar/zwcl/_ztgl.png'),
  '结账办理': require('@/assets/layout/sidebar/zwcl/_jzbl.png'),
  '数据维护': require('@/assets/layout/sidebar/zwcl/jzbl.png'),
  '财务账簿': require('@/assets/layout/sidebar/zbgl/_cwzb.png'),
  '财务报表': require('@/assets/layout/sidebar/zbgl/_cwbb.png'),
  '纳税申报': require('@/assets/layout/sidebar/nssb/_nssb.png')
}
export default {
  name: 'Sidebar',
  data () {
    return {
      skinShow: true,
      collapse: false,
      showVersion: true,
      imgMaps: {},
      versionInfo: {
        verno: 'v1.1.1.1'
      }
    }
  },
  mounted () {
    this.$nextTick(nt => {
      this.imgMaps = this.skin === 'black' ? imgMapsBlack : imgMapsBlue
      this.getVersionNo()
    })
  },
  computed: {
    ...mapGetters(['menuRoutes', 'topRouteName', 'skin']),
    subMenuList () {
      const menu = this.menuRoutes.find(item => this.topRouteName === item.name)
      return menu ? menu.children : []
    },
    activeMenu () {
      let name = this.$route.name
      if (this.$route.meta.activeName) {
        name = this.$route.meta.activeName
      } else if (this.$route.meta.nestedView) {
        name = this.$route.matched[this.$route.matched.length - 2].name
      }
      return name
    }
  },
  watch: {
    collapse (e) {
      if (!e) {
        setTimeout(s => {
          this.showVersion = !e
        }, 300)
        document.body.classList.remove('collapse-menu')
      } else {
        setTimeout(() => {
          document.body.classList.add('collapse-menu')
        }, 300)
        this.showVersion = !e
      }
    },
    subMenuList (subMenus) {
      this.$nextTick(() => {
        let containsActiveMenu = this.containsActiveMenu(subMenus, this.activeMenu)
        if (!containsActiveMenu) {
          let defaultOpen = subMenus.find(subMenus => subMenus.meta.defaultOpenMenu === true)
          if (defaultOpen) {
            this.$refs.meunRef.open(defaultOpen.name)
          }
        }
      })
    },
    skin () {
      this.skinShow = false
      this.$nextTick($ => {
        this.skinShow = true
        this.imgMaps = this.skin === 'black' ? {...imgMapsBlack} : {...imgMapsBlue}
      })
    }
  },
  methods: {
    selectMenu (item) {
      this.$router.push({name: item.name})
    },
    containsActiveMenu (menus, activeMenu) {
      let contains = false
      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i]
        if (menu.children) {
          contains = this.containsActiveMenu(menu.children, activeMenu)
        } else if (menu.name === activeMenu) {
          contains = true
        }
        if (contains) {
          break
        }
      }
      return contains
    },
    getVersionNo () {
      this.$api.Home.getVersionNo().then(result => {
        if (result.success && result.data) {
          this.versionInfo = result.data
        }
      })
    },
    viewChangelog () {
      this.$router.push({name: 'changelog'})
      if (this.versionInfo.isread !== '是') {
        this.saveReadChangelog()
      }
    },
    saveReadChangelog () {
      this.versionInfo.isread = '是'
      this.$api.Home.saveReadChangelog({
        versionId: this.versionInfo.verid
      })
    }
  }
}
</script>
