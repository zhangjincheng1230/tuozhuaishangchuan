<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             @open="onDialogOpen"
             @close="onDialogClose"
             @closed="onDialogClosed"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             width="600px"
             v-loading="loading"
             element-loading-text="请稍候..."
             element-loading-background="rgba(0, 0, 0, 0)"
             element-loading-spinner="el-icon-loading">
    <div style = "height: 350px">
      <vxe-table
        border
        resizable
        size = "small"
        show-overflow
        show-header-overflow
        :data="formData"
        height="340px"
        highlight-hover-row
        highlight-current-row
        :edit-config="{trigger: 'click', mode: 'cell'}"
        :optimization = "optimization"
        class="edit-table"
        @edit-actived="editActivedEvent"
        @edit-closed="editClosedEvent">
        <vxe-table-column type="index" width="50" label = "序号" align  = "center" header-align = "center"></vxe-table-column>
        <vxe-table-column field="currcode" title="币种编码" header-align = "center"></vxe-table-column>
        <vxe-table-column field="currname" title="币种名称" header-align = "center"></vxe-table-column>
        <vxe-table-column field="adjrate" title="调整汇率"  :formatter = "vxeformatterHuilv" align = "right" header-align = "center" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: huilvprecision}}"></vxe-table-column>
      </vxe-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveQmth">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {VEX_MAXLENGTH} from '@/constants'
export default {
  name: 'QmTiaohuiDialog',
  props: ['visible', 'isyjjz', 'qmthdata', 'qmthqmclvo'],
  data () {
    return {
      huilvprecision: this.$store.getters.huilvPre,
      formData: [],
      loading: false
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
    },
    title () {
      return '汇兑调整'
    },
    optimization () {
      return {scrollY: {gt: VEX_MAXLENGTH}}
    }
  },
  methods: {
    editActivedEvent ({ row, column }, event) {
    },
    editClosedEvent ({ row, column }, event) {
    },
    saveQmth () {
      if (this.isyjjz !== undefined && this.isyjjz === true) {
        const paramters = {
          exrates: this.formData,
          qmclvos: this.qmthqmclvo,
          zgdata: [],
          qmjznoiclist: [],
          currentproject: 1,
          list1: [],
          list2: [],
          list3: [],
          list4: [],
          list5: []
        }
        this.loading = true
        this.$api.yjjz.onYjjz(paramters).then(data => {
          this.loading = false
          this.closeDialog()
          this.$emit('updatehdsytz', data.rows)
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.loading = true
        const paramters = {exrates: this.formData, qmvos: this.qmthqmclvo}
        this.$api.qmcl.onhdsytz(paramters).then(result => {
          this.loading = false
          if (result.success) {
            this.$emit('updatehdsytz', result.rows)
            this.closeDialog()
            this.$message({
              showClose: true,
              message: result.msg,
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: result.msg,
              dangerouslyUseHTMLString: true,
              type: 'error'
            })
          }
        }).catch(e => {
          this.loading = false
        })
      }
    },
    onDialogOpen () {
      this.formData = this.formData.concat(this.qmthdata)
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.formData = []
      this.dialogVisible = false
    },
    closeDialog () {
      this.formData = []
      this.dialogVisible = false
    },
    vxeformatterHuilv (obj) {
      if (obj.cellValue) {
        return this.$options.filters.forThousands(obj.cellValue, this.huilvprecision)
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
