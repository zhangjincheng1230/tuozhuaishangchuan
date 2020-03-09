<template>
  <div class="query-container">
    <el-input v-model="param" @keyup.enter.native="queryDataByParam"  style = "width:160px" clearable placeholder="按工号或姓名查询" ></el-input>
    <el-button @click="queryDataByParam()" style= "margin-left:10px" >查询</el-button>
  </div>
</template>

<script>
import MessageUtil from '@/mixins/message-util'
export default {
  name: 'QueryParam',
  mixins: [MessageUtil],
  data () {
    return {
      param: ''
    }
  },
  methods: {
    queryDataByParam () {
      this.$parent.loading = true
      this.$api.SalaryManageApi.StaffInfo.queryParam(this.$parent.getParam(this.param)).then(result => {
        this.$parent.loading = false
        if (result.success) {
          this.$parent.tableData = result.rows
          this.$parent.total = result.total
          this.$parent.initFilter(this.tableData, 'name')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.$parent.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .query-container {

  }
</style>
