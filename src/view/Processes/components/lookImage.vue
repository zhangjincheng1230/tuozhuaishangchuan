<template>
  <div style="position: relative">
    <el-dialog class="imageDialog" title="查看图片" :visible.sync="dialogLookImg" width="60%"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="colseCreate">
      <div class="block" style="height: 500px;padding-bottom: 10px">
        <el-image style="height: 100%;width: 100%" :src="src"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'lookImage',
  props: ['url'],
  data () {
    return {
      dialogLookImg: true,
      src: ''
    }
  },
  methods: {
    colseCreate: function () {
      this.$emit('closeImg', false)
    }
  },
  mounted () {
    if (this.url !== undefined && this.url !== '') {
      this.src = '/api/zxkj' + this.url + '&X-Login-Corp=' + this.$store.getters.getLoginCorpId + '&X-Login-Date=' +
        this.$store.getters.getLoginDate + '&X-Login-User=' + this.$store.getters.getUserId + '&X-ACCESS-TOKEN=' + this.$store.getters.getToken
    }
  }
}
</script>

<style lang="less">

</style>
