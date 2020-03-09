<template>
  <el-dialog
    title="一键结转设置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onOpenDialog"
    @closed="onDialogClosed"
    width="392px"
    :modal="false">
    <div class="company-select-content" style="border: none">
      <el-select
        v-model="yjjzsetcorpid"
        multiple
        style="width: 353px">
        <el-option v-for="item in corps"
                   :key="item.pk_gs"
                   :value="item.pk_gs"
                   :label="item.uname"
                   style="width:315px">
        </el-option>
      </el-select>
      <el-table
        :data="rawData"
        ref="szTable"
        height="330px"
        @selection-change="handleRowSelection"
        @current-change="handleRowSelected"
        @row-dblclick="dblclickRow"
        v-loading="loading"
        element-loading-text="数据加载中，请稍候..."
        element-loading-spinner="el-icon-loading"
        stripe
        border>
        <el-table-column type="index" label=" " align="center" width="30px"></el-table-column>
        <el-table-column type="selection" align="center" width="75px"></el-table-column>
        <el-table-column prop="text" header-align="center" width="245px" label="结转类型"></el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

export default {
  name: 'SzDialog',
  components: {
  },
  props: {visible: Boolean},
  data () {
    return {
      loading: false,
      rawData: [],
      selections: [],
      selected: {},
      yjjzsetcorpid: [this.$store.getters.currentCorp.pk_gs],
      corps: this.$store.getters.corps
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
  methods: {
    fetchData () {
      this.loading = true
      let ids = this.yjjzsetcorpid.join(',')
      this.$api.yjjz.queryset({
        corpid: ids
      }).then(result => {
        this.loading = false
        let rows = result.rows
        if (rows) {
          this.rawData = rows
          this.$nextTick(() => {
            for (let i = 0; i < this.rawData.length; i++) {
              if (this.rawData[i].ck === 'Y') {
                this.$refs.szTable.toggleRowSelection(this.rawData[i], true)
              }
            }
          })
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onOpenDialog () {
      this.$nextTick(() => {
        this.rawData = []
        this.selections = []
        this.selected = {}
        this.yjjzsetcorpid = [this.$store.getters.currentCorp.pk_gs]
      })
      this.fetchData()
    },
    onDialogClosed () {
      this.$refs.szTable.clearSelection()
    },
    handleRowSelection (val) {
      this.selections = val
    },
    handleRowSelected (val) {
      this.selected = val
    },
    dblclickRow (row) {
      this.selectCorp(row)
    },
    onCancel () {
      this.dialogVisible = false
    },
    onConfirm () {
      if (this.selections && this.selections.length > 0) {
        let paramters = {
          corpid: this.yjjzsetcorpid.join(','),
          res: JSON.stringify(this.selections)
        }
        this.selectSz(paramters)
      } else {
        this.showError('请选择一条数据进行保存')
      }
    },
    selectSz (data) {
      this.$emit('selected', data)
      this.dialogVisible = false
    },
    showError (msg) {
      this.$message({dangerouslyUseHTMLString: true, showClose: true, message: msg, type: 'error'})
    },
    successMsg (msg) {
      this.$message({
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: msg,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
