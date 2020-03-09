<template>
  <div class="app-main">
<!--    <Card v-if="cardShow" :data="formData"></Card>-->
    <List></List>
  </div>
</template>

<script>
import List from './components/List'
export default {
  name: 'scoial-insur',
  components: {
    List
  },
  data () {
    return {
      cardShow: false,
      editStatus: false,
      formData: {},
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      initperiod: this.$store.getters.getLoginDate.substring(0, 7)
    }
  }
}
</script>
<style scoped>
  >>>.el-input-number .el-input__inner {
    text-align: right;
  }
</style>
