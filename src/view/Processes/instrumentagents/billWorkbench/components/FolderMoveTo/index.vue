<template>
  <div class="move">
    <!--移动到-->
    <!--{{folderInfo}}-->
    <el-tree
      style="height: 314px;overflow: auto; padding: 5px"
      :highlight-current="true"
      :data="folderData"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick">
    </el-tree>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: right">

      <el-button type="primary" @click="$parent.$parent.moveToDialogVisible = false" plain>取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </div>
</template>
<script>
import {postAxios} from '@/libs/axios'
export default {
  props: {
    folderInfo: {
      type: Object
    }
  },
  computed: {},
  data () {
    return {
      currentNodeItem: {},
      folderData: [],
      // data: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      status: false,
      param: {
        period: this.$parent.$parent.searchData.period, billstate: '0'
      },
      ids: []
    }
  },
  methods: {
    save () {
      if (!this.currentNodeItem.id) {
        this.$message.error('请选择分类!')
        return
      }
      let param = {
        treeid: this.currentNodeItem.id,
        ids: this.ids,
        period: this.$parent.$parent.searchData.period
      }
      postAxios('/zncs/workbench/' + (this.folderInfo.pk_invoice_detail ? 'saveNewCategoryBody' : 'saveNewCategory'), param).then(res => {
        if (res.success) {
          this.$parent.$parent.moveToDialogVisible = false
          this.$parent.$parent.getFolderData()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleNodeClick (data, node, ele) {
      // if (node.isLeaf) {
      //   this.currentNodeItem = data
      // } else {
      //   this.currentNodeItem = {}
      // }
      this.currentNodeItem = data
    },
    getTreeData () {
    }
  },
  beforeDestroy () {
  },
  mounted () {
    this.ids = this.folderInfo.pk_invoice_detail || this.folderInfo.id
    postAxios('/zncs/workbench/queryTree', {period: this.$parent.$parent.searchData.period}).then(res => {
      this.folderData = res.rows
    })
  }
}
</script>
<style>
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background: #b7d3f3!important;
  }
  .move {
    /*height: 500px;*/
    /*overflow: hidden;*/
  }
  .move .folder-en {
    background: url(../../../../../../assets/img/folder-en.png) 0 no-repeat;
    text-indent: 26px;
    display: block;
    line-height: 19px;
  }
  .move .folder-dis {
    background: url(../../../../../../assets/img/folder-dis.png) 0 no-repeat;
    text-indent: 26px;
    display: block;
    line-height: 19px;
  }
  .zncs-main .el-dialog__header {
    background:#fff;
    color:#000;
    text-align: left;
  }
  .zncs-main .el-dialog .el-icon-close:before {
    color: #000;
    font-size: 20px;
    font-weight: 600;
  }
  .zncs-main .el-tree {
    border: 1px solid #c5c5c5;
    margin: 0 15px;
  }
  .move .el-button {
    margin-top: 10px;
  }
  .zncs-main .el-dialog {
    border-radius: 5px;
  }
  .zncs-main .el-dialog__header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
</style>
