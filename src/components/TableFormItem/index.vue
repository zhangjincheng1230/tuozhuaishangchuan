<template>
  <el-form-item :label="label"
                :prop="prop"
                :rules="rules">
    <slot></slot>
    <template #error="{ error }">
      <el-tooltip placement="right" :content="error">
        <span class="error-tooltip"><i class="el-icon-error"></i></span>
      </el-tooltip>
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'TableFormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: String,
    rules: [Object, Array]
  }
}
</script>

<style scoped>

</style>
