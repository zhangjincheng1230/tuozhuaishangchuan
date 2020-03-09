export default {
  data () {
    return {
      allAuxiliaryTypes: []
    }
  },
  created () {
    this.queryAuxiliaryType()
  },
  methods: {
    async queryAuxiliaryType () {
      await this.$api.BasicSettingApi.Auxiliary.getType({
        pk_corp: this.queryForm.corpIds,
        isfull: 'Y'
      }).then(result => {
        if (result.success === true) {
          this.allAuxiliaryTypes = result.rows
        }
      })
    }
  }
}
