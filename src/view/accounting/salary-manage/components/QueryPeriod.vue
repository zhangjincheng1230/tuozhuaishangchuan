<template>
  <div class="query-container">
    <el-date-picker style="margin-left:5px;width:125px" v-model="period" type="month" :editable="false" :clearable="false"
                    @change="dateChange" value-format="yyyy-MM" placeholder="选择期间" :picker-options="pickerOptions" ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'QueryPeriod',
  props: ['qj'],
  data () {
    return {
      // 日期选择控制
      pickerOptions: this.datePicker()
    }
  },
  computed: {
    period: {
      get () {
        return this.qj
      },
      set (value) {
        this.$emit('update:qj', value)
      }
    }
  },
  methods: {
    dateChange (value) {
      this.$emit('update:qj', value)
      this.$emit('query', false)
    },
    datePicker () {
      const self = this
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.$store.getters.currentCorp.bdate
          return period < jzDate.substring(0, 7)
        }
      }
    }
  }
}
</script>

<style scoped>
  .query-container {
  }
</style>
