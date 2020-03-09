<template>
  <section id="app-main">
    <transition name="el-fade-in-linear">
      <div style="height: 100%; width: 100%">
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      mainWidth: 0,
      mainHeight: 0
    }
  },
  computed: {
    cachedViews () {
      let views = []
      let allCached = this.$store.state.tagsView.cachedViews
      let totalCached = allCached.length
      if (totalCached > 0) {
        let containsHome = allCached.find(name => name === 'home') !== undefined
        if (containsHome) {
          views.push('Home')
          totalCached--
        }
        if (totalCached > 0) {
          views.push('Group')
        }
      }
      return views
    }
  },
  mounted () {
    this.$nextTick(nt => {
      this.mainWidth = document.getElementById('app-main').offsetWidth - 20
      this.mainHeight = document.getElementById('app-main').offsetHeight - 20
    })
  },
  watch: {}
}
</script>

<style scoped>
  #app-main {
    /*height: calc(100% - 53px);*/
    position: absolute;
    top: 47px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    padding-top: 0px;
    overflow: auto;
  }
</style>
