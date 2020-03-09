<template>
  <div style="height: 100%;">
    <div class="merge-nav">
      <el-tabs v-model="activeName" style="height: 100%" @tab-click="navLink">
        <el-tab-pane
          v-for="link in links"
          :label="link.label"
          :name="link.label"
          :key="link.link"
          lazy
          style="height: 100%">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="merge-body">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: 'common-settings',
  data () {
    return {
      activeName: '参数设置',
      links: [
        {
          label: '参数设置',
          link: 'param-setting'
        },
        {
          label: '银行账户',
          link: 'bank-account'
        },
        {
          label: '常用摘要',
          link: 'common-abstract'
        },
        {
          label: '预警设置',
          link: 'income-warning'
        },
        {
          label: '外币汇率',
          link: 'exchangerate'
        },
        {
          label: '常用凭证模板',
          link: 'common-template'
        },
        {
          label: '业务类型模板',
          link: 'business-type-template'
        }
      ]
    }
  },
  methods: {
    navLink (tab) {
      let linkData = this.links[tab.index]
      if (linkData.link !== this.$route.name) {
        this.$router.push({
          path: this.links[tab.index].link
        })
      }
    },
    fixActiveTab () {
      let routeName = this.$route.name
      let linkData = this.links.find(link => link.link === routeName)
      if (linkData) {
        this.activeName = linkData.label
      }
    }
  },
  created () {
    this.fixActiveTab()
  },
  activated () {
    this.fixActiveTab()
  }
}
</script>

<style scoped>
  .merge-nav {
    height: 40px;
    line-height: 30px;
    background-color: #fff;
    padding: 0 14px;
  }

  .merge-body {
    height: calc(100% - 30px);
  }

  .merge-link {
    cursor: pointer;
    color: #909399;
    font-size: 15px;
  }

  .merge-link-item .link-separator {
    padding: 0 5px;
  }

  .merge-link-item:last-child .link-separator {
    display: none;
  }

  .link-active {
    color: #303133;
    font-weight: bold;
  }
</style>>
