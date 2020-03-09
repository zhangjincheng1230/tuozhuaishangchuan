<template>
  <div>
    <div
      style="position: absolute; left: 35%; top:16%;width:29%;z-index:999;border-radius: 5px; background:#ffffff;font-size:14px;"
    >
      <div
        class="header"
        style="height:45px; line-height:45px; width:100%;display:flex;justify-content: space-between;"
      >
        <slot name="addHead" />
        <slot name="opendown" style="padding-right:14px;display:inline-block; "></slot>
      </div>
      <div class="section">
        <slot name="addMain"></slot>
      </div>
      <div
        class="footer"
        style="height:55px; line-height:55px; text-align:right; padding-right:15px;"
      >
        <slot name="addFoot" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      openForm: false
    }
  },
  methods: {
    opendown () {
      console.log('111')
      this.openForm = false
      this.$bus.emit('openForm', false)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
