<template>
  <div style="position: relative" class="subjectinf">
    <el-dialog
      title="选择科目"
      :visible.sync="dialogSubjectInfoVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      @close="closeDialog"
    >
      <el-container>
        <el-tabs v-model="subjectList" type="card" @tab-click="handleClick" style="width: 100%">
          <el-tab-pane label="资产" name="first">
            <el-container>
              <el-main>
                <el-tree
                  class="filter-tree"
                  :data="firstTreeList"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="负债" name="second">
            <el-container>
              <el-main>
                <el-tree
                  class="filter-tree"
                  :data="secondTreeList"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="共同" name="third">
            <el-container>
              <el-main>
                <el-tree
                  class="filter-tree"
                  :data="thirdTreeList"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="权益" name="fourth">
            <el-container>
              <el-main>
                <el-tree
                  class="filter-tree"
                  :data="fourthTreeList"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="成本" name="fifth">
            <el-container>
              <el-main>
                <el-tree
                  class="filter-tree"
                  :data="fifthTreeList"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="损益" name="sixth">
            <el-container>
              <el-main>
                <el-tree
                  class="filter-tree"
                  :data="sixthTreeList"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="querySelect">确 定</el-button>
        <el-button @click="colseCreate">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'subjectInfo',
  data () {
    return {
      dialogSubjectInfoVisible: true,
      firstTreeList: [],
      secondTreeList: [],
      thirdTreeList: [],
      fourthTreeList: [],
      fifthTreeList: [],
      sixthTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'codename'
      },
      subjectList: 'first',
      currentNode: ''
    }
  },
  methods: {
    querySelect: function () {
      this.$bus.$emit('selectSubject', this.currentNode)
      this.dialogIsShow()
    },
    handleClick (tab, event) {
      this.loadTreeList(tab.index)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    handleNodeClick: function (val) {
      this.currentNode = val
    },
    closeDialog: function () {
      this.dialogIsShow()
    },
    colseCreate: function () {
      this.dialogIsShow()
    },
    dialogIsShow: function () {
      this.$bus.$emit('openSubjectInfo', false)
    },
    loadTreeList: function (val) {
      let param = {
        accindex: val,
        pk_corp: 'null'
      }
      this.$api.linkAssets.queryByPKcorp(param).then(result => {
        if (result.success) {
          if (val === '0') {
            this.firstTreeList = result.rows
          } else if (val === '1') {
            this.secondTreeList = result.rows
          } else if (val === '2') {
            this.thirdTreeList = result.rows
          } else if (val === '3') {
            this.fourthTreeList = result.rows
          } else if (val === '4') {
            this.fifthTreeList = result.rows
          } else if (val === '5') {
            this.sixthTreeList = result.rows
          }
        }
      })
    }
  },
  created () {
    this.loadTreeList('0')
  }
}
</script>

<style lang="less">
  .subjectinf {
    .filter-tree {
      height: 300px;
    }
    /deep/ .el-dialog__body{
      padding: 5px 0;
    }
  }
</style>
