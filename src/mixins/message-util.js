export default {
  data () {
    return {
    }
  },
  methods: {
    successMsg (msg) {
      this.showMsg( msg, 'success')
    },
    errorMsg (msg) {
      this.showMsg(msg, 'error')
    },
    warnMsg (msg) {
      this.showMsg(msg, 'warning')
    },
    showMsg (msg, type) {
      this.$message({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: msg,
        type: type
      })
    }
  }
}
