<template>
  <div class="app-main">
    <Card v-if="cardShow" :data="formData" :induss="induss" @updateFormData="updateFormData"></Card>
    <List v-else :queryForm="queryForm"></List>
  </div>
</template>

<script>
import List from './components/List'
import Card from './components/Card'
import { formatDate, getMonthBegin, getPreviousPeriod } from '@/utils'
export default {
  name: 'company-setting',
  components: {
    List,
    Card
  },
  data () {
    return {
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      loginDate: this.$store.getters.getLoginDate,
      cardShow: true,
      editStatus: false,

      queryForm: {
        cPeriodRange: [getPreviousPeriod(new Date(), 120)+'-01', formatDate(new Date())]
      },
      induss: [],
      areaMaps: new Map(),
      areaDatas: [],
      formData: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getHybz()
      this.getProTypes()
    },
    async getProTypes () {
      await this.$api.BasicSettingApi.CompanySetting.queryArea({
        isbs: 'Y'
      }).then(result => {
        if (result.success) {
          let temp = result.rows.reduce((temp, row) => {
            temp.push({'id': row.region_id, 'name': row.region_name})
            this.areaMaps.set(row.region_id, row.region_name)
            return temp
          }, [])
          this.areaDatas = temp
          this.upProMaps(this.areaMaps, this.areaDatas)
        }
      }).catch(e => {
      })
    },
    upProMaps (maps, datas) {
      this.areaMaps = maps
      this.areaDatas = datas
    },
    updateFormData (data) {
      this.formData = data
    },
    getHybz () {
      this.$api.BasicSettingApi.CompanySetting.queryHyRef({}).then(result => {
        if (result.success) {
          this.cyclicHybz(result.rows)
        } else {
        }
      }).catch(e => {
      })
    },
    cyclicHybz (rows) {
      if (rows && rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          if (row.children && row.children.length > 0) {
            this.cyclicHybz(row.children)
          } else {
            this.induss.push(row)
          }
        }
      }
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success',
        dangerouslyUseHTMLString: true
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    },
    warnMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>
