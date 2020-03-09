<!--显示列设置-->
<template>
  <div>
    <el-dialog
      title="显示列设置"
      :visible.sync="visible"
      width="350px"
      :close-on-click-modal="false"
      :modal="false"
      @close="dialogclose">
      <el-table
        border
        ref="multipleTable"
        :data="checkData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="handleCurrentChange"
        @selection-change="handleCheckChang">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          property="name"
          header-align="center"
          label="列名称">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog__footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'columnSetDialog',
  mounted () {
    this.init()
  },
  created () {
  },
  data () {
    return {
      form: {
        columns: []
      },
      tableSelection: [],
      temptableSelection: [], // 临时选中的，需要设置，还没有保存的选中数据
      visible: false,
      checkData: [
        { id: 'ygcz', name: '预计残值' },
        { id: 'depperiod', name: '已计提折旧期间' },
        { id: 'periodbegin', name: '录入前已生成凭证' },
        { id: 'inittion', name: '录入前已提折旧' },
        { id: 'initciation', name: '录入前已提期间(月)' },
        { id: 'togl', name: '已转总账' },
        { id: 'clear', name: '已清理' },
        { id: 'depdate', name: '最后折旧月'},
        { id: 'memo', name: '备注' }]
    }
  },
  methods: {
    // 初始化显示列
    init () {
      // 保存显示列
      this.tableSelection = []
      this.$api.assetsCard.qryColumnSet({}).then(result => {
        if (result.success) {
          let rows = result.rows
          if (rows && rows.length > 0) {
            let setting = JSON.parse(rows[0].setting)
            for (const t of this.checkData) {
              if (setting[t.id] === 'Y') {
                this.tableSelection.push(t)
              }
            }
          }
          this.$emit('updatecolumnsetdata', this.getParam(this.tableSelection))
        }
      }).catch(e => {
      })
    },
    getParam (arrays) {
      // 保存显示的列
      const param = {}
      for (const t of this.checkData) {
        param[t.id] = 'N'
        if (arrays && arrays.length > 0) {
          for (const t1 of arrays) {
            if (t.id === t1.id) {
              param[t.id] = 'Y'
              break
            }
          }
        }
      }
      return param
    },
    dialogclose () {
    },
    confirm () {
      // 保存显示列
      this.$api.assetsCard.columnSet({setting: JSON.stringify(this.getParam(this.temptableSelection))}).then(result => {
        this.successMsg(result)
        this.tableSelection = JSON.parse(JSON.stringify(this.temptableSelection))
        this.$emit('updatecolumnsetdata', this.getParam(this.temptableSelection))
      }).catch(e => {
      })
      this.visible = false
    },
    show () {
      this.visible = true
      this.$nextTick(() => {
        let param = this.getParam(this.tableSelection)
        this.checkData.forEach(t => {
          if (param[t.id] === 'Y') {
            this.$refs.multipleTable.toggleRowSelection(t, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(t, false)
          }
        })
        // if (this.tableSelection.length > 0) {
        //   this.tableSelection.forEach(t => {
        //     this.$refs.multipleTable.toggleRowSelection(t, true)
        //   })
        // }
      })
    },
    async clearSelect () {
      await this.$refs.multipleTable.clearSelection()
    },
    handleCurrentChange: function (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 显示选中列
    handleCheckChang: function (selection) {
      // this.tableSelection = selection
      this.temptableSelection = selection
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg, // this.message !== '' ? this.message + '成功' : '查询成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg,
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
