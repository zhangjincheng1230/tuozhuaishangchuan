<template>
      <ul class="root-item" data-step="1" data-intro="<div><p style='font-size:18px;font-weight:500;margin-bottom: 20px;'>第1步：功能模块</p><span style='font-size:14px;font-weight:400;'>按照账务处理流程分为“业务处理、账务处理、账簿报表、纳税申报”四大功能模块</br>业务处理包括：票据管理、工资管理、资产管理、库存管理</br>账务处理包括：凭证管理、结账办理、账套管理（原基础设置）、数据维护</br>账簿报表包括：财务账簿、财务报表</br>纳税申报包括：纳税填报、申报查询、纳税工作台</br></br>请根据您的需要进入相应的功能模块</span></div>" data-position='bottom'>
        <li :key="item.name, index" v-for="(item,index) in menuRoutes"
            :class="item.name === topRouteName ? 'selLiChange' : ''" @click="changeItem(item.name)">
          {{item.meta.title}}
          <i v-if="item.name === topRouteName" class="el-icon-caret-top"></i>
        </li>
      </ul>
</template>

<script>
export default {
  name: 'RootItem',
  data () {
  },
  computed: {
    menuRoutes () {
      return this.$store.getters.menuRoutes
    },
    topRouteName () {
      return this.$store.getters.topRouteName
    }
  },
  methods: {
    changeItem (name) {
      this.$store.commit('tagsView/CHANGE_TOP_ROUTE', name)
    }
  },
  watch: {
    menuRoutes () {
      this.$store.commit('tagsView/CHANGE_TOP_ROUTE', 'cwcl')
    }
  }
}
</script>

<style scoped>
  .root-item li {
    list-style: none;
    display: inline-block;
    cursor: pointer;
    position: relative;
  }
  .root-item li+li {
    margin-left: 40px;
  }
  .root-item {
    float: right;
    position: relative;
    display: inline-block;
    color: #ffffff;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
  }
  .root-item .selLiChange{
    font-size:20px;
  }
  .root-item .el-icon-caret-top{
    position: absolute;
    bottom: -12px;
    left: 30%;
  }
  .root-item li .el-icon-caret-top:before {
    font-size: 28px;
  }
</style>
