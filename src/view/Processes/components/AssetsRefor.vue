<template>
  <div style="position: relative;">
    <el-dialog
      title="资产参照"
      :visible.sync="dialogAssetsRefor"
      width="32%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      @close="closeDialog"
    >
      <el-container>
        <el-table
          id="table_list"
          :data="tableList"
          highlight-current-row
          @current-change="handleCurrentChange"
          :header-cell-style="headerCellStyle"
          ref="tableCorpRef"
          stripe
          :height="height"
          style="width: 100%"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="ascode" label="编码" align="center" min-width="120"></el-table-column>
          <el-table-column prop="asname" label="名称" align="center" min-width="120"></el-table-column>
          <el-table-column prop="atmny" label="资产原值" align="center" min-width="120"></el-table-column>
        </el-table>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="querySelect">确 定</el-button>
        <el-button @click="colseCreate">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AssetsRefor',
  props: ['isclear'],
  data () {
    return {
      dialogAssetsRefor: true,
      tableList: [],
      height: 305,
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      }
    }
  },
  methods: {
    loadTableList: function () {
      this.$api.assetsCard.loadData(this.isclear !== undefined ? this.isclear : 'N').then(result => {
        if (result.success) {
          this.tableList = result.rows
        }
      })
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    closeDialog: function () {
      this.dialogAssetsRefor = false
      this.dialogColse()
    },
    querySelect: function () {
      this.$bus.$emit('getCardSouce', this.currentRow)
      this.dialogAssetsRefor = false
      this.dialogColse()
    },
    colseCreate: function () {
      this.dialogAssetsRefor = false
      this.dialogColse()
    },
    dialogColse: function () {
      this.$bus.$emit('colseReforDialog', false)
    }
  },
  created () {
    this.loadTableList()
  }
}
</script>

<style scoped>
</style>
