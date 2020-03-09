<template>
  <ul v-if="children">
    <li :key="index" v-for="(chi, index) in children">
      <div :class="$root.appData.selectTreeItem === chi.id ? 'folder-actives' : ''" class="tree-list-item" v-contextmenu="{val: chi, ref: Contextmenu}" @click="getFolderData(1, chi)" style="">
        <i :class="chi.isOpen ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" style="float: none; cursor: pointer; margin: 13px 10px 0 0;" v-if="chi.itype !== 1"></i>
        <span class="folder-name"
              :class="chi.categorytype === 0 ? (chi.billcount > 0 ? 'folder-en' : 'folder-dis') : (chi.billcount > 0 ? 'folder-lock-en' : 'folder-lock-dis')"
              v-if="chi.itype === 0">{{chi.categoryname + '(' + chi.billcount + ')'}} </span>

        <!--<el-tooltip v-if="chi.errorcount > 0 && chi.itype === 0" class="item" effect="light" :content="'问题(' + chi.errorcount + ')'" placement="right">-->
          <!--<i @click="$parent.getBillErrorInfo(chi)" class="el-icon-warning-outline" style="position: absolute; right: 28px; top: 12px; cursor: pointer"></i>-->
        <!--</el-tooltip>-->
      </div>
      <folder-tree :Contextmenu="Contextmenu" :getFolderDataFun="getFolderDataFun" v-if="chi.children" :children="chi.children"></folder-tree>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'folderTree',
  props: ['children', 'getFolderDataFun', 'Contextmenu'],
  data () {
    return {
    }
  },
  methods: {
    getFolderData (index, chi) {
      this.getFolderDataFun(index, chi)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
  ul li {
    list-style: none;
    margin-left: 20px;
  }
  .folder-name {
    height: 40px;
    padding-left: 30px;
    max-width: calc(100% - 45px);
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
  }
  .folder-en {
    background: url(../../../../../../assets/img/folder-en.png) 0 no-repeat;
  }

  .folder-dis {
    background: url(../../../../../../assets/img/folder-dis.png) 0 no-repeat;
  }

  .folder-lock-en {
    background: url(../../../../../../assets/img/folder-lock-en.png) 0 no-repeat;
  }

  .folder-lock-dis {
    background: url(../../../../../../assets/img/folder-lock-dis.png) 0 no-repeat;
  }

  .bill-en {
    background: url(../../../../../../assets/img/bill2.png) 0 no-repeat;
  }
.folder-actives{
  background-color: #dcdde1;
}

</style>
