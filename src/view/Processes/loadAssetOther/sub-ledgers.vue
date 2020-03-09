<template>
  <div style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);">
    <el-container>
      <Header>
        <el-row slot="HeadRight">
          <el-button @click="print">打印</el-button>
        </el-row>
        <el-container slot="SelectCondition">
          <el-main>
            <el-form-item>
              <h4>总账对账查询</h4>
            </el-form-item>
            <el-form-item
              label="日期："
              label-width="75px"
              size="mini"
              style="border-bottom: 1px dashed #dadada;padding-bottom: 8px;margin-bottom: 10px"
            >
              <el-date-picker
                v-model="datevalue"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <div style="text-align: right;margin-top: 12px">
              <el-button size="small" type="primary" @click="addpose">确定</el-button>
              <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
            </div>
          </el-main>
        </el-container>
      </Header>
    </el-container>
    <el-container>
      <el-main style="padding: 0">
        <el-table
          id="table_list"
          :data="tableList"
          ref="tableCorpRef"
          :height="height"
          stripe
          border
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="zcsx" label="资产属性" min-width="160" sortable align="center"></el-table-column>
          <el-table-column prop="zclb" label="资产类别" :show-overflow-tooltip="true" min-width="160" sortable align="center"></el-table-column>
          <el-table-column prop="zckm" label="资产科目" min-width="160" sortable align="center"></el-table-column>
          <el-table-column prop="zzkmbh" label="总账科目编号" min-width="160" sortable align="center"></el-table-column>
          <el-table-column prop="zzkmmc" label="总账科目名称" :show-overflow-tooltip="true" min-width="160" sortable align="center"></el-table-column>
          <el-table-column label="资金金额" width="160" align="right"  header-align="center" :formatter="repformny">
          </el-table-column>
          <el-table-column label="总账" min-width="160" align="right"  header-align="center" :formatter="repformny">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <printForm v-if="isShowPrint"></printForm>
  </div>
</template>

<script>
import Header from '../components/Header'
import printForm from '../components/printForm'
import { getMonthBegin } from '@/utils'
export default {
  name: 'zzdz',
  components: {
    Header,
    printForm
  },
  data () {
    return {
      isShowPrint: false,
      loading: false,
      tableList: [],
      height: 0,
      datevalue: getMonthBegin(this.$store.getters.getLoginDate)
    }
  },
  methods: {
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    print: function () {
      this.isShowPrint = true
    },
    addpose: function () {
      this.getDateToRetun()
      this.loadTableList(1)
    },
    clearPose: function () {
      this.datevalue = ''
      let param = {
        visiblePopover: false
      }
      this.$bus.$emit('date', param)
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    formatDate: function (date) {
      date.setTime(date.getTime())
      return date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1) + '-' + this.checkTime(date.getDate())
    },
    getDateToRetun: function () {
      let param = {
        times: this.datevalue,
        visiblePopover: false
      }
      this.$bus.$emit('date', param)
    },
    loadTableList: function (val) {
      this.loading = true
      this.$api.generalLedger.queryData({ start_date: this.datevalue }).then(result => {
        this.loading = false
        if (result.success) {
          this.tableList = result.rows
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    printTableList: function (data) {
      let param = {
        type: data.printInfo.type,
        pageOrt: data.printInfo.pageOrt,
        left: data.printInfo.left,
        top: data.printInfo.top,
        font: data.printInfo.font,
        printdate: this.formatDate(data.printInfo.printdate),
        corpName: this.$store.getters.currentCorp.uname,
        period: this.datevalue,
        list: JSON.stringify(this.tableList)
      }
      this.$api.generalLedger.printData('总账对账', param)
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          message: data.msg,
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
    this.getDateToRetun()
    this.loadTableList()

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
  padding: 0;
}
.el-form-item--medium {
  margin-bottom: 10px;
}
</style>
