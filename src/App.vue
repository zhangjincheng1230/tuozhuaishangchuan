<template>
  <div id="app">
    <router-view/>
    <!--    <div :class="`guidance ${imgGuidance[indexGuidance]}`" v-if="isGuidance" @click="guidanceClick"></div>-->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isGuidance: false,
      imgGuidance: ['guidance-nssb', 'guidance-ywcl', 'guidance-zbgl', 'guidance-zwcl'],
      indexGuidance: 0
    }
  },
  mounted () {
    if (!window.localStorage.getItem('initGuidance')) {
      this.isGuidance = true
    }
  },
  methods: {
    guidanceClick () {
      ++this.indexGuidance
      if (this.indexGuidance === 3) {
        window.localStorage.setItem('initGuidance', 'true')
      }
    }
  }
}
</script>

<style>
  .guidance-nssb {
    background: url(./assets/guidance/nssb.png) no-repeat center center;
  }
  .guidance-ywcl {
    background: url(./assets/guidance/ywcl.png) no-repeat center center;
  }
  .guidance-zbgl {
    background: url(./assets/guidance/zbgl.png) no-repeat center center;
  }
  .guidance-zwcl {
    background: url(./assets/guidance/zwcl.png) no-repeat center center;
  }
  .guidance {
    cursor: pointer;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background-size: cover;
  }
</style>
