<!--选择存货组件 admin:panguangxing  2019-11-04 -->
<template>
  <div style="position: relative">
    <el-dialog
      id="fileDialog"
      title="存货档案"
      :visible.sync="dialogFile"
      :close-on-click-modal="false"
      :modal="false"
      width="47%"
      @close="closeFileDialog"
    >
      <el-header style="padding: 0px;">
        <div style="text-align: center">
          <el-input
            v-model="selectElement"
            placeholder="请输入存货编码、存货名称、规格(型号)按Enter键查询"
            style="width: 90%;margin: 2% 0;"
            @change="selectInfo"
          ></el-input>
        </div>
      </el-header>
      <el-main style="padding: 0px;">
        <el-table
          :data="verifyTableList"
          :header-cell-style="headerCellStyle"
          ref="verifyTableRef"
          stripe
          highlight-current-row
          @current-change="handleCurrentChange"
          :height="verifyFormHeight"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" max-width="30"></el-table-column>
          <el-table-column prop="kmbm" label="科目编码" sortable align="center" min-width="95"></el-table-column>
          <el-table-column prop="kmmc" label="科目名称" align="center" max-width="80"></el-table-column>
          <el-table-column prop="spbm" label="存货编码" sortable align="center" min-width="95"></el-table-column>
          <el-table-column prop="spmc" label="存货名称" align="center" max-width="80"></el-table-column>
          <el-table-column prop="splxmc" label="存货分类" align="center" max-width="80"></el-table-column>
          <el-table-column prop="gg" label="规格(型号)" align="center" max-width="80"></el-table-column>
          <el-table-column prop="jldw" label="计量单位" align="center" max-width="60"></el-table-column>
          <el-table-column prop="jc" label="简称" align="center" max-width="90"></el-table-column>
        </el-table>
      </el-main>
      <div slot="footer" class="dialog__footer">
        <el-button type="primary" @click="verifyForm">确 认</el-button>
        <el-button @click="colseVerify">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SelectInventory',
  data () {
    return {
      dialogFile: true,
      selectElement: '',
      verifyTableList: [],
      verifyFormHeight: 290,
      headerCellStyle: {
        background: '#E7EAF4',
        fontsize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      currentRow: ''
    }
  },
  methods: {
    verifyForm: function () {
      this.dialogFile = false
      this.dialogIsShow()
    },
    colseVerify: function () {
      this.dialogFile = false
      this.dialogIsShow()
    },
    closeFileDialog: function () {
      this.dialogFile = false
      this.dialogIsShow()
    },
    dialogIsShow: function () {
      let param = {
        dataRow: this.currentRow !== '' ? this.currentRow : '',
        isShowsFile: false
      }
      this.$bus.$emit('openDialogFile', param)
    },
    handleCurrentChange: function (row) {
      this.currentRow = row
    },
    loadTableList: function () {
      this.$api.openStock.shopQueryInfo().then(result => {
        if (result.success) {
          this.verifyTableList = result.rows
        }
      })
    }
  },
  created () {
    this.loadTableList()
  }
}
</script>
<style scoped>
</style>
