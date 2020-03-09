<!--资产清理-->
<template>
  <div style="position: relative;border: 1px solid #ddd;background:rgba(255,255,255,1)">
    <el-container>
      <Header :isShow="{isShowCompany}">
        <el-row slot="HeadRight">
          <el-button size="mini" @click="deleteTableRow">删除</el-button>
          <el-button size="mini" @click="refresh(1)">刷新</el-button>
          <!--<el-button size="mini" @click="print">打印</el-button>-->
          <el-button size="mini" @click="turnLedgers">转总账</el-button>
          <el-button size="mini" @click="linkPz">联查凭证</el-button>
        </el-row>
        <el-container slot="SelectCondition">
          <el-main>
            <el-form-item>
              <h4>资产清理查询</h4>
            </el-form-item>
            <el-form-item
              size="mini"
              label="日期:"
              label-width="100"
              style="border-bottom: 1px dashed #dadada;padding-bottom: 5px;padding-left: 28px"
            >
              <el-date-picker
                v-model="date"
                type="daterange"
                unlink-panels
                range-separator="-"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                style="width: 315px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item size="mini" label="资产卡片:" label-width="100">
              <el-select
                v-model="queryForm.asscd_id"
                :clearable = "true"
                style="width: 315px">
                <el-option
                  v-for="item in assetsCardOption"
                  :key="item.id_assetcard"
                  :value="item.id_assetcard"
                  :label="item.ascode + '   '+ item.asname">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="卡片编码:" label-width="100">
              <el-input placeholder v-model="ascode" type="select" style="width: 315px"></el-input>
            </el-form-item>
            <div style="text-align: right;margin-top: 12px">
              <el-button size="small" @click="clearPose" >取消</el-button>
              <el-button size="small" type="primary" @click="confirm">确定</el-button>
            </div>
          </el-main>
        </el-container>
      </Header>
    </el-container>
    <el-container>
      <el-main>
        <el-table
          id="table_list"
          :data="tableList"
          highlight-current-row
          @current-change="handleCurrentChange"
          ref="tableCorpRef"
          stripe
          border
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :height="height"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="asscd_nm" label="资产卡片" align="center" width="120"></el-table-column>
          <el-table-column prop="bsdt" label="清理日期" align="center" width="120"></el-table-column>
          <el-table-column prop="bzzz" label="转凭证" align="center"  width="120"></el-table-column>
          <el-table-column prop="voucherno" label="凭证号" align="center" width="120">
            <template slot-scope="scope" v-if="scope.row.vch_id != null">
              记<el-link  type="primary"  @click.stop.prevent="linkPzById(scope.row.vch_id)">{{scope.row.voucherno}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <printForm v-if="isShowPrint"></printForm>
  </div>
</template>

<script>
import Header from '../../components/Header'
import printForm from '../../components/printForm'
import AssetsRefor from '../../components/AssetsRefor'
import { getMonthBegin, getMonthEnd } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'zcql',
  mixins: [datePickerMixin],
  components: {
    Header,
    printForm,
    AssetsRefor
  },
  data () {
    return {
      isShowCompany: false,
      isShowPrint: false,
      loading: false,
      tableList: [],
      height: 0,
      date: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      assetsCard: '',
      assetsCardOption: [], // 资产卡片
      currentRow: '',
      message: '',
      queryForm: {
        asscd_id: '',
        ascode: ''
      }
    }
  },
  methods: {
    // 查询
    confirm: function (Msg) {
      this.message = Msg
      this.getDateToReturn()
      this.loadTableList(1)
    },
    // 刷新
    refresh: function (val) {
      this.loadTableList(val)
    },
    loadTableList: function (val) { // 加载
      this.queryForm.start_date = this.date[0]
      this.queryForm.end_date = this.date[1]
      this.loading = true
      this.$api.toLowerCases.queryList(this.queryForm).then(result => {
        this.loading = false
        if (result.success && (result.data !== undefined || result.rows !== undefined)) {
          this.tableList = result.rows
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    print: function () {
      if (this.tableList.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.isShowPrint = true
    },
    printTableList: function (data) { // 确认打印
      let param = {
        type: data.printInfo.type,
        pageOrt: data.printInfo.pageOrt,
        left: data.printInfo.left,
        top: data.printInfo.top,
        font: data.printInfo.font,
        printdate: this.date[0] + '~' + this.date[1],
        corpName: this.$store.getters.currentCorp.uname,
        period: this.date[0] + '~' + this.date[1],
        data: JSON.stringify(this.tableList)
      }
      this.$api.toLowerCases.printData('资产清理', param)
    },
    // 根据id联查凭证
    linkPzById: function (id_voucher) {
      if (!id_voucher) {
        this.$message({showClose: true, message: '尚未转总账,无凭证！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: id_voucher
        }
      })
    },
    // 联查凭证
    linkPz: function () {
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.linkPzById(this.currentRow.vch_id)
    },
    deleteTableRow: function () { // 删除
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (this.currentRow.bzzz === '是') {
        this.$message({showClose: true, message: '资产清理单已经转总账，不允许删除！', type: 'warning'})
        return
      }
      this.$confirm('确认删除?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.toLowerCases.deleteDataRow(this.currentRow).then(result => {
          this.successMsg(result)
          if (result.success) {
            this.refresh(-1) // 刷新数据
          }
        })
      })
    },
    // 转总账
    turnLedgers: function () {
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (this.currentRow.bzzz === '是') {
        this.$message({showClose: true, message: '资产清理单已经转总账，不允许重复操作！', type: 'warning'})
        return
      }
      this.$api.toLowerCases.toLedeger(this.currentRow).then(result => {
        this.successMsg(result)
        if (result.success) {
          this.refresh(-1)
        }
      })
    },
    clearPose: function () {
      this.getDateToReturn()
    },
    getDateToReturn: function () {
      let retParam = {
        times: this.date[0] + '~' + this.date[1],
        visiblePopover: false
      }
      this.$bus.$emit('date', retParam)
    },
    handleCurrentChange: function (val) {
      this.currentRow = val
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          message: data.msg, // this.message !== '' ? this.message + '成功' : '查询成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: data.msg,
          type: 'error'
        })
      }
    }
  },
  created () {
    this.height = window.innerHeight - 175
  },
  mounted () {
    this.getDateToReturn()
    this.loadTableList()
    this.$api.assetsCard.loadData({isclear: 'Y'}).then(result => {
      if (result.success) {
        this.assetsCardOption = result.rows
      }
    })
    this.$bus.$off('printinfo')
    this.$bus.$on('printinfo', (data) => {
      this.isShowPrint = data.printForm
      if (data.printInfo !== undefined) {
        this.printTableList(data)
      }
    })
  }
}
</script>

<style scoped>
.el-main {
  padding: 0px;
}
.el-range-editor--mini.el-input__inner {
  width: 75%;
}
</style>
