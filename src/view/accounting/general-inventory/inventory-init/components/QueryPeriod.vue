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
  created () {
    this.getQcDate()
  },
  methods: {
    dateChange (value) {
      const rows = this.$parent.tableData
      const date = value + '-01'
      if (rows && rows.length > 0) {
        let tips = '已存在启用期间为' + rows[0].opdate.substring(0, 7) + '的数据，变更启用期间系统将<span style="color: red">清除历史数据</span>？'
        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$emit('update:qj', value)
          this.$parent.onSync(date, true)
        }).catch(e => {
        })
      }
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
    },
    getQcDate () {
      this.$api.GeneralInventoryApi.InventoryInit.getQcDate({'unjl': 'Y'}).then(result => {
        if (result.success) {
          if (result.data) {
            this.$emit('update:qj', result.data.substring(0, 7))
          }
        }
      }).catch(e => {
      })
    }
  }
}
</script>

<style scoped>
  .query-container {
  }
</style>
