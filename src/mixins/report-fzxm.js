export default {
  data () {
    return {
      fzxmList: [],
      fzxmmap: {} // id 为key
    }
  },
  created () {
    this.queryFzxm()
  },
  methods: {
    queryFzxm () {
      let corpids
      if (this.queryForm && this.queryForm.corpIds) {
        corpids = this.queryForm.corpIds
      } else {
        corpids = this.$store.getters.currentCorp.pk_gs // 当前登录公司
      }
      this.$api.dlzReport.queryFzxm(corpids).then(result => {
        if (result.success === true) {
          this.fzxmList = result.rows
          for (const t of result.rows) {
            let key = t.pid
            if (this.fzxmmap[key]) {
              this.fzxmmap[key].push(t)
            } else {
              this.fzxmmap[key] = [t]
            }
          }
        }
      })
    }
  }
}
