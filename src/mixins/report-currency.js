export default {
  data () {
    return {
      subjectCurrency: []
    }
  },
  created () {
    this.querybz()
  },
  methods: {
    // 查询币种
    querybz () {
      this.$api.KmQc.querybz().then((rs) => {
        if (rs.success) {
          this.subjectCurrency = rs.rows
          if (this.subjectCurrency && this.subjectCurrency.length > 0) {
            for (const t of this.subjectCurrency) {
              if (t.id === 'zhbwb') {
                t.id = ''
              }
            }
          }
        }
      })
    }
  }
}
