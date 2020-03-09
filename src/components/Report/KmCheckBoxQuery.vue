<template>
  <el-aside :width="sidewidth" style ="border:1px solid #EBEEF5;background-color: #E7EAF4;height:100%;overflow:hidden">
    <el-header style="height:36px;background-color: #E7EAF4;padding:0px;line-height: 36px">
      <span v-show="showside" >
        <el-switch v-model="switchVal" @change="switchchange">
        </el-switch>
        {{switchVal ? this.treeTitles[0] : this.treeTitles[1]}}
      </span>
      <span  style="float: right" @click="showSide()">
        <i :class="iconnarrow"></i>
      </span>
    </el-header>
    <el-main v-show="showside" style = "padding:0px;overflow:auto;height:calc(100% - 36px);width:100%">
      <el-select
        placeholder="请输入编码或名称"
        filterable
        :clearable = "true"
        v-model="filterText" style = "width:100%">
        <el-option
          v-for="item in fzselectdata"
          v-if="item.id !== 'all'"
          :key="item.id"
          :value="item.id"
          :label="item.text"
          style = "width:240px">
        </el-option>
      </el-select>
      <el-tree
        style = "height:calc(100% - 32px);overflow:auto;"
        class="filter-tree"
        :data="treeNodes"
        node-key="id"
        :props="defaultProps"
        :check-strictly="true"
        :show-checkbox="isMulselect"
        check-on-click-node
        :highlight-current="true"
        @check="clickTree"
        ref="tree">
      </el-tree>
    </el-main>
  </el-aside>
</template>

<script>
export default {
  name: 'KmCheckBoxQuery',
  props: {
    nodename: {},
    bsavesetting: {}, // 是否保存设置，默认否
    mulselect: {
      type: Boolean,
      default: true
    },
    treedata: {
      type: Array
    },
    currselectids: {
      type: Array,
      default () {
        return []
      }
    },
    treeTitles: {
      type: Array,
      default () {
        return ['单科目查询', '多科目查询']
      }
    }
  },
  data () {
    return {
      filterText: '',
      switchVal: false,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      showside: true,
      sidewidth: '15%'
    }
  },
  created () {
    if (this.bsavesetting && this.bsavesetting === true) {
      this.init()
    }
  },
  watch: {
    filterText (val) {
      this.expandedTree(val)
    },
    routerParam: {
      handler (data) {
        if (data) {
          // 勾选数据清空
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedNodes([])
          }
          this.expandedTree(typeof this.routerParam === 'undefined' ? '' : this.routerParam.pk_km)
          this.filterText = ''
        }
      },
      immediate: true
    },
    mulselect: {
      handler (data) {
        this.switchVal = !this.mulselect
      }
    }
  },
  computed: {
    treeNodes () {
      // this.filterText = ''
      // this.currselectidArr = []
      if (this.isMulselect) {
        return JSON.parse(JSON.stringify(this.treedata))
      } else {
        return this.treedata.filter(v => v.id !== 'all')
      }
    },
    isMulselect: {
      get: function () {
        return this.mulselect
      },
      set: function (value) {
        this.$emit('update:mulselect', value)
      }
    },
    currselectidArr: {
      get: function () {
        return this.currselectids
      },
      set: function (value) {
        this.$emit('update:currselectids', value)
      }
    },
    fzselectdata: function () {
      const reslut = []
      if (this.treeNodes && this.treeNodes.length > 0) {
        for (const obj of this.treeNodes) {
          reslut[reslut.length] = obj
          if (obj.children != null && obj.children.length > 0) {
            this.looptreedata(reslut, obj.children)
          }
        }
      }
      return reslut
    },
    iconnarrow () {
      return this.showside ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
    }
  },
  methods: {
    showSide () {
      if (this.showside) {
        this.sidewidth = '1.5%'
      } else {
        this.sidewidth = '15%'
      }
      this.showside = !this.showside
    },
    // 赋值checkid
    setCheckIds (checkids) {
      if (checkids && checkids.length > 0) {
        this.filterText = ''
        if (this.isMulselect) {
          this.$refs.tree.setCheckedKeys(checkids)
          this.currselectidArr = Array.from(new Set(checkids))
        } else {
          this.$refs.tree.setCheckedKeys(checkids)
          this.currselectidArr = checkids
        }
        // 第一行选中，第一个展开
        this.$nextTick(nt => {
          this.expandedTree(checkids[0])
        })
      }
    },
    // 初始化
    async init () {
      let temp = this.currselectids
      await this.querySettingMsg()
      if (temp && temp.length > 0) {
        setTimeout(() => {
          this.filterText = temp[0] || '' // 默认连接过来的是单个的，暂不支持多个
        }, 1000)
      }
    },
    // 保存设置
    saveSettingMsg (val) {
      // 保存设置的时候，和nodename 不为空的时候，
      if (this.bsavesetting && this.bsavesetting === true && this.nodename) {
        const param = {
          nodename: this.nodename,
          print_setting1: JSON.stringify({'issinglekmsel': val ? '是' : '否'}),
          pk_corp: this.$store.getters.currentCorp.pk_gs,
          corpids: this.$store.getters.currentCorp.pk_gs,
          updatecolumn: 'print_setting1'
        }
        this.$api.printSetting.saveMulColumn(param).then(result => {
        }).catch(e => {
        })
      }
    },
    // 查询报表设置
    async querySettingMsg () {
      // 保存设置的时候，和nodename 不为空的时候，
      if (this.bsavesetting && this.bsavesetting === true && this.nodename) {
        await this.$api.printSetting.printQuerySetting(this.nodename, this.$store.getters.currentCorp.pk_gs).then(result => {
          if (result.success) {
            let printsetting = null
            let printsetting1 = null
            if (result.rows) {
              if (result.rows.print_setting) {
                printsetting = JSON.parse(result.rows.print_setting)
              }
              if (result.rows.print_setting1) {
                printsetting1 = JSON.parse(result.rows.print_setting1)
              }
            }

            if (printsetting1) {
              this.switchval = printsetting1['issinglekmsel'] === '是'
            } else if (printsetting) { // 处理历史数据
              this.switchval = printsetting['issinglekmsel'] === '是'
            }
            this.switchchange(this.switchval)
          } else {
          }
        }).catch(e => {
        })
      }
    },
    looptreedata (result, child) {
      for (const obj of child) {
        result[result.length] = obj
        if (obj.children && obj.children.length > 0) {
          this.looptreedata(result, obj.children)
        }
      }
    },
    switchchange (val) {
      this.currselectidArr = []
      this.filterText = ''
      this.isMulselect = !val
      this.$refs.tree.setCheckedNodes([])
      this.$refs.tree.setCheckedKeys([])
      this.saveSettingMsg(val)
    },
    clickTree (data, checknodes) {
      this.filterText = ''
      // 清除选中状态
      for (let k in this.$refs.tree.store.nodesMap) {
        if (data.id === k) {
          this.$refs.tree.store.nodesMap[k].expanded = true
          this.$refs.tree.store.nodesMap[k].isCurrent = true
        } else {
          this.$refs.tree.store.nodesMap[k].isCurrent = false
        }
      }
      if (this.isMulselect) {
        // 全选，全消处理
        if (data.id === 'all') {
          if (checknodes.checkedKeys.indexOf('all') !== -1) {
            this.currselectidArr = []
            for (const t of this.fzselectdata) {
              this.currselectidArr[this.currselectidArr.length] = t.id
            }
            // 选中全部
            this.currselectidArr = Array.from(new Set(this.currselectidArr))
            this.$refs.tree.setCheckedKeys(this.currselectidArr)
          } else {
            // 取消全选
            this.currselectidArr = []
            this.$refs.tree.setCheckedKeys([])
          }
        } else {
          let selected = checknodes.checkedKeys.indexOf(data.id)
          if (selected !== -1) {
            // 选中
            this.currselectidArr.push(data.id)
            this.selectChilds(data)
          } else {
            // 未选中
            let index = this.currselectidArr.findIndex(item => data.id === item)
            this.currselectidArr.splice(index, 1)
            this.unSelectChilds(data)
          }
          this.dealLowerLevelMul(data, checknodes)
        }
      } else {
        if (data.isfl !== '是') {
          this.currselectidArr = [data.id]
        } else {
          this.currselectidArr = [data.id]
          this.dealLowerLevelSingle(data)
        }
      }
    },
    // 选中节点是否有下级选中 没有选中 添加下级所有的id(适配存货分类和存货)
    dealLowerLevelMul (data, checknodes) {
      if (!data.spflid) { return }
      let childNode = checknodes.checkedNodes.filter(item => data.spflid === item.id)
      if (!childNode || !childNode[0]) { return }
      let isSelect = false
      for (let child of childNode[0].children) {
        let selected = checknodes.checkedKeys.indexOf(child.id)
        if (selected !== -1) {
          isSelect = true
        }
        let index = this.currselectidArr.findIndex(item => child.id === item)
        this.currselectidArr.splice(index, index + 1)
      }
      if (!isSelect) {
        for (let child of childNode[0].children) {
          this.currselectidArr.push(child.id)
        }
      } else {
        for (let child of childNode[0].children) {
          let selected = checknodes.checkedKeys.indexOf(child.id)
          if (selected !== -1) {
            this.currselectidArr.push(child.id)
          }
        }
      }
      this.currselectidArr = Array.from(new Set(this.currselectidArr))
    },
    dealLowerLevelSingle (data) {
      if (data.spflid) { return }
      let idArr = []
      for (let child of data.children) {
        idArr.push(child.id)
      }
      this.currselectidArr = Array.from(new Set(idArr))
    },
    selectChilds (data) {
      // 选中子节点
      let currentNode = this.$refs.tree.getNode(data)
      if (currentNode.childNodes.length > 0) {
        for (var childNode of currentNode.childNodes) {
          this.currselectidArr.push(childNode.data.id)
          this.$refs.tree.setChecked(childNode, true)
          childNode.expanded = true
          this.selectChilds(childNode)
        }
      }
      this.currselectidArr = Array.from(new Set(this.currselectidArr))
    },
    unSelectChilds (data) {
      // 取消子节点选中
      let currentNode = this.$refs.tree.getNode(data)
      if (currentNode.childNodes.length > 0) {
        for (var childNode of currentNode.childNodes) {
          let index = this.currselectidArr.findIndex(item => childNode.data.id === item)
          this.currselectidArr.splice(index, index + 1)
          this.$refs.tree.setChecked(childNode, false)
          // childNode.expanded = false
          this.unSelectChilds(childNode)
        }
      }
    },
    expandedTree (val) {
      if (val === '') {
        return
      }
      if (this.isMulselect) {
        this.currselectidArr.push(val)
        this.$refs.tree.setCheckedKeys(this.currselectidArr)
        let currentNode = this.$refs.tree.getNode(val)
        currentNode !== null && this.selectChilds(currentNode)
        this.currselectidArr = Array.from(new Set(this.currselectidArr))
      } else {
        this.$refs.tree.setCheckedKeys([val])
        this.currselectidArr = [val]
      }

      setTimeout(() => {
        for (let k in this.$refs.tree.store.nodesMap) {
          this.$refs.tree.store.nodesMap[k].isCurrent = false
        }
        this.$refs.tree.store.nodesMap[val].isCurrent = true
        let node = this.$refs.tree.store.nodesMap[val]
        while (node !== null) {
          node.expanded = true
          node = node.parent
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
>>>.black .main-panel .el-aside{
  background: #fff;
}
  >>> .el-tree-node>.el-tree-node__children {
    overflow: inherit;
  }
</style>
