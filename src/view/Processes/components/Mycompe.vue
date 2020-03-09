<template>
  <div style="position: relative">
    <el-dialog
      title="选择公司"
      :visible.sync="dialogFormVisible"
      width="35%"
      :close-on-click-modal="false"
      :modal="false"
      @close="closeDialog"
    >
      <el-container>
        <el-header style="padding: 0px;height: 50px">
          <div style="text-align: center;">
            <el-input
              v-model="selectCompany"
              placeholder="输入编码或名称按Enter键查询"
              style="width: 90%;margin: 2% 0;"
              @change="selectInfo"
            ></el-input>
          </div>
        </el-header>
        <el-main style="padding: 0px">
          <el-table
            id="table_list"
            :header-cell-style="headerCellStyle"
            @current-change="handleCurrentChange"
            :data="tableList"
            highlight-current-row
            ref="tableCorpRef"
            :height="height"
            stripe
            style="width: 100%"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="incode" label="公司编码" sortable width="100">
              <template slot-scope="scope">
                <span class="lineStyle">{{scope.row.incode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="公司名称" min-width="160">
              <template slot-scope="scope">
                <span class="lineStyle">{{scope.row.uname}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="accountProgress" label="做账进度" sortable width="100"></el-table-column>
            <el-table-column prop="chname" label="公司性质" sortable width="100">
              <template slot-scope="scope">
                <span class="lineStyle">{{scope.row.chname}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colseCreateGroup('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="jumpShou()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postAxios, getAxios } from '@/libs/axios'
export default {
  props: ['dcpassword', 'dcusercode', 'logins'],
  data () {
    return {
      dialogFormVisible: true,
      selectCompany: '',
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      height: 350,
      tableList: [],
      oldtableList: []
    }
  },
  methods: {
    jumpShou () {
      postAxios('/sys/sm_user!gsSelect', {
        id: this.currentRow.primaryKey,
        'data.user_code': this.dcusercode,
        'data.user_password': this.dcpassword,
        login_date: this.currentRow.accountProgressDate,
        service: ''
      }).then(res => {
        if (this.logins.logins === 2) {
          this.$router.push('/home')
        } else if (this.logins.logins === 1 || this.logins.logins === 'undefined') {
          this.$bus.$emit('data', res.rows)
          this.dialogIsShow()
        }
        this.dialogFormVisible = false
      })
    },
    dialogIsShow: function () {
      this.$bus.$emit('openCompe', false)
    },
    loadListInfo: function () {
      getAxios('/sys/sm_user!gsQuery').then(resw => {
        this.tableList = resw.rows
        this.oldtableList = resw.rows
      })
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 查询
    selectInfo: function (val) {
      var self = this
      if (val.trim().length > 0) {
        self.tableList = []
        self.oldtableList.forEach(function (ev) {
          if (ev.uname.toLowerCase().indexOf(val) >= 0 || ev.incode.toLowerCase().indexOf(val) >= 0 || ev.accountProgress.toLowerCase().indexOf(val) >= 0) {
            self.tableList.push(ev)
          }
        })
      } else {
        this.loadListInfo()
      }
    },
    colseCreateGroup: function (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
      this.dialogIsShow()
    },
    closeDialog: function () {
      this.selectCompany = ''
      this.dialogIsShow()
    }
  },
  created () {
    this.loadListInfo()
  }
}
</script>

<style scoped>
.el-main {
  padding: 0px;
}
.el-dialog .el-dialog__body {
  padding: 0px;
}
.el-dialog .el-dialog__header {
  background: #1b8cf2;
  border-radius: 5px;
}
.el-dialog .el-dialog__title,
.el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
}
.el-input__inner {
  text-align: left;
}
.lineStyle {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  cursor: pointer;
}
</style>
