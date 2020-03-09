<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="805px"
    top="9vh"
    append-to-body>
    <el-main  style="height:400px">
      <dl class="qzkh-dl">
        <dd>
          1、选择“辅助明细”核算方式，存货科目启用存货辅助核算和数量核算，收入科目启用存货辅助核算和数量核算；<br/>
          &nbsp;&nbsp;<el-image  class="logimg" :src=srcList[0] :preview-src-list=[srcList[0]] ></el-image><br/>
          &nbsp;&nbsp;<el-image  class="logimg" :src=srcList[1] :preview-src-list=[srcList[1]] ></el-image><br/>
          2、选择“不核算明细”核算方式，存货科目和收入科目不设置下级科目（辅助核算）和数量核算；<br/><br/>
          &nbsp;&nbsp;<el-image alt="图片示例2" class="logimg" :src=srcList[2] :preview-src-list=[srcList[2]] ></el-image><br/>
          &nbsp;&nbsp;<el-image alt="图片示例2" class="logimg" :src=srcList[3] :preview-src-list=[srcList[3]] ></el-image><br/>
          3、选择“存货大类”核算方式，存货科目设置二级科目，二级科目启用存货辅助核算和数量核算，收入科目启用存货辅助核算和数量核算。<br/>
          &nbsp;&nbsp;<el-image alt="图片示例3" class="logimg" :src=srcList[4] :preview-src-list=[srcList[4]] ></el-image><br/>
          &nbsp;&nbsp;<el-image alt="图片示例2" class="logimg" :src=srcList[5] :preview-src-list=[srcList[5]] ></el-image><br/>
        </dd>
      </dl>
    </el-main>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>

export default {
  name: 'SmDialog',
  props: ['visible', 'title'],
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    dialogTitle: {
      get () {
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    }
  },
  data () {
    return {
      srcList: [
        require('@/view/accounting/general-inventory/inventory-setting/components/image/kj_hesuan1.png'),
        require('@/view/accounting/general-inventory/inventory-setting/components/image/kj_hesuan2.png'),
        require('@/view/accounting/general-inventory/inventory-setting/components/image/kj_hesuan3.png'),
        require('@/view/accounting/general-inventory/inventory-setting/components/image/kj_hesuan4.png'),
        require('@/view/accounting/general-inventory/inventory-setting/components/image/kj_hesuan5.png'),
        require('@/view/accounting/general-inventory/inventory-setting/components/image/kj_hesuan6.png')
      ]
    }
  },
  methods: {
    onDialogOpen () {
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
    },
    closeDialog () {
      this.dialogVisible = false
      this.$parent.dialogImpFormVisible = true
    }
  }
}
</script>
<style scoped>
  .logimg{
    width:650px;
    height:299px;
    border:1px solid #fff;
    cursor:pointer
  }
</style>
