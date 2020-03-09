export default {
  data () {
    return {
      subjectRef: []
    }
  },
  created () {
    this.querySubjectRef()
  },
  methods: {
    querySubjectRef () {
      this.$api.BasicSettingApi.Subject.getSubjectRefByPkCorp(this.queryForm.corpIds).then(result => {
        if (result.success === true) {
          this.subjectRef = result.rows
        }
      })
    }
  }
}
