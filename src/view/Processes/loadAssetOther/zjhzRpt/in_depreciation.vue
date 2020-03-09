<!--折旧汇总表-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">日期：
            <el-popover
              placement="bottom-start"
              title="折旧汇总表查询"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="日期：">
                  <el-date-picker
                    v-model="queryForm.period"
                    type="month"
                    placeholder="选择月"
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width: 315px"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select filterable
                             v-model="queryForm.corpIds"
                             style="width: 315px">
                    <el-option
                      v-for="item in optionsval"
                      :key="item.pk_gs"
                      :label="item.uname"
                      :value="item.pk_gs"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="资产属性：">
                  <el-select v-model="queryForm.zcsx" clearable placeholder="请选择"  style="width: 315px">
                    <el-option
                      v-for="item in optionsvalue"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="资产类别：">
                  <el-input  placeholder ="请选择类别"
                             suffix-icon="el-icon-search"
                             readonly v-model="queryForm.assetsTypeval" @click.native="openZclb"
                             style="width: 315px"
                  ></el-input>
                </el-form-item>
                <AssetsType ref="assetsTypeSelect" @findinde="zclbConfirm"></AssetsType>
<!--                <el-form-item label="类别级次：">-->
<!--                  <el-select-->
<!--                    v-model="queryForm.levelq"-->
<!--                    placeholder="请选择"-->
<!--                    style="width: 150px"-->
<!--                  >-->
<!--                    <el-option-->
<!--                      v-for="item in opsitionsdata"-->
<!--                      :key="item.value"-->
<!--                      :label="item.label"-->
<!--                      :value="item.value"-->
<!--                    ></el-option>-->
<!--                  </el-select>-->

<!--                  <el-select-->
<!--                    v-model="queryForm.levelz"-->
<!--                    placeholder="请选择"-->
<!--                    style="width: 150px"-->
<!--                  >-->
<!--                    <el-option-->
<!--                      v-for="item in opsitionsdata"-->
<!--                      :key="item.value"-->
<!--                      :label="item.label"-->
<!--                      :value="item.value"-->
<!--                    ></el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small"   @click="clearPose" >取消</el-button>
                  <el-button size="small" type="primary" @click="addpose">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{datevalue}}
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{unam.uname===undefined?valcop:unam.uname}}</span>
          <span class="query-corp">资产属性: {{queryForm.zcsx | formatZcSx}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="refresh">刷新</el-button>
          <el-button>联查明细</el-button>
          <el-button @click="print">打印</el-button>
          <el-button @click="exportTableList">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          :data="tableData"
          style="width: 100%;height:100%"
          border
          height="100%"
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          size="small"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column
            prop="assetproperty"
            label="资产属性"
            sortable
            header-align="center"
            align="left"
            width="180"
          >
            <template slot-scope="sope">
              <span>{{sope.row.assetproperty| formatZcSx}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="catename"
            align="left"
            label="资产类别"
            sortable
            width="240"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="assetmny"
            label="资产原值"
            header-align="center"
            align="right"
            width="180"
            :formatter="repformny"
          ></el-table-column>
          <el-table-column
            prop="originalvalue"
            label="本期折旧额"
            header-align="center"
            align="right"
            width="180"
            :formatter="repformny"
          ></el-table-column>
          <el-table-column
            prop="depreciationmny"
            header-align="center"
            align="right"
            label="累计折旧额"
            width="180"
            :formatter="repformny"
          ></el-table-column>
          <el-table-column
            prop="assetnetmny"
            header-align="center"
            align="right"
            label="资产净值"
            width="180"
            :formatter="repformny"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <!--打印对话框-->
    <print-dialog ref="printdialog" :enddate ="enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import BackToTop from '@/components/BackToTop/index'
import AssetsType from '../../components/AssetsTypeSelect'
import {ASSET_PROP, ZCLB_LEVEL} from '@/constants/asset'
import { getMonthBegin, getMonthEnd, formatDate } from '@/utils'
import assetMixin from '@/filters/asset'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  mixins: [assetMixin, datePickerMixin],
  name: 'zjhzb',
  components: {
    CorpDialog,
    AssetsType,
    BackToTop,
    PrintDialog
  },
  data () {
    return {
      nodename: '折旧汇总表',
      queryForm: {
        period: this.$store.getters.getLoginDate.slice(0, this.$store.getters.currentCorp.bdate.length - 3), // 查询日期
        corpIds: this.$store.getters.currentCorp.pk_gs, // 公司主键
        pk_assetcategory: '', // 资产属性
        assetsTypeval: '', // 资产类别名称
        zcsx: '', // 资产属性
        levelq: 1,
        levelz: 5
      },
      datevalue: this.$store.getters.getLoginDate.slice(0, this.$store.getters.currentCorp.bdate.length - 3),
      visiblePopover: false,
      loading: false,
      tableData: [],
      optionsval: this.$store.getters.corps,
      valcop: this.$store.getters.currentCorp.uname,
      optionsvalue: ASSET_PROP,
      opsitionsdata: ZCLB_LEVEL,
      unam: {}
    }
  },
  computed: {
    enddate: function () {
      return getMonthEnd(this.queryForm.period)
    }
  },
  methods: {
    // 格式化金额
    repformny (row, column, cellValue) {
      if (cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    // 打开资产类别
    openZclb () {
      this.$refs.assetsTypeSelect.show()
    },
    formatter (row, column) {
      return row.address
    },
    // 查询
    getdatatab () {
      this.loading = true
      this.$api.zjhzReport.tableofcontents(this.queryForm).then(res => {
        if (res.success) {
          this.tableData = res.rows
          this.$message({type: 'success', message: res.msg})
        } else {
          this.$message({type: 'error', message: res.msg})
          this.tableData = []
        }
        this.loading = false
      })
    },
    // 刷新
    refresh () {
      this.getdatatab()
    },
    // 确定
    addpose () {
      this.getdatatab()
      this.datevalue = this.queryForm.period
      this.visiblePopover = false
      this.unam = this.optionsval.find(item => {
        return item.pk_gs === this.queryForm.corpIds
      }) || {}
    },
    // 取消
    clearPose: function () {
      this.visiblePopover = false
    },
    // 资产类别确定
    zclbConfirm (val) {
      this.queryForm.pk_assetcategory = val.id
      this.queryForm.assetsTypeval = val.name
    },
    print: function () {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        data: JSON.stringify(this.tableData),
        corpName: this.unam.uname,
        period: this.queryForm.period
      }
      this.$api.zjhzReport.printPdf(this.nodename, Object.assign({}, val, otherprintparam))
    },
    exportTableList: function () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      let param = {
        strlist: JSON.stringify(this.tableData),
        corpName: this.$store.getters.currentCorp.uname,
        qj: formatDate(this.datevalue)
      }
      this.$api.zjhzReport.exportData(this.nodename + this.datevalue, param)
    }
  },
  created () {
    this.height = window.innerHeight - 175
    this.getdatatab()
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
</style>
