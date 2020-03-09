<template>
    <div>
        <el-dialog title="导出"  :visible.sync="visible" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="350px">
            <el-form :model="excelForm" ref="formData">
                <el-form-item label="导出选择">
                    <el-select  v-model="excelForm.excelsel"
                            style="width: 230px">
                        <el-option
                                v-for="item in excelselTemp"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="excelExport">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'ExcelExportDialog',
  data () {
    return {
      visible: false,
      excelForm: {
        excelsel: 0
      }
    }
  },
  props: {
    excelselTemp: {
      type: Array
    }
  },
  watch: {
  },
  created () {
  },
  computed: {
  },
  methods: {
    excelExport () {
      this.$emit('confirmExcelExport', this.excelForm.excelsel)
      this.visible = false
    },
    show () {
      this.visible = true
    },
    // 打印取消
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
