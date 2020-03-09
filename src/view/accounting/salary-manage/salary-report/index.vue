<template>
  <div class="app-main">
<!--    <SalarayReportCard v-if="cardShow" :qybf="qybf" :zxfj="zxfj" :data="formData"></SalarayReportCard>-->
    <SalarayReportList></SalarayReportList>
  </div>
</template>

<script>
import SalarayReportList from './List/SalarayReportList'
import SalarayReportCard from './Card/SalarayReportCard'
export default {
  name: 'salary-report',
  components: {
    SalarayReportList,
    SalarayReportCard
  },
  data () {
    return {
      qybf: false,
      zxfj: false,
      cardShow: false,
      editStatus: false,
      formData: {},
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      period: this.$store.getters.getLoginDate.substring(0, 7)
    }
  }
}
</script>

<style scoped>

</style>
