<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group" style="float: left; white-space: nowrap">
          <el-button @click="openDialog">修改编码规则</el-button>&nbsp;
          当前编码规则：
          <el-input
            :value="currentCodeRule"
            readonly
            style="width: 100px"
          ></el-input>
          <el-tooltip class="item" effect="light" content="每一数字代表当前级次科目位数，数据升级为不可逆操作" placement="right-start">
          <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            highlight-current-row
            stripe
            border
            height="100%"
            style="width: 100%"
            :cell-style="cellStyle"
          >
            <el-table-column
              type="index"
              label="序号"
              header-align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              property="oldcode"
              label="旧编码"
              header-align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              property="oldname"
              label="会计名称"
              header-align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              property="newcode"
              label="新编码"
              header-align="center"
              width="180"
            ></el-table-column>
            <el-table-column
              property="newname"
              label="新会计名称"
              header-align="center"
              width="180"
            ></el-table-column>
            <el-table-column
              property="memo"
              label="备注"
              header-align="center"
              width="180"
            ></el-table-column>
            <el-table-column label></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <Dialog :visible.sync="visible" @load="query"></Dialog>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top />
    </el-tooltip>
  </div>
</template>
<script>
import Dialog from './dialog'
import BackToTop from '@/components/BackToTop/index'
export default {
  name: 'data-upgrade',
  components: {
    Dialog,
    BackToTop
  },
  data () {
    return {
      visible: false,
      tableData: []
    }
  },
  computed: {
    currentCodeRule: {
      get () {
        return this.$store.state.accounting.currentCodeRule
      },
      set (newCodeRule) {
        this.$store.commit('setCurrentCodeRule', newCodeRule)
      }
    }
  },
  created () {
    this.queryCurrentCodeRule()
    this.query()
  },
  methods: {
    cellStyle ({ row, columnIndex }) {
      if (columnIndex !== 0 && row.ischanged === '是') {
        return { color: 'red' }
      }
    },
    query () {
      this.$api.BasicSettingApi.dataUpgrade.query({
        pk_corp: this.$store.getters.getLoginCorpId
      }).then(result => {
        if (result.success === true) {
          this.tableData = result.rows
          this.total = result.total
        }
      })
    },
    queryCurrentCodeRule () {
      this.$api.BasicSettingApi.dataUpgrade.queryCurrentCodeRule({
        pk_corp: this.$store.getters.getLoginCorpId
      }).then(reponse => {
        if (reponse.success === true) {
          this.currentCodeRule = reponse.msg
        }
      })
    },
    openDialog () {
      this.visible = true
    }
  }
}
</script>
<style scoped>
  .item {
    margin: 4px;
  }
</style>
