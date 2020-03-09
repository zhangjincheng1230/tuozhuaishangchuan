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
        <dt class="qzkh-A">
          支持以下两种方式导入
        </dt>
      </dl>
      <dl class="qzkh-dl">
        <dd>
          1、从自然人税收管理系统扣缴客户端“综合所得申报”中导出工资表导入到系统工资表中。<br/>
          &nbsp;&nbsp;（1）打开自然人税收管理系统扣缴客户端，进入“综合所得申报”界面，点击“导出”，下载工资表；<br/>
          &nbsp;&nbsp;<el-image  class="logimg" :src=srcList[0] :preview-src-list=[srcList[0]]></el-image>
          &nbsp;&nbsp;（2）在系统中打开“工资表”，点击“导入”；<br/>
          &nbsp;&nbsp;<el-image alt="图片示例2" class="logimg" :src=srcList[1] :preview-src-list=[srcList[1]]></el-image><br/>
          &nbsp;&nbsp;（3）选择从自然人税收管理系统扣缴客户端中导出的工资表导入系统。<br/>
          &nbsp;&nbsp;<el-image alt="图片示例3" class="logimg" :src=srcList[2] :preview-src-list=[srcList[2]]></el-image><br/>
        </dd>
        <dd>
          2、从自然人税收管理系统扣缴客户端“综合所得申报-申报表报送”中导出工资表导入到系统工资表中。<br/>
          &nbsp;&nbsp;（1）打开自然人税收管理系统扣缴客户端，进入“综合所得申报-申报表报送”界面，点击“导出申报表”，下载工资表；<br/>
          &nbsp;&nbsp;<el-image alt="图片示例4" class="logimg" :src=srcList[3] :preview-src-list=[srcList[3]]></el-image><br/>
          &nbsp;&nbsp;（2）在系统中打开“工资表”，点击“导入”；<br/>
          &nbsp;&nbsp;<el-image alt="图片示例5" class="logimg" :src=srcList[4] :preview-src-list=[srcList[4]]></el-image><br/>
          &nbsp;&nbsp;（3）选择从自然人税收管理系统扣缴客户端中导出的工资表导入系统。<br/>
          &nbsp;&nbsp;<el-image alt="图片示例6" class="logimg" :src=srcList[5] :preview-src-list=[srcList[5]]></el-image><br/>
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
        require('@/view/accounting/salary-manage/salary-report/components/image/image0001.png'),
        require('@/view/accounting/salary-manage/salary-report/components/image/image0002.png'),
        require('@/view/accounting/salary-manage/salary-report/components/image/image0003.png'),
        require('@/view/accounting/salary-manage/salary-report/components/image/image0004.png'),
        require('@/view/accounting/salary-manage/salary-report/components/image/image0005.png'),
        require('@/view/accounting/salary-manage/salary-report/components/image/image0006.png')
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
