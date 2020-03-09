<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="add">新增</el-button>
          <el-button @click="edit">修改</el-button>
          <el-button @click="del">删除</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            highlight-current-row
            @row-click="handleRowSelect"
            stripe
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column property="xmmc" label="项目" header-align="center" width="500"></el-table-column>
            <el-table-column property="fx" label="方向" header-align="center" width="200" :formatter="formatter"></el-table-column>
            <el-table-column property="dopdate" label="录入日期" header-align="center" sortable width="180"></el-table-column>
            <el-table-column property="je" label="累计发生额" :formatter="repformny" header-align="center" sortable width="180" align="right"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <Dialog :visible.sync="visible" :currentRow="currentRow" :isAdd="isAdd" @save="save"></Dialog>
  </div>
</template>

<script>
import Dialog from '@/view/accounting/settings/xjll-qc/dialog'
export default {
  name: 'xjll-qc',
  components: {
    Dialog
  },
  data () {
    return {
      tableData: [],
      isAdd: true,
      visible: false,
      currentRow: {}
    }
  },
  computed: {
    pk_corp () {
      return this.$store.getters.getLoginCorpId
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      this.$api.BasicSettingApi.XjllQc.query(this.getQueryParam()).then(result => {
        if (result.success === true) {
          this.tableData = result.rows
          this.total = result.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    getQueryParam () {
      let queryParam = {
        pk_corp: this.pk_corp,
        sort: 'id',
        order: 'asc'
      }
      return queryParam
    },
    handleRowSelect (val) {
      this.currentRow = val
    },
    edit () {
      this.isAdd = false
      if (this.currentRow && this.currentRow.id) {
        this.visible = true
      } else {
        this.$message({
          message: '请先选择行',
          type: 'warning'
        })
      }
    },
    add () {
      this.isAdd = true
      this.visible = true
    },
    save (data) {
      (this.isAdd ? this.$api.BasicSettingApi.XjllQc.save(data) : this.$api.BasicSettingApi.XjllQc.update(data)).then(result => {
        if (result.success) {
          this.query()
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
          this.visible = false
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    del () {
      if (this.currentRow) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          const id = this.currentRow.id
          this.$api.BasicSettingApi.XjllQc.delete(this.currentRow).then(result => {
            if (result.success) {
              this.$message({
                message: '删除成功!',
                type: 'success'
              })
              const index = this.tableData.findIndex(
                row => row.id === id
              )
              if (index > -1) {
                this.tableData.splice(index, 1)
              }
            } else {
              this.$message.error(result.msg)
            }
          })
        })
      } else {
        this.$message({
          message: '请先选择行',
          type: 'warning'
        })
      }
    },
    formatter (row, column, cellValue) {
      return cellValue === 0 ? '流入' : '流出'
    }
  }
}
</script>
