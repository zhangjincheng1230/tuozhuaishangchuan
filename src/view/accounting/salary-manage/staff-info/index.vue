<template>
  <div class="app-main">
<!--    <Card v-if="cardShow" :data="formData"></Card>-->
    <List></List>
  </div>
</template>

<script>
import List from './components/List'
import Card from './components/Card'
export default {
  name: 'staff-info',
  components: {
    List,
    Card
  },
  data () {
    return {
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      loginDate: this.$store.getters.getLoginDate,
      cardShow: false,
      editStatus: false,
      formData: {}
    }
  }
}
</script>
