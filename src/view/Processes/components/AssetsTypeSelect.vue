<!-- -->
<template>
  <div style="position:relative" class="assets">
    <el-dialog
      id="assetsType"
      title="资产类别"
      :visible.sync="dialogAssetsTypeVisible"
      width="550px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      @close="closeDialog"
    >
      <el-container>
        <el-header style="padding: 0;height: 50px;">
          <div style="text-align: center">
            <el-input
              v-model="selectType"
              placeholder="输入编码按Enter键查询"
              style="width: 90%;margin: 2% 0;"
            ></el-input>
          </div>
        </el-header>
        <el-main>
          <el-tree
            class="filter-tree"
            :data="treeList"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node = "false"
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{node, data}">
            <span @dblclick="db(node)">{{node.label}}</span>
          </span>
          </el-tree>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colseCreateGroup">取 消</el-button>
        <el-button type="primary" @click="querySelect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AssetsType_select',
  data () {
    return {
      dialogAssetsTypeVisible: false,
      selectType: '',
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  watch: {
    selectType (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    show () {
      this.dialogAssetsTypeVisible = true
    },
    loadTreeList: function () {
      this.$api.linkAssets.Attribute().then(res => {
        this.treeList = res
      })
      this.$api.linkAssets.testCreateAssets().then(result => {
        this.treeList = result.rows
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    querySelect: function () {
      this.getNode()
    },
    handleNodeClick: function (val) {
    },
    getNode: function () {
      const node = this.$refs.tree.getCurrentNode()
      if (node && node.children && node.children.length > 0) {
        this.$message({showClose: true, message: '请选择末级数据！', type: 'warning'})
        return
      }
      this.dialogAssetsTypeVisible = false
      // 对话框关闭，选中数据关闭
      this.$bus.$emit('assetsType', this.$refs.tree.getCurrentNode() ? this.$refs.tree.getCurrentNode() : {name: '', id: ''})
      this.$emit('findinde', this.$refs.tree.getCurrentNode() ? this.$refs.tree.getCurrentNode() : {name: '', id: ''})
      this.$refs.tree.setCurrentKey(null)
      this.dialogIsShow()
    },
    closeDialog: function () {
      this.selectType = ''
      this.$refs.tree.setCurrentKey(null)
      this.dialogIsShow()
    },
    colseCreateGroup: function () {
      this.dialogAssetsTypeVisible = false
      this.dialogIsShow()
    },
    dialogIsShow: function () {
      this.$bus.$emit('openAssetsType', false)
    },
    // 双击事件
    db: function (node) {
      console.log(node)
      this.getNode()
    }
  },
  created () {
    this.loadTreeList()
  }
}
</script>

<style lang="less">
.assets {
  .filter-tree {
    height: 400px;
  }
  .filter-tree .el-tree-node__label {
    font-size: 12px !important;
  }
  #assetsType .el-dialog__body {
    padding: 0 1px;
  }
}
</style>
