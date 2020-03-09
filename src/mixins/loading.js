export default {
  data () {
    return {
      loading: false,
      loadingText: '数据加载中，请稍候...',
      defaultLoadingText: '数据加载中，请稍候...',
      loadingSpinner: 'el-icon-loading',
      // loadingBackground: 'rgba(0, 0, 0, 0.5)', // 彬杰统一样式进行修改
      loadingIns: null
    }
  },
  methods: {
    showLoading (text) {
      this.loadingText = text || this.defaultLoadingText
      this.loading = true
    },
    // 全屏
    showLoadingFullscreen (text) {
      this.loadingIns = this.$loading({
        lock: true,
        text: text || this.defaultLoadingText,
        spinner: this.loadingSpinner
      })
    },
    closeLoading () {
      this.loading = false
      if (this.loadingIns) {
        this.loadingIns.close()
        this.loadingIns = null
      }
    }
  }
}
