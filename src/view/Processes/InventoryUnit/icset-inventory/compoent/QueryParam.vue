<template>
  <el-form
    ref="form"
    :model="queryFormData"
    style="width:200px">
    <el-form-item label="编码" :label-width="labelWidth">
      <el-input v-model="queryFormData.spbm" :clearable = "true" placeholder="请录入编码"  style="width: 250px"></el-input>
    </el-form-item>
    <el-form-item label="名称" :label-width="labelWidth">
      <el-input v-model="queryFormData.spmc" :clearable = "true" placeholder="请录入名称"  style="width: 250px"></el-input>
    </el-form-item>
    <el-form-item label="规格(型号)" :label-width="labelWidth">
      <el-input v-model="queryFormData.gg" :clearable = "true" placeholder="请录入规格(型号)"  style="width: 250px"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'QueryForm',
  props: {
    formData: {
      type: Object,
      default: null
    }
  },
  data () {
    let param
    if (this.formData === null) {
      param = this.getDefaultParamData()
    } else {
      param = { ...this.formData }
    }
    return {
      queryFormData: param,
      labelWidth: '85px',
      dialogVisible: false
    }
  },
  mounted () {
  },
  methods: {
    getQueryParam () {
      let param = { ...this.queryFormData }
      return param
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.queryFormData = this.getDefaultParamData()
    },
    getDefaultParamData () {
      return {spbm: '', spmc: '', gg: ''}
    }
  }
}
</script>

<style scoped>

</style>
