<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"
  >
    <header style="position: relative;width: 100%">
      <el-form
        :inline="true"
        @submit.native.prevent
        class="form-inline"
        label-width="100px"
        style="height:45px;padding-top: 12px;"
      >
        <el-form-item
          v-if="IsShowDate"
          label="期间:"
          size="small"
          label-width="50px"
          style="float: left; margin-left:14px; "
        >
          <el-input
            placeholder="请选择日期"
            v-popover:popover
            suffix-icon="el-icon-arrow-down"
            v-model="datevalue"
          ></el-input>
        </el-form-item>
        <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
          <div>
            <h4>工作量</h4>
            <div
              style="width: 96%; height: 50px; margin: 0 auto; border-bottom:1px dashed #ccc; line-height:45px; display:flex;justify-content: space-between"
            >
              <span style="margin-left:14px; width:70px;">日期：</span>
              <el-date-picker
                v-model="datevalues"
                type="month"
                placeholder="选择月"
                style="width:72%; margin-right:15px;"
              ></el-date-picker>
            </div>

            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span style="margin-left:14px;">公司：</span>
              <el-select
                v-model="corpid"
                filterable
                placeholder="请选择公司"
                style="width:72%; margin-right:15px;"
              >
                <el-option
                  v-for="item in optionsval"
                  :key="item.pk_gs"
                  :label="item.uname"
                  :value="item.pk_gs"
                ></el-option>
              </el-select>
            </div>
            <div style="text-align: right;margin-top: 12px">
              <el-button size="small" type="primary" @click="addpose">确定</el-button>
              <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
            </div>
          </div>
        </el-popover>
        <el-form-item label="公司:" size="small" label-width="50px" style="float: left">
          <span>{{unam.uname===undefined?valcop:unam.uname}}</span>
        </el-form-item>
        <el-row style="float:right;margin-right:14px" size="small" v-if="show">
          <el-button @click="btnxiugai">修改</el-button>
          <el-button @click="resas">刷新</el-button>
        </el-row>
        <el-row style="float:right;margin-right:14px" size="small" v-if="shows">
          <el-button @click="btnbaocun">保存</el-button>
          <el-button @click="quxiaobtn">取消</el-button>
          <el-button @click="jichengbtn">继承上月</el-button>
        </el-row>
      </el-form>
    </header>

    <div class="contents">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;height:100%"
        @row-click="remove"
        border
        v-loading="loading"
        element-loading-text="数据处理中，请稍候..."
        element-loading-spinner="el-icon-loading"
        size="small"
      >
        <el-table-column type="selection" width="46"></el-table-column>
        <el-table-column label="卡片编号" prop="ascode" align="center" width="110"></el-table-column>
        <el-table-column prop="zcbm" align="center" label="资产编号" width="110"></el-table-column>
        <el-table-column prop="asname" align="center" label="资产名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gzldw" align="center" label="工作量单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gzzl" align="center" label="总工作量" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.gzzl"
              type="number"
              :disabled="shows?false:true"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="syljgzl"
          align="center"
          label="上月累计工作量"
          width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.syljgzl"
              type="number"
              :disabled="shows?false:true"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="bygzl" align="center" label="本月工作量" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.bygzl"
              type="number"
              :disabled="shows?false:true"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ljgzl" align="center" label="累计工作量" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.ljgzl"
              type="number"
              :disabled="shows?false:true"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="sygzl" align="center" label="剩余工作量" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              size="mini"
              type="number"
              v-model="scope.row.sygzl"
              :disabled="shows?false:true"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import CorpDialog from '@/components/reference/CorpDialog'
export default {
  name: 'zzl',
  data () {
    return {
      datevalue: this.$store.getters.currentCorp.bdate.slice(0, this.$store.getters.currentCorp.bdate.length - 3),
      lists: [],
      logins: 1,
      tableData: [],
      dialogVisible: false,
      cop: '',
      openForm: false,
      selection: {},
      shows: false,
      show: true,
      loading: false,
      optionsval: this.$store.getters.corps,
      valcop: this.$store.getters.currentCorp.uname,
      corpid: this.$store.getters.currentCorp.pk_gs,
      datas: this.$store.getters.currentCorp.bdate,
      visiblePopover: false,
      IsShowDate: true,
      unam: {},
      datevalues: this.$store.getters.currentCorp.bdate.slice(0, this.$store.getters.currentCorp.bdate.length - 3)
    }
  },
  components: {
    Header,
    CorpDialog
  },
  methods: {
    Xcompe () {
      this.dialogVisible = true
    },
    getList () {
      this.$api.linkAssets.querying({
        corpId: this.lists.pk_gs,
        period: this.datevalues === String ? this.datevalues : this.formatDate(this.datevalues)
      }).then(res => {
      })
    },
    addpose () {
      this.loading = true
      this.$api.linkAssets.querying({
        corpId: this.corpid, // 公司主键
        period: this.datevalues === String ? this.datevalues : this.formatDate(this.datevalues)
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.tableData = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })

      this.datevalue = this.formatDate(this.datevalues)
      this.visiblePopover = false
      this.unam = this.optionsval.find(item => {
        return item.pk_gs === this.corpid
      }) || {}
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    formatDate (date) {
      if (date.length < 8) {
        return date
      } else {
        date.setTime(date.getTime())
        return date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1)
      }
    },
    clearPose: function () {
      this.visiblePopover = false
    },
    remove (row, column, event) {
      if (row != null) {
        this.selection = row
      }
    },
    btnbaocun () {
      this.shows = false
      this.show = true
      this.$api.linkAssets.coreworkloads(this.selection).then(res => {
        if (res.success) {
          this.tableData = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    btnxiugai () {
      if (this.selection) {
        this.$message({
          type: 'error',
          message: '请选择要修改的数据'
        })
      } else {
        this.shows = true
        this.show = false
      }
    },
    quxiaobtn () {
      this.show = true
      this.shows = false
      this.addpose()
    },
    jichengbtn () {
      this.$api.linkAssets.coreworkloadsjc(this.selection).then(res => {
        // console.log(res)
        if (res.success) {
          this.tableData = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    gettabs () {
      this.loading = true
      this.$api.linkAssets.querying({
        corpId: this.$store.getters.currentCorp.pk_gs,
        period: this.datas.slice(0, this.datas.length - 3)
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.tableData = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    resas () {
      this.gettabs()
    }

  },
  created () {
    this.gettabs()
  }

}
</script>

<style scoped lang="less">
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}

/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/deep/input[type="number"] {
  -moz-appearance: textfield;
}
/deep/.contents .el-input__inner {
  border: none;
  background: #ffffff;
}
</style>
