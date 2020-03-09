<!--资产总账-->
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
            v-model="tabdate"
          ></el-input>
        </el-form-item>
        <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
          <h4>资产总账查询</h4>
          <div
            style="width: 96%; height: 50px; margin: 0 auto; border-bottom:1px dashed #ccc; line-height:45px; display:flex"
          >
            <span style="margin-left:14px;">日期：</span>
            <div class="block" style="margin-left:19px; display:flex;width:80%;">
              <el-date-picker
                v-model="datevalue"
                type="date"
                placeholder="选择日期"
                style="width:42%; margin-left:24px"
              ></el-date-picker>
              <span style="padding-left:5px;">-</span>
              <el-date-picker
                v-model="datevalueon"
                type="date"
                placeholder="选择日期"
                style="width:43%; margin-left:4px"
              ></el-date-picker>
            </div>
          </div>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">公司：</span>
            <el-select
              v-model="valueda"
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
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">资产属性：</span>
            <el-select v-model="zcxs" clearable  placeholder="请选择" style="width:72%; margin-right:15px;">
              <el-option
                v-for="item in optionsvalue"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="text-align: right;margin-top: 12px">
            <el-button size="small" type="primary" @click="query(value)">确定</el-button>
            <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
          </div>
        </el-popover>
        <el-form-item label="公司:" size="small" label-width="50px" style="float: left">
          <span>{{unam.uname===undefined?valcop:unam.uname}}</span>
        </el-form-item>
        <el-row style="float:right;margin-right:14px" size="small">
          <el-button @click="print">打印</el-button>
        </el-row>
      </el-form>
    </header>
    <div class="contents">
      <el-table
        :data="tableData"
        style="width: 100%;height:100%"
        height="100%"
        stripe
        v-loading="loading"
        element-loading-text="数据处理中，请稍候..."
        element-loading-spinner="el-icon-loading"
        border
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          label="期间"
          align="center"
          width="160"
          sortable
        >{{tabdate===''?tabdates:tabdate}}</el-table-column>
        <el-table-column prop="zy" label="摘要" align="center" width="150" sortable></el-table-column>
        <el-table-column label="固定资产" align="center">
          <el-table-column prop="yzjf" align="right" header-align="center" label="借方" width="150" sortable :formatter="repformny"></el-table-column>
          <el-table-column prop="yzdf" label="贷方" align="right"  header-align="center" width="150" :formatter="repformny"></el-table-column>
          <el-table-column prop="yzye" label="余额" align="right" header-align="center" width="150" sortable :formatter="repformny"></el-table-column>
        </el-table-column>
        <el-table-column label="累计折旧" align="center">
          <el-table-column prop="ljjf" label="借方" align="right" header-align="center" width="150" sortable :formatter="repformny"></el-table-column>
          <el-table-column prop="ljdf" label="贷方" align="right" header-align="center" width="150" :formatter="repformny"></el-table-column>
          <el-table-column prop="ljye" label="余额" align="right" header-align="center" width="150" sortable :formatter="repformny"></el-table-column>
        </el-table-column>
        <el-table-column prop="jzye" label="净值余额" align="right" width="150" header-align="center" sortable :formatter="repformny"></el-table-column>
      </el-table>
    </div>
    <printForm v-if="isShowPrint"></printForm>
  </div>
</template>

<script>
import Header from '../components/Header'
import CorpDialog from '@/components/reference/CorpDialog'
import printForm from '../components/printForm'
import {ASSET_PROP} from '@/constants/asset'
import { getExportColumns, formatDate, getMonthEnd } from '@/utils'
export default {
  name: 'zczz',
  components: {
    Header,
    CorpDialog,
    printForm
  },
  data () {
    return {
      value: '',
      tabdate: this.$store.getters.currentCorp.bdate + '-' + getMonthEnd(this.$store.getters.currentCorp.accountProgressDate),
      datevalue: this.$store.getters.currentCorp.bdate,
      datevalueon: getMonthEnd(this.$store.getters.currentCorp.accountProgressDate),
      loading: false,
      tableData: [],
      optionsvalue: ASSET_PROP,
      IsShowDate: true,
      lists: [],
      dialogVisible: false,
      zcxs: null,
      isShowPrint: false,
      optionsval: this.$store.getters.corps,
      valcop: this.$store.getters.currentCorp.uname,
      valueda: this.$store.getters.currentCorp.pk_gs,
      tabdates: '',
      unam: {},
      visiblePopover: false
    }
  },
  methods: {
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    formatter (row, column) {
      return row.address
    },
    Xcompe () {
      this.dialogVisible = true
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    formatDate (date) {
      if (date.length < 20) {
        return date
      } else {
        date.setTime(date.getTime())
        return date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1) + '-' + this.checkTime(date.getDate())
      }
    },
    clearPose: function () {
      this.visiblePopover = false
    },
    // 确认查询
    query (value) {
      this.loading = true
      this.$api.linkAssets.GetAssetTypeCount({
        corpIds: this.valueda, // 公司主键
        begindate: this.formatDate(this.datevalue), // 开始时间
        enddate: this.formatDate(this.datevalueon), // 结束时间
        zcsx: this.zcxs
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
      this.tabdate = this.formatDate(this.datevalue) + '--' + this.formatDate(this.datevalueon)
      this.visiblePopover = false
      this.unam = this.optionsval.find(item => {
        return item.pk_gs === this.valueda
      }) || {}
    },
    print: function () {
      this.isShowPrint = true
    },
    printTableList: function (data) {
      let param = {
        type: data.printInfo.type,
        left: data.printInfo.left,
        pageOrt: data.printInfo.pageOrt,
        top: data.printInfo.top,
        font: data.printInfo.font,
        printdate: this.formatDate(data.printInfo.printdate),
        corpName: this.$store.getters.currentCorp.uname,
        period: this.tabdate,
        list: JSON.stringify(this.tableData),
        zcsx: this.Subject
      }
      this.$api.linkAssets.GetAssetTypeCountpdf('资产总账', param)
    }
  },
  created () {
    this.query()
    this.height = window.innerHeight - 175
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
    })
  },
  mounted () {
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
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}
.cell {
  text-align: center;
}
</style>
