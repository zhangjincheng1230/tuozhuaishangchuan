<template>
  <div class="query-container">

  </div>
</template>

<script>
export default {
  name: 'QueryParam',
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
    queryDataByParam () {
      this.$parent.loading = true
      this.queryVisible = false
      if (this.queryForm.bPeriodRange) {
        this.queryDate = this.queryForm.bPeriodRange[0] +
              '至' + this.queryForm.bPeriodRange[1]
      } else if (this.queryForm.cPeriodRange) {
        this.queryDate = ''
      }
      this.$api.BasicSettingApi.CompanySetting.query(this.getQueryParam()).then(result => {
        this.$parent.loading = false
        if (result.success) {
          this.$parent.tableData = result.rows
          this.$parent.total = result.total
        } else {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$parent.loading = false
      })
    },
    getQueryParam () {
      const params = {
        begindate: this.queryForm.bPeriodRange ? this.queryForm.bPeriodRange[0] : '',
        enddate: this.queryForm.bPeriodRange ? this.queryForm.bPeriodRange[1] : '',
        bcreatedate: this.queryForm.cPeriodRange ? this.queryForm.cPeriodRange[0] : '',
        ecreatedate: this.queryForm.cPeriodRange ? this.queryForm.cPeriodRange[1] : '',
        corpcode: this.queryForm.qryucode,
        corpname: this.queryForm.qryuname,
        vprovince: this.queryForm.iprovince_qry
      }

      return params
    }
    //  getProTypes() {
    //     this.$api.BasicSettingApi.CompanySetting.queryArea({
    //         isbs: 'Y'
    //     }).then(result => {
    //         if(result.success){
    //           let temp = result.rows.reduce((temp, row) => {
    //                   temp.push({"id": row.region_id, "name": row.region_name})
    //                   this.areaMaps.set(row.region_id, row.region_name)
    //                   return temp
    //               }, [])
    //           this.areaDatas = temp
    //           this.$parent.upProMaps(this.areaMaps)
    //         }
    //     }).catch(e => {
    //     })
    //
    // }
  }
}
</script>

<style scoped>
  .query-container {

  }
</style>
