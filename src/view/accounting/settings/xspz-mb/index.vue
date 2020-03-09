<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="openDialog">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delRow">删除</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            highlight-current-row
            @current-change="handleRowSelect"
            stripe
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" header-align="center" width="50"></el-table-column>
            <el-table-column property="ysxjkmmc" label="应收或现金科目" header-align="center" width="120"></el-table-column>
            <el-table-column property="srlkmmc" label="收入类科目" header-align="center" width="200"></el-table-column>
            <el-table-column property="yjsfkmmc" label="应交税费科目" header-align="center" width="180"></el-table-column>
            <el-table-column property="memo" label="摘要" header-align="center" width="180"></el-table-column>
            <el-table-column label></el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination
            :total="total"
            :page.sync="pageInfo.pageNum"
            :limit.sync="pageInfo.pageSize"
            @pagination="fetchData"
          ></Pagination>
        </div>
      </div>
    </div>
    <XspzMbDialog :visible.sync="dialogFormVisible" :currentRow="formData" @save="onSaved"></XspzMbDialog>
  </div>
</template>

<script>
import XspzMbDialog from './components/XspzMbDialog'
import Pagination from '@/components/Pagination'

export default {
  name: 'bank-account',
  components: {
    XspzMbDialog,
    Pagination
  },
  data () {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      currentRow: null,
      formData: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$api.BasicSettingApi.XspzMb.queryXspzMb({
        pk_corp: this.$store.getters.getLoginCorpId,
        ...this.pageInfo
      }).then(result => {
        if (result.success === true) {
          this.tableData = result.rows
          this.total = result.total
        }
      })
    },
    handleRowSelect (val) {
      this.currentRow = val
    },
    openDialog () {
      this.formData = {}
      this.dialogFormVisible = true
    },
    editRow () {
      if (this.currentRow) {
        this.formData = Object.assign({}, this.currentRow)
        this.dialogFormVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要编辑的银行账户',
          type: 'warning'
        })
      }
    },
    onSaved (data) {
      if (this.formData.pk_xssrtemplate) {
        const index = this.tableData.findIndex(
          row => row.pk_xssrtemplate === this.formData.pk_xssrtemplate
        )
        if (index > -1) {
          this.$set(this.tableData, index, data)
        }
      } else {
        this.tableData.push(data)
      }
      this.successMsg('保存成功!')
    },
    delRow () {
      if (this.currentRow) {
        this.$confirm('确定要删除此记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          const pkXssrtemplate = this.currentRow.pk_xssrtemplate
          this.$api.BasicSettingApi.XspzMb.deleteXspzMb({
            pk_xssrtemplate: pkXssrtemplate,
            pk_corp: this.currentRow.pk_corp
          }).then(result => {
            if (result.success) {
              this.successMsg('删除成功!')
              const index = this.tableData.findIndex(
                row => row.pk_xssrtemplate === pkXssrtemplate
              )
              if (index > -1) {
                this.tableData.splice(index, 1)
              }
            } else {
              this.errorMsg(result.msg)
            }
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择要删除的银行账户',
          type: 'warning'
        })
      }
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>
