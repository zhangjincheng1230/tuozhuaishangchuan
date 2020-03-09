<template>
  <div class="group-view">
    <transition name="el-fade-in-linear">
      <div style="height: 100%; width: 100%">
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Group',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>

<style scoped>
  .group-view {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
</style>
