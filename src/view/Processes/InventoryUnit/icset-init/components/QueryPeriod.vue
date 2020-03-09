<template>
  <div class="query-container">
    <el-input
      v-model="spbm"
      @keyup.enter.native="queryDataByParam"
      style="width:160px"
      clearable
      placeholder="请输入存货名称"
    ></el-input>
    <el-button @click="queryDataByParam()" style="margin-left:10px">查询</el-button>
  </div>
</template>

<script>
export default {
  name: 'QueryPeriod',
  data () {
    return {
      spbm: ''

    }
  },
  methods: {
    queryDataByParam () {
      this.$emit('query', this.spbm)
    }
  }
}
</script>

<style scoped>
  /* .query-container {
  } */
</style>
