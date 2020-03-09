<template>
  <el-dialog
    title="常用模板"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onOpenDialog"
    width="550px">
    <div class="el-form-item" style="width: 300px; margin-left: 100px;">
      <div class="el-form-item__label">
        金额
      </div>
      <div class="el-form-item__content">
        <el-input-number
          v-model="mny"
          :controls="false"
          :precision="2" style="width: 200px;"></el-input-number>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        height="350"
        highlight-current-row
        @current-change="handleSelect">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="mbbm" label="模版编码"></el-table-column>
        <el-table-column prop="mbmc" label="模版名称"></el-table-column>
        <el-table-column prop="mbms" label="说明"></el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectTemplate">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'CommonTemplateDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableData: null,
      selectedRow: null,
      mny: null
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    }
  },
  created () {
  },
  methods: {
    fetchData () {
      this.$api.BasicSettingApi.VoucherTemplate.queryTemp().then(res => {
        if (res.success) {
          this.tableData = res.rows
        }
      })
    },
    onOpenDialog () {
      this.mny = null
      if (this.tableData === null) {
        this.fetchData()
      }
    },
    handleSelect (row) {
      this.selectedRow = row
    },
    selectTemplate () {
      if (this.selectedRow) {
        this.$emit('selected', {
          tempId: this.selectedRow.pk_h_id,
          mny: this.mny
        })
        this.dialogVisible = false
      } else {
        this.$message.warning('请选择模板')
      }
    }
  }
}
</script>

<style scoped>

</style>
